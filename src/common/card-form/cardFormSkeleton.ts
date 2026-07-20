/**
 * Framework-agnostic definitions for the V2 card-form skeleton loader.
 *
 * The React, Vue, and Angular libraries all render the same skeleton while the
 * card-form iframe loads. The grid templates and breakpoint come from the shared
 * {@link buildCardEntryLayout} — the SAME source of truth the real form uses —
 * so the skeleton reflows at exactly the width the loaded form does. Only the
 * box styling and per-framework wiring live here.
 */

import {
  buildCardEntryGridCss,
  buildCardEntryLayout,
  CardEntryInputName,
  CardEntryLayout,
  CARD_ENTRY_BORDER_PX,
  CARD_ENTRY_DIVIDER_PX,
  CARD_ENTRY_MARGIN_PX,
  CARD_ENTRY_ROW_HEIGHT_PX,
} from './cardEntryLayout';

export type CardFormVariant = 'card-form' | 'card-number-form' | 'cvv-form';

/** Which fields each iframe variant mounts. */
const VARIANT_INPUTS: Record<CardFormVariant, CardEntryInputName[]> = {
  'card-form': ['card-number', 'expiration', 'cvv'],
  'card-number-form': ['card-number', 'expiration'],
  'cvv-form': ['cvv'],
};

// The iframe skeletons render without the optional card-brand icon.
const CARD_ENTRY_LAYOUTS: Record<CardFormVariant, CardEntryLayout> = {
  'card-form': buildCardEntryLayout({inputs: VARIANT_INPUTS['card-form']}),
  'card-number-form': buildCardEntryLayout({
    inputs: VARIANT_INPUTS['card-number-form'],
  }),
  'cvv-form': buildCardEntryLayout({inputs: VARIANT_INPUTS['cvv-form']}),
};

// Iframe height (px) to guess before it reports its real height. Matches the
// form's rendered height so the skeleton→form swap doesn't jump: field row(s) +
// the 1px border and the box's `m-0.5` margin on top and bottom.
const CARD_ENTRY_VERTICAL_CHROME_PX =
  2 * CARD_ENTRY_BORDER_PX + 2 * CARD_ENTRY_MARGIN_PX;
export const INLINE_SKELETON_HEIGHT_PX =
  CARD_ENTRY_ROW_HEIGHT_PX + CARD_ENTRY_VERTICAL_CHROME_PX;
/** Two-row layouts are a second field row plus the 1px divider taller. */
export const COMPACT_SKELETON_HEIGHT_PX =
  2 * CARD_ENTRY_ROW_HEIGHT_PX +
  CARD_ENTRY_DIVIDER_PX +
  CARD_ENTRY_VERTICAL_CHROME_PX;

export type SkeletonLayout = {
  /** Single-row grid used at the iframe's default (wide) width. */
  inline: string;
  /** Two-row grid applied below `compactMaxWidthPx`; omitted when it never reflows. */
  compact?: string;
  /** Container width (px) below which the two-row grid applies. */
  compactMaxWidthPx?: number;
  /** grid-area names to render one skeleton box for, in DOM order (same in both layouts). */
  areas: string[];
};

function toSkeletonLayout(layout: CardEntryLayout): SkeletonLayout {
  return {
    inline: layout.inline,
    compact: layout.twoRow ?? undefined,
    compactMaxWidthPx: layout.breakpointPx ?? undefined,
    areas: layout.fieldAreas,
  };
}

export const SKELETON_LAYOUTS: Record<CardFormVariant, SkeletonLayout> = {
  'card-form': toSkeletonLayout(CARD_ENTRY_LAYOUTS['card-form']),
  'card-number-form': toSkeletonLayout(CARD_ENTRY_LAYOUTS['card-number-form']),
  'cvv-form': toSkeletonLayout(CARD_ENTRY_LAYOUTS['cvv-form']),
};

/** Name of the shared pulse keyframes; referenced by the box `animation`. */
export const SKELETON_PULSE_ANIMATION_NAME =
  'coinflow-card-form-skeleton-pulse';

/**
 * Duration (ms) of the skeleton's opacity fade-out. Matches the `opacity 300ms`
 * transition each renderer applies. Renderers unmount the skeleton on
 * `transitionend`, but that event can be skipped (reduced-motion, an ancestor
 * `display:none`, or opacity already 0) — so they also use this as a fallback
 * timeout to force the unmount and avoid a stuck (invisible) skeleton.
 */
export const SKELETON_FADE_MS = 300;

/**
 * Whether the given container width would trigger the variant's two-row layout.
 * Mirrors the real form's container query (`width < breakpoint`). Variants
 * without a two-row layout never reflow.
 */
export function shouldStackSkeleton({
  variant,
  width,
}: {
  variant: CardFormVariant;
  width: number;
}): boolean {
  const {compact, compactMaxWidthPx} = SKELETON_LAYOUTS[variant];
  return (
    compact !== undefined &&
    compactMaxWidthPx !== undefined &&
    width > 0 &&
    width < compactMaxWidthPx
  );
}

