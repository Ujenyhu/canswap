
import { VarHelper } from "./helpers/varhelper.js";
import { getTokenBySymbol, Token } from "./helpers/token.js";
import { IERC20 } from "./helpers/abis.js";
//const ethSepoliaChain = '0xaa36a7';

// const metamask = new MetaMaskSDK.MetaMaskSDK({
//   dappMetadata: {
//     name: "Canswap",
//   },
//   infuraAPIKey: "WSw8wDh1ccTgvWCjB5-zjTbeAMdRFM1H",
//   // Other options.
// });
// let provider;

// Basic ERC-20 ABI with only the balanceOf function
// const tokenABI = [
//     "function balanceOf(address owner) view returns (uint256)"
//   ];

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/WSw8wDh1ccTgvWCjB5-zjTbeAMdRFM1H`);

let signer;
let userAddress;
let tokenTo = document.getElementById('selected-token-to-value');
var tokenFrom = document.getElementById('selected-token-value');
let currentBalance = localStorage.getItem('TokenBalance');
let userConnected = localStorage.getItem('connectedAccount');

document.getElementById('connect-wallet').addEventListener('click', async () => {
    var walletText = document.getElementById('walletText').textContent;
    document.getElementById('connect-wallet').setAttribute("disabled", "true");
    if(walletText === "Connect Metamask Wallet"){

        await connectMetaMask();
        await switchNetwork();
        document.getElementById('connect-wallet').setAttribute("disabled", "false");
    }else{
        showToast('Disconnect wallet from metamask and refresh page to connect to a different account.', 'error');
    }
    
});

document.getElementById('selected-token-value').addEventListener('valueChanged', async () => {
    debugger;
    if(userConnected){
        await GetBalance(userConnected);
        // if(currentBalance === null || currentBalance === "undefined"){
        //     await GetBalance(userConnected);
        // }
    }
});

// async function connectWallet() { 
//     debugger

//     // Check if MetaMask is directly available
//     if (window.ethereum.isMetaMask) {
//         try {

//             const MMSDK = new MetaMaskSDK.MetaMaskSDK({
//                 dappMetadata: {
//                   name: "Example Pure JS Dapp",
//                 },
//                 infuraAPIKey: 'WSw8wDh1ccTgvWCjB5-zjTbeAMdRFM1H',
//                 // Other options.
//               });
//               MMSDK.connect();
//             // Create a provider and signer
//            //provider = new ethers.providers.Web3Provider(window.ethereum);
//             // Request accounts
//             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//             const account = accounts[0];

//             // Get the connected wallet address
//             userAddress = account;
//             GetBalance(userAddress);

//             // Save the connected account to localStorage     
//             localStorage.setItem('connectedAccount', userAddress);
//             document.getElementById('walletText').textContent = userAddress;
//             document.getElementById("start-button").textContent = "Enter Amount";
//             showToast('Wallet connected successfully!');
//         } catch (error) {
//             debugger;
//             if(error.code === 4001){
//                 showToast(`You rejected the request to connect to MetaMask`, 'error');
//             }else{
//                 showToast(`Failed to connect to MetaMask: ${error.message}`, 'error');
//             }
//            return;
//         }
//     } else {
//         showToast('Only MetaMask is supported. Please install MetaMask and refresh the page.', 'error');
//         return;
//     }
// }



async function connectMetaMask() { 
    debugger

    // Check if MetaMask is directly available
    if (window.ethereum && window.ethereum.isMetaMask) {
        try {

            // Request accounts from MetaMask
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts', params: [] });
            const account = accounts[0];

            // // Get the connected wallet address
            userAddress = account;
            GetBalance(userAddress);

            // Save the connected account to localStorage     
            localStorage.setItem('connectedAccount', userAddress);
            document.getElementById('walletText').textContent = userAddress;
            document.getElementById("start-button").textContent = "Enter Amount";
            showToast('Wallet connected successfully!');
        } catch (error) {
            debugger;
            if(error.code === 4001){
                showToast(`You rejected the request to connect to MetaMask`, 'error');
            }else{
                showToast(`Failed to connect to MetaMask: ${error.message}`, 'error');
            }
           return;
        }
    } else {
        showToast('Only MetaMask is supported. Please install MetaMask and refresh the page.', 'error');
        return;
    }
}


// async function connectMetaMask() { 
//     debugger

//     // Initialize MetaMask SDK (if using it)
//     const metamask = new MetaMaskSDK.MetaMaskSDK({
//         dappMetadata: {
//             name: "Canswap",
//             url: window.location.host,
//         },
//         infuraAPIKey:"d7f98c3ba6a94d888d01ae2a217dcbf4",
//     });

//     // Set the MetaMask provider
//     window.ethereum =  metamask.getProvider();
    

//     // Check if MetaMask is installed
//     if (typeof window.ethereum === 'undefined') {
//         alert('Please install MetaMask!');
//         return;
//     }
                 
//     // Request accounts
//     const accounts = await provider.request({ method: 'eth_requestAccounts' });
//     const account = accounts[0];
  
//     // Save the connected account to localStorage     
//     localStorage.setItem('connectedAccount', account);
//     document.getElementById('walletText').textContent = account;
//     document.getElementById("start-button").textContent = "Enter Amount";
//     showToast('Wallet connected successfully!');
// }


async function switchNetwork() {

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
   
    if (chainId !== VarHelper.ethereum_sepolia_chain) {
      
        // Sepolia chain ID
      showToast('You are being switch to the Sepolia network in MetaMask!', 'info');
      //alert("You are being switch to the Sepolia network in MetaMask!");

      try {

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethSepoliaChain }],
        });
        showToast('Switched to Sepolia network!', 'info');

      } catch (switchError) {
        showToast('Failed to switch network! Please switch manually on metamask to sepolia', 'error');
        document.getElementById("continue-button").setAttribute("disabled", "true");
        console.error("Failed to switch network:", switchError.message);
      }
    }
}


function accountChanged() {
   
    window.ethereum.on('accountsChanged', (accounts) => {

    debugger;
        if (accounts.length === 0) {
        
            localStorage.removeItem('connectedAccount');
            localStorage.removeItem('TokenBalance');
            
            document.getElementById('walletText').textContent = "Connect Metamask Wallet";
            document.getElementById('balance').value = "";
            
            window.location.reload();
            showToast('Wallet disconnected!', 'info');
        } else {
            localStorage.setItem('connectedAccount', accounts[0]);
            GetBalance(accounts[0]);
            
            document.getElementById('walletText').textContent = accounts[0];
            showToast('Wallet connected successfully!');

        }
    });
}


function networkChanged(){
  
    // Listen for network changes
    window.ethereum.on('chainChanged', async (chainId) => {

        if (chainId !== VarHelper.ethereum_sepolia_chain) {
            showToast('Please switch to the Sepolia network in MetaMask!', 'warning');
            document.getElementById("start-button").setAttribute("disabled", "true");
            document.getElementById("continue-button").setAttribute("disabled", "true");
        }else{
            document.getElementById("start-button").removeAttribute("disabled");
            document.getElementById("continue-button").removeAttribute("disabled");      
        }
    });

}

//check token balance
// async function CheckTokenBalance(token: Token, wallet: Wallet) {
    
//     const tokenContract = new Contract(token.address, IERC20, wallet); 
//     const balance = tokenContract.balanceOf(wallet.address);
//     // if(token.symbol === "WETH"){
//     //     const wethContract = new Contract(token.address, IWETHABI, wallet); 
//     //     balance = await this.provider.getBalance(wallet.address);
//     // }else{
//     //     const tokenContract = new Contract(token.address, IERC20, this.provider); 
//     //     balance = await tokenContract.balanceOf(wallet.address);
//     // }
//     return balance
// }

 async function GetBalance(address){
    try {
        let balance;
        let formatedBal;
        debugger
        if(tokenFrom.value === "ETH"){ 
            debugger
            balance =  await provider.getBalance(address);
            // if(balance > 0){
            //     formatedBal = await ethers.formatUnits(balance, "ether");
            // }
           formatedBal = await ethers.formatUnits(balance, "ether");
        }
        else{
          
            debugger;
            //Create a contract instance for the ERC-20 token
            let token = getTokenBySymbol(tokenFrom.value.toUpperCase());
           const tokenContract = new ethers.Contract(token.address, IERC20, provider);          
            //Get the token balance for the user's address
            balance = await tokenContract.balanceOf(address);
        
            formatedBal = await ethers.formatUnits(balance, token.decimals);
        }

        localStorage.setItem('TokenBalance', formatedBal);
        document.getElementById('balance').value = `Bal: ${formatedBal}`;
        console.log('Ether Balance:', formatedBal);
        console.log('Balance:', balance);
    } catch (error) {
        localStorage.removeItem('TokenBalance');
        document.getElementById('balance').value = '';
        console.log('Error fetching native balance:', error);
    }
}


// Listen for account changes
// Check if MetaMask is being used
    accountChanged();
    networkChanged();    


//GetBalance("dhdg");

//NOTE NOTE
//Add an implementation of action when an account is disconnected. The continue button should be disabled just like the application loaded from start












// const ethereum_sepolia_chain = '0xaa36a7';
// const ethereum = metamask.getProvider();


// async function connectWallet() {
//     debugger;
//     if(!ethereum) {
//         debugger;
//         console.log('MetaMask is not installed!');
//         return;
//     }

//     try {
//         debugger;
//         // Request connection to MetaMask
//         const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

//         if (accounts.length > 0) {
//             const account = accounts[0];
//             console.log(`Connected to wallet: ${account}`);

//             // Check if connected to Sepolia
//             const chainId = await ethereum.request({ method: 'eth_chainId' });
//             if (chainId !== ethereum_sepolia_chain) {
//                 alert('Please switch to the Sepolia network in MetaMask!');
//                 await switchToSepolia();
//             }
//         }
//     } catch (error) {
//         console.error('Error connecting to MetaMask:', error);
//     }
// }

// // Function to switch to Sepolia network
// async function switchToSepolia() {
//     if (!ethereum) {
//         console.error('MetaMask provider not available!');
//         return;
//     }

//     try {
//         await ethereum.request({
//             method: 'wallet_switchEthereumChain',
//             params: [{ chainId: ethereum_sepolia_chain }],
//         });
//         console.log('Switched to Sepolia network!');
//     } catch (switchError) {
//         console.error('Failed to switch network:', switchError);
//     }
// }