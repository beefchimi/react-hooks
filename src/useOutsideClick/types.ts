export type OutsideClickCallback = (event: PointerEvent) => void;
export type OutsideClickExclusion = (HTMLElement | null | undefined)[];

export interface OutsideClickHookOptions {
  disabled?: boolean;
  exclude?: OutsideClickExclusion;
}
