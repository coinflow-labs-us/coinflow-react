import React, {useMemo, useRef} from 'react';
import {
  CoinflowIFrameProps,
  CoinflowPurchaseProps,
  CoinflowUtils,
  getHandlers,
  getWalletPubkey,
  IFrameMessageHandlers,
} from './common';
import {
  CoinflowIFrame,
  CoinflowIFrameExposedFunctions,
  useRandomHandleHeightChangeId,
} from './CoinflowIFrame';
import {useOverlay} from './useOverlay';

function useCoinflowPurchase(
  purchaseProps: CoinflowPurchaseProps,
  version: string
) {
  const handleHeightChangeId = useRandomHandleHeightChangeId();
  const iframeProps = useMemo<CoinflowIFrameProps>(() => {
    const walletPubkey = getWalletPubkey(purchaseProps);
    return {
      ...purchaseProps,
      walletPubkey,
      route: `/purchase${version}/${purchaseProps.merchantId}`,
      transaction: CoinflowUtils.getTransaction(purchaseProps),
      handleHeightChangeId,
    };
  }, [handleHeightChangeId, purchaseProps, version]);

  const messageHandlers = useMemo<IFrameMessageHandlers>(() => {
    return {
      ...getHandlers(purchaseProps),
      handleHeightChange: purchaseProps.handleHeightChange,
    };
  }, [purchaseProps]);

  return {iframeProps, messageHandlers};
}

export function CoinflowPurchase(purchaseProps: CoinflowPurchaseProps) {
  const iframeRef = useRef<CoinflowIFrameExposedFunctions>(null);
  const {iframeProps, messageHandlers} = useCoinflowPurchase(
    purchaseProps,
    '-v2'
  );

  const {showOverlay} = useOverlay(iframeRef);

  const loaderBackground = iframeProps.loaderBackground || '#ffffff'; // white default bg
  const invertedColor = invertHexColor(loaderBackground);

  return (
    <div style={styles.container(loaderBackground)}>
      <CoinflowIFrame ref={iframeRef} {...iframeProps} {...messageHandlers} />
      {showOverlay && (
        <LoaderOverlay
          loaderBackground={loaderBackground}
          invertedColor={invertedColor}
        />
      )}
    </div>
  );
}

function LoaderOverlay({
  loaderBackground,
  invertedColor,
}: {
  loaderBackground: string;
  invertedColor: string;
}) {
  return (
    <div style={styles.overlay(loaderBackground)}>
      <LoaderGrid columns={2}>
        <Loader loaderBackground={invertedColor} />
        <Loader loaderBackground={invertedColor} />
      </LoaderGrid>
      <LoaderGrid columns={1}>
        <Loader height={80} loaderBackground={invertedColor} />
      </LoaderGrid>
      {[...Array(3)].map((_, index) => (
        <LoaderRow key={index}>
          <Loader
            width={index < 2 ? 80 : 120}
            height={index < 2 ? 15 : 20}
            loaderBackground={invertedColor}
          />
          <Loader
            width={index < 2 ? 60 : 100}
            height={index < 2 ? 15 : 20}
            loaderBackground={invertedColor}
          />
        </LoaderRow>
      ))}
      <LoaderGrid columns={1}>
        <Loader height={60} loaderBackground={invertedColor} />
      </LoaderGrid>
      <LoaderGrid columns={1} width="50%">
        <Loader height={10} loaderBackground={invertedColor} />
      </LoaderGrid>
      <LoaderGrid columns={1} width="40%">
        <Loader height={6} loaderBackground={invertedColor} />
      </LoaderGrid>
    </div>
  );
}

function LoaderGrid({
  children,
  columns,
  width = '100%',
}: React.PropsWithChildren<{columns: number; width?: string}>) {
  return (
    <div
      style={{
        ...styles.grid,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        width,
      }}
    >
      {children}
    </div>
  );
}

function LoaderRow({children}: React.PropsWithChildren<{}>) {
  return <div style={styles.row}>{children}</div>;
}

function Loader({
  loaderBackground,
  height = 40,
  width,
}: {
  loaderBackground: string;
  height?: number;
  width?: number;
}) {
  return (
    <>
      <div style={styles.loader(loaderBackground, height, width)} />
      <style>{styles.keyframes}</style>
    </>
  );
}

function invertHexColor(hex: string): string {
  hex = hex.replace(/^#/, '');
  const rgb = hex.match(/.{2}/g)?.map(val => 255 - parseInt(val, 16)) || [];
  return `#${rgb.map(val => val.toString(16).padStart(2, '0')).join('')}`;
}

const styles = {
  container: (bg: string) => ({
    position: 'relative' as const,
    height: '100%',
    backgroundColor: bg,
  }),
  overlay: (bg: string) => ({
    backgroundColor: bg,
    display: 'flex',
    color: 'gray',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: 24,
    alignItems: 'center',
    flexDirection: 'column' as const,
    gap: '20px',
    zIndex: 10,
    padding: '20px',
  }),
  grid: {
    display: 'grid',
    gap: '20px',
    width: '100%',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  loader: (bg: string, height: number, width?: number) => ({
    width: width ? `${width}px` : '100%',
    height: `${height}px`,
    backgroundColor: bg,
    borderRadius: '4px',
    animation: 'pulse 1.5s infinite',
  }),
  keyframes: `
    @keyframes pulse {
      0%, 100% { opacity: 0.07; }
      50% { opacity: 0.03; }
    }
  `,
};
