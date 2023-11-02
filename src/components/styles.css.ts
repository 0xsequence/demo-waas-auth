import { textVariants, vars } from '@0xsequence/design-system'
import { style } from '@vanilla-extract/css'

export const digitInput = style([
  textVariants({ variant: 'large' }),
  {
    height: '48px',
    width: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    border: `${vars.borderWidths.thick} solid ${vars.colors.borderNormal}`,
    borderRadius: vars.radii.sm,
    color: vars.colors.text100,
    background: 'transparent',
    textAlign: 'center',
    caretColor: 'transparent',

    boxShadow: 'none',

    ':hover': {
      borderColor: vars.colors.borderFocus
    },

    ':focus': {
      borderColor: vars.colors.borderFocus
    },

    '::selection': {
      background: 'transparent'
    }
  }
])
