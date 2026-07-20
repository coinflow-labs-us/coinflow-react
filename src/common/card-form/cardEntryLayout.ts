/**
 * Single source of truth for the card-entry responsive layout.
 *
 * The real card-entry form (`UnifiedCardEntry` in the core-flows app) and the
 * React/Vue/Angular skeleton loaders all render the same grid. Historically the
 * form drove the inline↔two-row switch from JS (a ResizeObserver toggling React
 * state) while the skeletons hard-coded their own guesses, so the two drifted.
 *
 * This module defines the grid templates and the breakpoint ONCE, as pure data
 * plus a CSS builder, so every consumer reflows at exactly the same width via a
 * CSS container query — no JS width measurement, nothing to keep in sync.
 */

export type CardEntryInputName = 'card-number' | 'expiration' | 'cvv';

/**
 * Minimum width (px) each field needs before the row is too cramped and the
 * layout drops to two rows. Mirrors the real form's field sizing.
 */
export const CARD_ENTRY_MIN_WIDTHS: Record<CardEntryInputName, number> = {
  'card-number': 180,
  expiration: 96,
  cvv: 80,
};

/** Notional gap (px) between fields, summed into the reflow breakpoint. */
export const CARD_ENTRY_SLOT_GAP_PX = 8;

/** Field row height — matches the real form's `3rem` grid rows. */
export const CARD_ENTRY_ROW_HEIGHT = '3rem';
export const CARD_ENTRY_ROW_HEIGHT_PX = 48;
/** 1px accent line between rows / between exp & cvv in the two-row layout. */
export const CARD_ENTRY_DIVIDER_PX = 1;
/**
 * The form draws its fields inside a 1px border, so the query container (the
 * full iframe width) is 2px wider than the field row that `minRowWidth`
 * describes. The breakpoint bakes this in so form and skeleton flip together.
 */
export const CARD_ENTRY_BORDER_PX = 1;
/**
 * The form insets its box by this much on every side (Tailwind `m-0.5`) so the
 * focus ring has room and isn't clipped at the iframe edge. It adds to the box's
 * rendered height, so the skeleton's height guess includes it to avoid a jump
 * when the loaded form replaces the skeleton.
 */
export const CARD_ENTRY_MARGIN_PX = 2;

/** Inline (wide-layout) track width for each field. */
const INLINE_SLOT_WIDTH: Record<CardEntryInputName, string> = {
  'card-number': '1fr',
  expiration: '96px',
  cvv: '80px',
};

/** grid-area name a field occupies. */
const FIELD_AREA: Record<CardEntryInputName, string> = {
  'card-number': 'card',
  expiration: 'exp',
  cvv: 'cvv',
};

export type CardEntryConfig = {
  /** Mounted fields, in DOM/visual order. */
  inputs: CardEntryInputName[];
  /** Whether the animated card-brand icon renders left of the PAN slot. */
  hasIcon?: boolean;
  /** Whether the layout may drop to two rows when narrow (default true). */
  allowTwoRow?: boolean;
};

export type CardEntryDivider = {area: string; orientation: 'v' | 'h'};

export type CardEntryLayout = {
  /** grid-template for the wide (inline) layout. */
  inline: string;
  /** grid-template for the narrow (two-row) layout, or null if it never reflows. */
  twoRow: string | null;
  /**
   * Container width (px) below which the two-row layout applies, measured on the
   * query container (full iframe width, incl. the form's border). Null when the
   * config never reflows.
   */
  breakpointPx: number | null;
  /** grid-area names that hold a field, in DOM order (same in both layouts). */
  fieldAreas: string[];
  /** Whether an `icon` area is present (both layouts). */
  hasIconArea: boolean;
  /** Accent-line elements shown only in the two-row layout. */
  twoRowDividers: CardEntryDivider[];
};

function has(inputs: CardEntryInputName[], name: CardEntryInputName): boolean {
  return inputs.includes(name);
}

/** The reflow breakpoint on the field row, before adding the form border. */
function minRowWidthPx(inputs: CardEntryInputName[]): number {
  const fields = inputs.reduce(
    (sum, name) => sum + CARD_ENTRY_MIN_WIDTHS[name],
    0
  );
  const gaps = Math.max(0, inputs.length - 1) * CARD_ENTRY_SLOT_GAP_PX;
  return fields + gaps;
}

/** grid-template for the single-row inline layout. */
function inlineTemplate({
  inputs,
  hasIcon,
}: {
  inputs: CardEntryInputName[];
  hasIcon: boolean;
}): string {
  const areas: string[] = [];
  const cols: string[] = [];
  const pushSlot = (area: string, width: string) => {
    if (areas.length > 0) {
      areas.push(`d${area.toUpperCase()}`);
      cols.push('1px');
    }
    areas.push(area);
    cols.push(width);
  };
  if (hasIcon && has(inputs, 'card-number')) pushSlot('icon', 'auto');
  for (const name of inputs)
    pushSlot(FIELD_AREA[name], INLINE_SLOT_WIDTH[name]);
  return `"${areas.join(' ')}" ${CARD_ENTRY_ROW_HEIGHT} / ${cols.join(' ')}`;
}