/**
 * Height to guess before the iframe reports its real height. The two-row layout
 * is a field row plus divider taller than the inline one.
 */
export function guessSkeletonHeightPx({
  variant,
  width,
}: {
  variant: CardFormVariant;
  width: number;
}): number {
  return shouldStackSkeleton({variant, width})
    ? COMPACT_SKELETON_HEIGHT_PX
    : INLINE_SKELETON_HEIGHT_PX;
}

/**
 * The `grid-template` to apply for the given container width. Frameworks that
 * drive the layout from JS (Vue, Angular) call this from their resize observer;
 * React instead injects a CSS container query via {@link buildSkeletonCss}.
 */
export function getSkeletonGridTemplate({
  variant,
  width,
}: {
  variant: CardFormVariant;
  width: number;
}): string {
  const {inline, compact} = SKELETON_LAYOUTS[variant];
  if (compact && shouldStackSkeleton({variant, width})) return compact;
  return inline;
}

/** Stable class name for a variant's skeleton grid element. */
export function getSkeletonGridClass(variant: CardFormVariant): string {
  return `coinflow-card-form-skeleton-grid--${variant}`;
}

/**
 * CSS (keyframes + grid + container-query breakpoint) for the container-query
 * driven renderer used by React, where the skeleton root is a query container.
 */
export function buildSkeletonCss(variant: CardFormVariant): string {
  const gridClass = getSkeletonGridClass(variant);
  const grid = buildCardEntryGridCss({
    gridSelector: `.${gridClass}`,
    layout: CARD_ENTRY_LAYOUTS[variant],
    extraBaseRules: `.${gridClass} { gap: 0; flex: 1; }`,
  });
  return `@keyframes ${SKELETON_PULSE_ANIMATION_NAME} {0%,100%{opacity:1}50%{opacity:0.4}}
${grid}`;
}

/**
 * Padding (px) to inset the skeleton grid by, applied on the skeleton root. It
 * equals the form's own chrome — its `m-0.5` margin plus 1px border — so the
 * boxes land in the same area the real fields will, and the grid fills the root
 * exactly (no dead space that would make the boxes look too short).
 */
export const SKELETON_ROOT_PADDING_PX =
  CARD_ENTRY_MARGIN_PX + CARD_ENTRY_BORDER_PX;

/**
 * Inline style for each skeleton box, MINUS the `background` — the fill color is
 * theme-dependent (see {@link getSkeletonColors}) so each renderer merges it in.
 * A hairline margin keeps a subtle gap between boxes while letting them fill
 * nearly the full field height (the root padding handles the outer inset). Uses
 * string units so it renders identically in React, Vue, and Angular.
 */
export const SKELETON_BOX_STYLE = {
  minWidth: '0',
  margin: '1px',
  borderRadius: '4px',
  opacity: '1',
  animation: `${SKELETON_PULSE_ANIMATION_NAME} 1.5s ease-in-out infinite`,
} as const;

export type SkeletonColors = {
  /** Faint backdrop behind the boxes. */
  backdrop: string;
  /** Box fill. */
  box: string;
};

// Dark surface → light skeleton; light surface → dark skeleton (the original
// look); unknown → a neutral mid-grey that reads on either.
const DARK_SURFACE_COLORS: SkeletonColors = {
  backdrop: 'rgba(255, 255, 255, 0.05)',
  box: 'rgba(255, 255, 255, 0.30)',
};
const LIGHT_SURFACE_COLORS: SkeletonColors = {
  backdrop: 'rgba(0, 0, 0, 0.04)',
  box: 'rgba(0, 0, 0, 0.30)',
};
const NEUTRAL_COLORS: SkeletonColors = {
  backdrop: 'rgba(128, 128, 128, 0.08)',
  box: 'rgba(128, 128, 128, 0.38)',
};

/** Parse a hex (#rgb/#rrggbb/#rrggbbaa) or rgb()/rgba() string to [r,g,b]. */
function parseRgb(color: string): [number, number, number] | null {
  const c = color.trim().toLowerCase();
  let hex = c.startsWith('#') ? c.slice(1) : '';
  if (hex && /^[0-9a-f]+$/.test(hex)) {
    if (hex.length === 3)
      hex = hex
        .split('')
        .map(x => x + x)
        .join('');
    if (hex.length === 8) hex = hex.slice(0, 6);
    if (hex.length === 6)
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
  }
  const m = c.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  return null;
}

/**
 * Best-effort skeleton palette. The skeleton renders in the SDK (parent), so it
 * can't see the form's resolved colors — it only has the optional `theme` the
 * integrator passed. When `theme.background` is a parseable color we tint the
 * skeleton light-on-dark or dark-on-light to match; otherwise we fall back to a
 * neutral mid-grey that stays visible on any surface.
 */
export function getSkeletonColors(theme?: {
  background?: string;
}): SkeletonColors {
  const rgb = theme?.background ? parseRgb(theme.background) : null;
  if (!rgb) return NEUTRAL_COLORS;
  const [r, g, b] = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5 ? DARK_SURFACE_COLORS : LIGHT_SURFACE_COLORS;
}
