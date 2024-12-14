
import { getTokenBySymbol, supportedTokens, Token } from "./helpers/token.js";
import { Quoter as QuoterABI } from "./helpers/abis.js";
import { IWETHABI } from "./helpers/abis.js";
import { IERC20 } from "./helpers/abis.js";
import { VarHelper } from "./helpers/varhelper.js";
const abiCoder = new ethers.AbiCoder();

// Initialize variables
let web3Provider; 
let signer;
let provider;
//Deployment addressess
// Replace with actual Uniswap V3 pool factor address on Sepolia/Mainnet
const poolFactoryAddress = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c';
const swapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564' // main et sepolia
const quoteContractAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
//const quoteContractAddress = '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3';

//const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType } = require ('@uniswap/sdk');

// reusable vars
let tokenToId = document.getElementById('selected-token-to-value');
let tokenFromId = document.getElementById('selected-token-value');
let swapAmountInputId = document.getElementById('swap-amount');
let estimatedValueId = document.getElementById('estimatedVal');
let continueButton = document.getElementById("continue-button");
// if(window.ethereum){
    
    //debugger;
    provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/WSw8wDh1ccTgvWCjB5-zjTbeAMdRFM1H`);
// }

// swapAmountInputId.addEventListener('estimateSwap', async () => {
//     debugger
//     var quoteSwap =  await estimateSwap();
//     if(quoteSwap > 0){
//         debugger
//         estimatedValueId.innerText = `Estimated Amount Out: ${quoteSwap} ${tokenToId.value}`;
//     }
// });


continueButton.addEventListener('click', async () => {
    try{
        
        const tokenFrom = getTokenBySymbol(tokenFromId.value);

        //Get token details you want to swap to
        const tokenTo = getTokenBySymbol(tokenToId.value);
    
        //parse amount, covert to wei
        const requestAmount = ethers.parseUnits(swapAmountInputId.value, tokenFrom.decimals);
       
        if(tokenFrom.symbol === supportedTokens.WETH){

            // Perform wrapping
            const wrapResult = await wrapEth(requestAmount);
            debugger;
            if (wrapResult.success) {
                console.log("Wrap successful:", wrapResult.wrapTx);

                // Proceed to unwrap if needed
                const unwrapStatus = await unwrapWeth();
                if (unwrapStatus.success) {
                    console.log("Unwrap successful");
                } else {
                    console.error("Unwrap failed");
                }
            } else {
                console.error("Wrap failed");
            }     
        }       
    }
    catch(error){
        console.error(error)
    }


});


async function estimateSwap() {
    
    //Get token details you want to swap from
    const tokenFrom = getTokenBySymbol(tokenFromId.value);

    //Get token details you want to swap to
    const tokenTo = getTokenBySymbol(tokenToId.value);

    //parse amount, covert to wei
    const amountIn = ethers.parseUnits(swapAmountInputId.value, tokenFrom.decimals);
    console.log("AmountIn:", amountIn);


    const quoteContract = new ethers.Contract(quoteContractAddress, QuoterABI, signer);
    console.log("Contract:", quoteContract);

    debugger;
    // const iface = new ethers.Interface(QuoterABI);
    // const encoded = iface.encodeFunctionData(iface.fragments[1], [
    //     tokenFrom.address,
    //     tokenTo.address,
    //     3000,
    //     // recipient: wallet.address,
    //     // deadline: Math.floor(new Date().getTime() / 1000 + 60 * 10),
    //     amountIn,
    //     0,
    // ]);
    // console.log("Encoded data:", encoded);


    // Encoding the data
    const encodedData = abiCoder.encode(
        ["address", "address", "uint24", "uint256", "uint160"],
        [tokenFrom.address, tokenTo.address, 3000, amountIn, 0] // quote parameters
    );

    let bytes = ethers.getBytes(encodedData)

    try{
        
        const quote = await quoteContract.quoteExactInputSingle.staticCall(encodedData
            // tokenFrom.address,
            // tokenTo.address,
            // 3000,
            // // recipient: wallet.address,
            // // deadline: Math.floor(new Date().getTime() / 1000 + 60 * 10),
            // amountIn,
            // 0,
        );
        console.log("Quote:", quote.toString());
        const quotedAmount = ethers.parseUnits(quote[0], tokenTo.decimals);
        return quotedAmount;
    }catch (error) {
        debugger;
        console.error("Error quoting swap:", error);
        throw error;
    }

}

//wrap eth
async function wrapEth(amountIn) { 

    debugger
    const WETH = getTokenBySymbol("WETH")
    web3Provider = await new ethers.BrowserProvider(window.ethereum);
    signer = await web3Provider.getSigner();
    const wethContract = new ethers.Contract(WETH.address, IWETHABI, signer);

    //wrap eth to weth
    try{
        const wrapTxReq = await wethContract.deposit({value: amountIn});     
        const wrapTx = await wrapTxReq.wait();
         debugger
        // Check transaction status
          if (wrapTx.status === 1) {
            debugger
            console.log("Wrap successful:", wrapTx);
            return { success: true, wrapTx };
        } else {
            console.error("Wrap transaction failed:", wrapTx);
            return { success: false, wrapTx };
        }
    }
    catch(error){
        debugger;
        if (error.info && error.info.error) {
            const errorCode = error.info.error.code;
            const errorMessage = error.info.error.message;
        
           showToast(`${errorMessage}`, 'error');
        }else
        {
            showToast(`Failed to complete swap transaction: ${error.message}`, 'error');
        }
        return { success: false, error };
    }

}



async function unwrapWeth(amountIn) { 

    debugger
    const WETH = getTokenBySymbol("WETH");

    web3Provider = await new ethers.BrowserProvider(window.ethereum);
    signer = await web3Provider.getSigner();
    // If amountIn is null or 0, fetch the WETH balance from the wallet
    if(amountIn === null){            
        const tokenContract = new ethers.Contract(WETH.address, IERC20, provider);          
        balance = await tokenContract.balanceOf(signer.Address());     
    }

    // If amountIn is still 0 after fetching balance, exit the function
    if(amountIn === BigInt(0)){
        return;
    }

    const wethContract = new ethers.Contract(WETH.address, IWETHABI, signer);

    //unwrap eth to weth
    try{
        const unwrapTxReq = await wethContract.withdraw(amountIn, {
            gasLimit: 100000
        });     
        const unwrapTx = await unwrapTxReq.wait();
        debugger
        // Check transaction status
          if (unwrapTx.status === 1) {
            debugger
            console.log("UnWrap successful:", unwrapTx);
            return { success: true, unwrapTx };
        } else {
            console.error("UnWrap transaction failed:", unwrapTx);
            return { success: false, unwrapTx };
        }
    }
    catch(error){
        debugger;
        if (error.info && error.info.error) {
            const errorCode = error.info.error.code;
            const errorMessage = error.info.error.message;
        
           showToast(`${errorMessage}`, 'error');
        }else
        {
            showToast(`Failed to complete swap transaction: ${error.message}`, 'error');
        }
        return { success: false, error };
    }
}


//Approve uniswap to access wallet address
async function approveSwap(tokenAddress, amount) {  
    try{
        
        web3Provider = await new ethers.BrowserProvider(window.ethereum);
        signer = await web3Provider.getSigner();
    
        const tokenContract = new ethers.Contract(tokenAddress.address, IERC20, signer);
        const approveTransactionReq = await tokenContract.approve(swapRouterAddress, amount);
        const approveReceipt = await approveTransactionReq.wait();
        // Check transaction status
        if (approveReceipt.status === 1) {
            debugger
            return { success: true, approveReceipt };
        } else {
            return { success: false, approveReceipt };
        }
    }
    catch(error){
        debugger;
        if (error.info && error.info.error) {
            const errorCode = error.info.error.code;
            const errorMessage = error.info.error.message;
        
           showToast(`${errorMessage}`, 'error');
        }else
        {
            showToast(`Failed to complete swap transaction: ${error.message}`, 'error');
        }
        return { success: false, error };
    } 
}   

