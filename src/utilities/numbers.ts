export interface LeftPadNumberOptions {
  padding?: number;
  prefix?: string;
}

export function leftPadNumber(
  value: number,
  options: LeftPadNumberOptions = {},
) {
  const {padding = 2, prefix = '0'} = options;
  return value.toString().padStart(padding, prefix);
}
