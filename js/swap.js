
import { getTokenBySymbol, Token } from "./helpers/token.js";
import { Quoter as QuoterABI } from "./helpers/abis.js";


// Initialize variables
let web3Provider; 
let signer;
let provider;
//Deployment addressess
// Replace with actual Uniswap V3 pool factor address on Sepolia/Mainnet
const poolFactoryAddress = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c';
const swapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564' // main et sepolia
const quoteContractAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';


//const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType } = require ('@uniswap/sdk');

// reusable vars
let tokenToId = document.getElementById('selected-token-to-value');
let tokenFromId = document.getElementById('selected-token-value');
let swapAmountInputId = document.getElementById('swap-amount');
let estimatedValueId = document.getElementById('estimatedVal');

if(window.ethereum){
    
    debugger;
    web3Provider = await new ethers.BrowserProvider(window.ethereum);
    signer = await web3Provider.getSigner();
    provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/WSw8wDh1ccTgvWCjB5-zjTbeAMdRFM1H`);
}

swapAmountInputId.addEventListener('estimateSwap', async () => {
    debugger
    var quoteSwap =  await estimateSwap();
    if(quoteSwap > 0){
        estimatedValueId.innerText = `Estimated Amount Out: ${quoteSwap} ${tokenToId.value}`;
    }
});


async function estimateSwap() {
    debugger;
    //Get token details you want to swap from
    const tokenFrom = getTokenBySymbol(tokenFromId.value);

    //Get token details you want to swap to
    const tokenTo = getTokenBySymbol(tokenToId.value);

    //parse amount, covert to wei
    const amountIn =  ethers.parseUnits(swapAmountInputId.value.toString(), tokenFrom.decimals);

    const quoteContract = new ethers.Contract(quoteContractAddress, QuoterABI, provider);

    const quote = await quoteContract.quoteExactInputSingle.staticCall(
        tokenFrom.address,
        tokenTo.address,
        3000,
        // recipient: wallet.address,
        // deadline: Math.floor(new Date().getTime() / 1000 + 60 * 10),
        amountIn,
        0,
    );

    const quotedAmount = ethers.formatUnits(quote[0], tokenTo.decimals);
    return quotedAmount;
}
