//const { ChainId, Token } = require ('@uniswap/sdk');

export class Token {
    constructor(chainId, address, decimals, symbol, name) {
      this.chainId = chainId;
      this.address = address;
      this.decimals = decimals;
      this.symbol = symbol;
      this.name = name;
    }
}

export const supportedTokens ={
    WETH : "WETH", 
    ETH : "ETH",
    USDT : "USDT",
    USDC : "USDC",
}



//Define Tokens Eth
const tokenMap = {

    WETH: new Token(
        '0xaa36a7', // chain Id
        '0xfff9976782d46cc05630d1f6ebab18b2324d6b14', //sepolia 
       // '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH contract address on main
        18, // WETH has 18 decimals
        'WETH',
        'Wrapped Ether'
    ),
    
    USDT:  new Token(
        '0xaa36a7', // chain Id
        '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0', //USDT contract address in sepolia
        //'0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT contract address main
        6, // USDT has 6 decimals
        'USDT',
        'Tether USD',
    ),

    USDC: new Token(
        '0xaa36a7', // chain Id
        //'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Main
        '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',// sepolia
        6,
        'USDC',
        'USD//C',
    ),

    T_USDT: new Token(
        '0xaa36a7', // chain Id
        '0x738C68fef0dCf4ADEFF075c8C81deCa621674a9d', // sepolia
        6,
        'T_USDT',
        'Test USDT',
    )  
    //Add more tokens
}



export function getTokenBySymbol(symbol) {

    if( symbol === 'ETH'){
        symbol = 'WETH';
    }       
   const token = tokenMap[symbol.toUpperCase()];
   if(!token) {
    throw new Error(`Token with symbol ${symbol} not found`);
   }
    return token;
}



