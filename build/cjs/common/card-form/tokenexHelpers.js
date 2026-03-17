"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIframeConfig = getIframeConfig;
exports.setTokenExScriptTag = setTokenExScriptTag;
exports.doInitializeCvvOnlyTokenExIframe = doInitializeCvvOnlyTokenExIframe;
exports.doInitializeTokenExIframe = doInitializeTokenExIframe;
exports.doInitializeTokenExCardOnlyIframe = doInitializeTokenExCardOnlyIframe;
const TokenEx_1 = require("./TokenEx");
const CoinflowUtils_1 = require("../CoinflowUtils");
async function getIframeConfig(args) {
    const { token, origins, env } = args;
    return new Promise((resolve, reject) => {
        fetch(new CoinflowUtils_1.CoinflowUtils(env).url + '/api/tokenize/iframe/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                origins,
                token,
                merchantId: 'merchantId' in args ? args.merchantId : undefined,
                checkoutJwt: 'checkoutJwt' in args ? args.checkoutJwt : undefined,
            }),
        })
            .then(async (res) => {
            resolve((await res.json()));
        })
            .catch(e => reject(e));
    });
}
function setTokenExScriptTag({ env, setTokenExScriptLoaded, }) {
    const scriptTagId = 'tokenex-script';
    if (document.head.querySelector(`#${scriptTagId}`)) {
        setTokenExScriptLoaded(true);
    }
    const sdkScriptTag = document.createElement('script');
    sdkScriptTag.src =
        env === 'prod'
            ? 'https://htp.tokenex.com/iframe/iframe-v3.min.js'
            : 'https://test-htp.tokenex.com/iframe/iframe-v3.min.js';
    sdkScriptTag.id = scriptTagId;
    document.head.appendChild(sdkScriptTag);
    document.getElementById(scriptTagId).addEventListener('load', () => {
        console.log('Setting tokenExScriptLoaded to true!');
        setTokenExScriptLoaded(true);
    });
}
function loadIframe({ iframe, setCachedToken, setLoaded, }) {
    const tokenize = async () => {
        iframe.tokenize();
        return await new Promise((resolve, reject) => {
            iframe.on('tokenize', (data) => {
                setCachedToken(data.token);
                resolve(data);
            });
            iframe.on('validate', (data) => {
                // noinspection PointlessBooleanExpressionJS
                const isInvalid = !data.isValid || data.isCvvValid === false;
                if (isInvalid)
                    reject(data);
            });
        });
    };
    iframe.on('change', () => setCachedToken(undefined));
    iframe.on('cvvChange', () => setCachedToken(undefined));
    iframe.on('load', () => {
        setTimeout(() => setLoaded(true), 350);
        const el = document.querySelector('#tx_iframe_tokenExCardNumber');
        if (el) {
            // noinspection JSDeprecatedSymbols
            el.scrolling = 'no';
        }
    });
    iframe.on('focus', () => {
        iframe.focus();
    });
    iframe.on('cvvFocus', () => {
        iframe.cvvFocus();
    });
    setLoaded(false);
    iframe.load();
    return { ...iframe, tokenize };
}
async function doInitializeCvvOnlyTokenExIframe(args) {
    const { token, cardType } = args;
    return await doInitialize(TokenEx_1.TokenExCvvContainerID, args, {
        cvvOnly: true,
        cvv: true,
        cvvContainerID: TokenEx_1.TokenExCvvContainerID,
        placeholder: 'CVV',
        token,
        cardType: TokenEx_1.CARD_TYPE_MAPPING[cardType],
    });
}
async function doInitializeTokenExIframe(args) {
    return await doInitialize(TokenEx_1.TokenExCardNumberIframeId, args, {
        cvv: true,
        cvvContainerID: TokenEx_1.TokenExCvvContainerID,
        cvvPlaceholder: 'CVV',
    });
}
async function doInitializeTokenExCardOnlyIframe(args) {
    return await doInitialize(TokenEx_1.TokenExCardNumberIframeId, args, { cvv: false });
}
async function doInitialize(id, args, configOverrides) {
    const { tokenExScriptLoaded, css, debug, font, setCachedToken, setLoaded } = args;
    if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
        console.warn('Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#tokenex-script');
        return;
    }
    const iframeConfig = await getIframeConfig({
        ...args,
        token: configOverrides.token,
    });
    const { styles } = getStyles(css);
    const config = {
        ...iframeConfig,
        placeholder: '0000 0000 0000 0000',
        enablePrettyFormat: true,
        styles,
        font,
        debug: debug ?? false,
        ...configOverrides,
    };
    const iframe = TokenEx.Iframe(id, config);
    return loadIframe({ iframe, setCachedToken, setLoaded });
}
function getStyles(s) {
    const css = JSON.parse(s);
    const styles = {
        base: CSSPropertiesToComponent(css.base),
        focus: CSSPropertiesToComponent(css.focus),
        error: CSSPropertiesToComponent(css.error),
        placeholder: CSSPropertiesToComponent(css.placeholder),
        cvv: {
            base: CSSPropertiesToComponent(css.cvv?.base),
            focus: CSSPropertiesToComponent(css.cvv?.focus),
            error: CSSPropertiesToComponent(css.cvv?.error),
            placeholder: CSSPropertiesToComponent(css?.placeholder),
        },
    };
    return { styles };
}
function CSSPropertiesToComponent(dict) {
    if (!dict)
        return '';
    if (typeof dict === 'string')
        return dict;
    let str = '';
    for (const [key, value] of Object.entries(dict)) {
        let clo = '';
        key.split('').forEach(lt => {
            if (lt.toUpperCase() === lt) {
                clo += '-' + lt.toLowerCase();
            }
            else {
                clo += lt;
            }
        });
        str += clo + ':' + value + ';';
    }
    return str;
}
//# sourceMappingURL=tokenexHelpers.js.map