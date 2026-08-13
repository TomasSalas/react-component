// Shared size scale reused by every form control (Button, Input, Select,
// AutoComplete). Keeps height/fontSize/iconSize in sync across components
// instead of each one redefining the same small/medium/large values.

export const CONTROL_HEIGHTS = {
  small: 'rui:h-[32px]',
  medium: 'rui:h-[36px]',
  large: 'rui:h-[40px]'
}

export const CONTROL_FONT_SIZES = {
  small: 'rui:text-xs',
  medium: 'rui:text-sm',
  large: 'rui:text-base'
}

export const CONTROL_ICON_SIZES = {
  small: 14,
  medium: 16,
  large: 20
}
