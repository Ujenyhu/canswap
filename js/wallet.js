//import { VarHelper } from "./varhelper.js";
const ethSepoliaChain = '0xaa36a7';

let provider;
let signer;
let userAddress;


document.getElementById('connect-wallet').addEventListener('click', async () => {
    var walletText = document.getElementById('walletText').textContent;
    document.getElementById('connect-wallet').setAttribute("disabled", "true");
    if(walletText === "Connect Metamask Wallet"){
        try {
            await connectMetaMask();
            await switchNetwork();
            //document.getElementById('connect-wallet').setAttribute("disabled", "false");
        } catch (error) {
            debugger;
            showToast(`Sorry! Could not connect to metamask. ${error.Message}`, 'error');
        }
    }else{
        showToast('Disconnect wallet from metamask and refresh page to connect to a different account.', 'error');
        // alert("Disconnect wallet from metamask and refresh page to connect to a different account.");
    }
    
});


async function connectMetaMask() { 
    debugger

    // Check if MetaMask is directly available
    if (window.ethereum && window.ethereum.isMetaMask) {
        try {
            // Request accounts from MetaMask
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            // Create a provider and signer
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();

            // Get the connected wallet address
            userAddress = account;
            GetBalance(userAddress);

            // Save the connected account to localStorage     
            localStorage.setItem('connectedAccount', userAddress);
            document.getElementById('walletText').textContent = userAddress;
            document.getElementById("start-button").textContent = "Enter Amount";
            showToast('Wallet connected successfully!');
        } catch (error) {
            if(error.code === 4001){
                showToast(`You rejected the request to connect to MetaMask`, 'error');
            }else{
                showToast(`Failed to connect to MetaMask: ${error.message}`, 'error');
            }
           
        }
    } else {
        showToast('Please install MetaMask!', 'error');
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
   
    if (chainId !== ethSepoliaChain) {
      
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
    //debugger;
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            localStorage.removeItem('connectedAccount');
            document.getElementById('walletText').textContent = "Connect Metamask Wallet";
            console.log('Wallet disconnected');
            showToast('Wallet disconnected!', 'info');
            window.location.reload();
        } else {
            localStorage.setItem('connectedAccount', accounts[0]);
            document.getElementById('walletText').textContent = accounts[0];
            showToast('Wallet connected successfully!');
            console.log(`Connected to wallet: ${accounts[0]}`);

        }
    });
}


function networkChanged(){
    // Listen for network changes
    window.ethereum.on('chainChanged', async (chainId) => {

        if (chainId !== ethSepoliaChain) {
            showToast('Please switch to the Sepolia network in MetaMask!', 'warning');
            document.getElementById("start-button").setAttribute("disabled", "true");
            document.getElementById("continue-button").setAttribute("disabled", "true");
        }else{
            document.getElementById("start-button").removeAttribute("disabled");
            document.getElementById("continue-button").removeAttribute("disabled");      
        }
    });
}

async function GetBalance(address){
    try {
        debugger;
        const balance = await provider.getBalance(address);
        // Format the balance from Wei to Ether
        const balanceInEth = ethers.utils.formatEther(balance);

        localStorage.setItem('TokenBalance', balanceInEth);
        document.getElementById('balance').value = `Bal: ${balanceInEth}`;
        console.log('Ether Balance:', balanceInEth);
        //return balanceInEth;
    } catch (error) {
        showToast(`Error fetching native balance`, 'error');
        console.error('Error fetching native balance:', error);
    }
}

// Listen for account changes
accountChanged();
networkChanged();

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