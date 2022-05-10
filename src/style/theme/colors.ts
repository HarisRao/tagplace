import { Colors } from './types'

export const baseColors = {
  failure: '#ED4B9E',
  primary: '#f3841d',
  primaryBright: '#baa759',
  primaryDark: '#122e55',
  secondary: '#7645D9',
  success: '#31D0AA',
  warning: '#FFB237',
}

export const brandColors = {
  binance: '#F0B90B',
}

export const lightColors: Colors = {
  ...baseColors,
  ...brandColors,
  background: '#FFFFFF',
  bgGrey: '#F3F3F3',
  backgroundDisabled: '#E9EAEB',
  contrast: '#122e55',
  invertedContrast: '#baa759',
  input: '#eeeaf4',
  inputSecondary: '#d7caec',
  tertiary: '#baa759',
  text: '#000000',
  textDisabled: '#BDC2C4',
  textSubtle: '#dbbd5a',
  borderColor: '#f3841d',
  card: '#FFFFFF',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)',
  },
}

export const darkColors: Colors = {
  ...baseColors,
  ...brandColors,
  secondary: '#9A6AFF',
  background: '#100C18',
  bgGrey: '#F3F3F3',
  backgroundDisabled: '#3c3742',
  contrast: '#FFFFFF',
  invertedContrast: '#191326',
  input: '#483f5a',
  inputSecondary: '#66578D',
  primaryDark: '#0098A1',
  tertiary: '#353547',
  text: '#ffffff',
  textDisabled: '#666171',
  textSubtle: '#A28BD4',
  borderColor: '#f3841d',
  card: '#27262c',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)',
  },
}
