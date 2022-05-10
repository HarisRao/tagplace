import { scales, variants } from './types'

export const scaleVariants = {
  [scales.MD]: {
    height: '48px',
    padding: '0 24px',
  },
  [scales.SM]: {
    height: '32px',
    padding: '0 16px',
  },
  [scales.XS]: {
    height: '20px',
    fontSize: '12px',
    padding: '0 8px',
  },
}

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: '#F3841D',
    color: 'white',
  },
  [variants.SECONDARY]: {
    backgroundColor: 'transparent',
    border: '2px solid',
    borderColor: '#F3841D',
    boxShadow: 'none',
    color: '#F3841D',
    ':disabled': {
      backgroundColor: 'transparent',
    },
  },
  [variants.TEXT]: {
    backgroundColor: 'transparent',
    color: 'black',
    boxShadow: 'none',
    border: '2px solid',
    borderColor: '#00000033',
  },



  
  [variants.TERTIARY]: {
    backgroundColor: 'tertiary',
    boxShadow: 'none',
    color: 'white',
  },
  [variants.SUBTLE]: {
    backgroundColor: 'textSubtle',
    color: 'white',
  },
  [variants.DANGER]: {
    backgroundColor: 'failure',
    color: 'white',
  },
  [variants.SUCCESS]: {
    backgroundColor: 'success',
    color: 'white',
  },
  
}