/** grid-template + dividers for the two-row layout (PAN on top). */
function twoRowTemplate({
  inputs,
  hasIcon,
}: {
  inputs: CardEntryInputName[];
  hasIcon: boolean;
}): {template: string; dividers: CardEntryDivider[]} | null {
  const showsCard = has(inputs, 'card-number');
  const showsExp = has(inputs, 'expiration');
  const showsCvv = has(inputs, 'cvv');
  if (!showsCard || (!showsExp && !showsCvv)) return null;

  const rows = `${CARD_ENTRY_ROW_HEIGHT} ${CARD_ENTRY_DIVIDER_PX}px ${CARD_ENTRY_ROW_HEIGHT}`;

  if (showsExp && showsCvv) {
    const areas = hasIcon
      ? '"icon card card card" "dHR dHR dHR dHR" "exp exp dEV cvv"'
      : '"card card card" "dHR dHR dHR" "exp dEV cvv"';
    const cols = hasIcon
      ? 'auto minmax(0, 1fr) 1px minmax(0, 1fr)'
      : 'minmax(0, 1fr) 1px minmax(0, 1fr)';
    return {
      template: gridShorthand(areas, rows, cols),
      dividers: [
        {area: 'dHR', orientation: 'h'},
        {area: 'dEV', orientation: 'v'},
      ],
    };
  }

  const onlyBottom = showsExp ? 'exp' : 'cvv';
  const areas = hasIcon
    ? `"icon card" "dHR dHR" "${onlyBottom} ${onlyBottom}"`
    : `"card" "dHR" "${onlyBottom}"`;
  const cols = hasIcon ? 'auto minmax(0, 1fr)' : 'minmax(0, 1fr)';
  return {
    template: gridShorthand(areas, rows, cols),
    dividers: [{area: 'dHR', orientation: 'h'}],
  };
}

/**
 * Compose a `grid-template` shorthand from a multi-row areas string, a matching
 * row-size list, and the column list — e.g. `"a" "b" 3rem 1px / 1fr`.
 */
function gridShorthand(areas: string, rows: string, cols: string): string {
  const areaRows = areas.match(/"[^"]*"/g) ?? [];
  const rowSizes = rows.split(/\s+/);
  const withRowSizes = areaRows
    .map((row, i) => `${row} ${rowSizes[i] ?? ''}`.trim())
    .join(' ');
  return `${withRowSizes} / ${cols}`;
}

/** Resolve the full layout (templates + breakpoint + areas) for a config. */
export function buildCardEntryLayout({
  inputs,
  hasIcon = false,
  allowTwoRow = true,
}: CardEntryConfig): CardEntryLayout {
  const fieldAreas = inputs.map(name => FIELD_AREA[name]);

  // A lone field fills the width and never reflows (matches the real form's
  // single-input case — the fixed slot width and the icon are ignored).
  if (inputs.length === 1) {
    return {
      inline: `"${fieldAreas[0]}" ${CARD_ENTRY_ROW_HEIGHT} / 1fr`,
      twoRow: null,
      breakpointPx: null,
      fieldAreas,
      hasIconArea: false,
      twoRowDividers: [],
    };
  }

  const hasIconArea = hasIcon && has(inputs, 'card-number');
  const inline = inlineTemplate({inputs, hasIcon: hasIconArea});
  const twoRow = allowTwoRow
    ? twoRowTemplate({inputs, hasIcon: hasIconArea})
    : null;

  return {
    inline,
    twoRow: twoRow?.template ?? null,
    breakpointPx: twoRow
      ? minRowWidthPx(inputs) + 2 * CARD_ENTRY_BORDER_PX
      : null,
    fieldAreas,
    hasIconArea,
    twoRowDividers: twoRow?.dividers ?? [],
  };
}

/**
 * Container-query CSS that switches `gridSelector` between the inline and
 * two-row templates at the layout's breakpoint. The element matched by
 * `gridSelector` must be a descendant of a `container-type: inline-size`
 * ancestor named `containerName`.
 *
 * `extraBaseRules` are emitted before the `@container` block (e.g. the default
 * hidden state of two-row-only dividers); `extraCompactRules` are emitted inside
 * it (e.g. revealing those dividers / hiding wide-only chrome). Keeping the base
 * state first ensures the compact rules win when the query matches.
 */
export function buildCardEntryGridCss({
  gridSelector,
  layout,
  containerName,
  extraBaseRules = '',
  extraCompactRules = '',
}: {
  gridSelector: string;
  layout: CardEntryLayout;
  containerName?: string;
  extraBaseRules?: string;
  extraCompactRules?: string;
}): string {
  const base = `${gridSelector} { display: grid; grid-template: ${layout.inline}; }
${extraBaseRules}`;
  if (!layout.twoRow || layout.breakpointPx === null) return base;
  const container = containerName ? `${containerName} ` : '';
  return `${base}
@container ${container}(width < ${layout.breakpointPx}px) {
  ${gridSelector} { grid-template: ${layout.twoRow}; }
  ${extraCompactRules}
}`;
}
