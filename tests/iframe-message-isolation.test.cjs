const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const esbuild = require('esbuild');
const {JSDOM} = require('jsdom');
const React = require('react');

async function loadComponent(file, commonStub) {
  const result = await esbuild.build({
    entryPoints: [path.join(__dirname, '..', file)],
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node',
    external: ['react'],
    plugins: [{
      name: 'isolate-iframe-message-handlers',
      setup(build) {
        build.onResolve({filter: /^(\.\.?\/common|lz-string)$/}, args => ({
          path: args.path === 'lz-string' ? 'lz-string' : 'common',
          namespace: 'test-stub',
        }));
        build.onLoad({filter: /.*/, namespace: 'test-stub'}, args => ({
          loader: 'js',
          contents: args.path === 'lz-string'
            ? 'export default {compressToEncodedURIComponent: value => value}'
            : commonStub,
        }));
      },
    }],
  });
  const module = {exports: {}};
  new Function('require', 'module', 'exports', result.outputFiles[0].text)(
    require, module, module.exports
  );
  return module.exports;
}

async function withDom(run) {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', {
    url: 'https://merchant.example',
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.HTMLElement = dom.window.HTMLElement;
  global.HTMLIFrameElement = dom.window.HTMLIFrameElement;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const {createRoot} = require('react-dom/client');
  const root = createRoot(document.getElementById('root'));
  try {
    await run({root, act: React.act});
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    delete global.window;
    delete global.document;
    delete global.navigator;
    delete global.HTMLElement;
    delete global.HTMLIFrameElement;
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
}

function sendFrom(frame, data) {
  window.dispatchEvent(new window.MessageEvent('message', {
    origin: 'https://sandbox.coinflow.cash',
    source: frame.contentWindow,
    data,
  }));
}

test('shared iframe callbacks and response listeners accept only their own frame', async () => {
  // The common module is stubbed so this test exercises the React component
  // without loading a hosted Coinflow page or making a payment.
  const {CoinflowIFrame} = await loadComponent('src/CoinflowIFrame.tsx', `
    export const CoinflowUtils = {
      getCoinflowUrl: () => 'about:blank',
      getCoinflowIntentsUrl: () => 'about:blank',
      getCoinflowBaseUrl: () => 'https://sandbox.coinflow.cash',
    };
    export function handleIFrameMessage(raw, handlers) {
      if (!raw.startsWith('{')) return;
      const message = JSON.parse(raw);
      if (message.method === 'success') handlers.onSuccess?.(message.info);
    }
  `);

  await withDom(async ({root, act}) => {
    let callbackA = 0;
    let callbackB = 0;
    const refA = React.createRef();
    const refB = React.createRef();
    await act(async () => root.render(React.createElement(React.Fragment, null,
      React.createElement(CoinflowIFrame, {
        env: 'sandbox', ref: refA, onSuccess: () => callbackA++,
      }),
      React.createElement(CoinflowIFrame, {
        env: 'sandbox', ref: refB, onSuccess: () => callbackB++,
      })
    )));
    const [frameA, frameB] = document.querySelectorAll('iframe');

    await act(async () => sendFrom(frameA, JSON.stringify({
      method: 'success', data: '', info: {paymentId: 'synthetic-test'},
    })));
    assert.equal(callbackA, 1);
    assert.equal(callbackB, 0);

    let resolvedA = false;
    let resolvedB = false;
    const responseA = refA.current.listenForMessage(data => data === 'ack')
      .then(() => {resolvedA = true;});
    const responseB = refB.current.listenForMessage(data => data === 'ack')
      .then(() => {resolvedB = true;});
    await act(async () => sendFrom(frameA, 'ack'));
    await responseA;
    assert.equal(resolvedA, true);
    assert.equal(resolvedB, false);
    await act(async () => sendFrom(frameB, 'ack'));
    await responseB;
    assert.equal(resolvedB, true);
  });
});

test('concurrent card forms resolve only their own tokenize responses', async () => {
  const {CoinflowCardForm} = await loadComponent(
    'src/card-form/CoinflowCardFormV2.tsx', `
      export const CoinflowUtils = {
        getCoinflowBaseUrl: () => 'https://sandbox.coinflow.cash',
      };
      export const IFrameMessageMethods = {
        Loaded: 'loaded', HeightChange: 'heightChange',
        InputError: 'inputError', InputValid: 'inputValid',
      };
      export const INLINE_SKELETON_HEIGHT_PX = 100;
      export const SKELETON_LAYOUTS = {
        'card-form': {compact: false, areas: []},
        'card-number-form': {compact: false, areas: []},
        'cvv-form': {compact: false, areas: []},
      };
      export const SKELETON_BOX_STYLE = {};
      export const SKELETON_FADE_MS = 0;
      export const SKELETON_ROOT_PADDING_PX = 0;
      export const buildSkeletonCss = () => '';
      export const getSkeletonColors = () => ({backdrop: '#fff', box: '#ddd'});
      export const getSkeletonGridClass = () => '';
      export const guessSkeletonHeightPx = () => 100;
    `
  );

  await withDom(async ({root, act}) => {
    const refA = React.createRef();
    const refB = React.createRef();
    await act(async () => root.render(React.createElement(React.Fragment, null,
      React.createElement(CoinflowCardForm, {merchantId: 'test', env: 'sandbox', ref: refA}),
      React.createElement(CoinflowCardForm, {merchantId: 'test', env: 'sandbox', ref: refB})
    )));
    const [frameA, frameB] = document.querySelectorAll('iframe');
    const tokenA = refA.current.tokenize();
    const tokenB = refB.current.tokenize();
    await act(async () => sendFrom(frameA, JSON.stringify({
      method: 'tokenize', data: {token: 'synthetic-A'},
    })));
    await act(async () => sendFrom(frameB, JSON.stringify({
      method: 'tokenize', data: {token: 'synthetic-B'},
    })));
    assert.equal((await tokenA).token, 'synthetic-A');
    assert.equal((await tokenB).token, 'synthetic-B');
  });
});
