import tokens from './tokens'

export const PSI_API_URL = process.env.REACT_APP_PSI_API_URL
export const PSI_API_NFT_URL = process.env.REACT_APP_PSI_API_NFT_URL
export const ApplicationName = 'Omni Marketplace'

export const IS_IN_IFRAME = window.parent !== window

export const NetworkContextName = 'NETWORK'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const PASSBASE_API_KEY = process.env.REACT_APP_PASSBASE_API_KEY

export const MARKETPLACE_TOKENS = [tokens.busd, tokens.usdc, tokens.btc, tokens.eth, tokens.bnb]
