import React from 'react';
import {styles} from './Utils';

export function LoaderOverlay({
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
