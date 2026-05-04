export function invertHexColor(hex: string): string {
  hex = hex.replace(/^#/, '');
  const rgb = hex.match(/.{2}/g)?.map(val => 255 - parseInt(val, 16)) || [];
  return `#${rgb.map(val => val.toString(16).padStart(2, '0')).join('')}`;
}

export const styles = {
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
