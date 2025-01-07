
    import { VarHelper } from "./helpers/varhelper.js";
    import { getTokenBySymbol, Token } from "./helpers/token.js";
    import { IERC20 } from "./helpers/abis.js";
    //const ethSepoliaChain = '0xaa36a7';


    //Initialize MetaMask SDK (if using it)
    const metamaskSdk = new MetaMaskSDK.MetaMaskSDK({
        dappMetadata: {
            name: "Canswap",
            url: window.location.href,
        },
        infuraAPIKey:"WSw8wDh1ccTgvWCjB5-zjTbeAMdRFM1H",
        checkInstallationImmediately: true,
        shouldShimWeb3: false,
    });

    let metamaskProvider;
    let provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/WSw8wDh1ccTgvWCjB5-zjTbeAMdRFM1H`);
    let userAddress;
    let tokenTo = document.getElementById('selected-token-to-value');
    var tokenFrom = document.getElementById('selected-token-value');
    let currentBalance = localStorage.getItem('TokenBalance');
    let userConnected = localStorage.getItem('connectedAccount');

    //Start wallet connection
    document.getElementById('connect-wallet').addEventListener('click', async () => {
        try{
            var walletText = document.getElementById('walletText').textContent;
            document.getElementById('connect-wallet').setAttribute("disabled", "true");

            if(walletText === "Connect Metamask Wallet")
            {       
                const connect = await connectMetaMask();
                if(connect.success){
                    await switchNetwork();
                    document.getElementById('connect-wallet').removeAttribute("disabled");
                }
                else{
                    showToast('Wallet connection unsuccessful. Please try again.', 'error');
                }
            }
            else{
                showToast('Disconnect wallet from metamask and refresh page to connect to a different account.', 'error');
            }
            return           
        }catch(error){
            //throw
            document.getElementById('connect-wallet').removeAttribute("disabled");
            return
        }
    });

   
    //Get current balance if token changes in dropdown value
    document.getElementById('selected-token-value').addEventListener('valueChanged', async () => {
        debugger;
        if(userConnected){
            await GetBalance(userConnected);
        }
        return;
    });


    //Connect to metamask
    async function connectMetaMask() { 
        debugger
        // Check if MetaMask is directly available
        if (window.ethereum.isMetaMask) {
            try 
            {
                await metamaskSdk.connect();  
                metamaskProvider = await metamaskSdk.getProvider(); 
                const accounts = await metamaskProvider.request({method: "eth_accounts"});         
                // Get the connected wallet address         
                if(accounts[0])
                {
                    userAddress = accounts[0];                  
                    await GetBalance(userAddress);
                    
                    // Save the connected account to localStorage     
                    localStorage.setItem('connectedAccount', userAddress);
                    document.getElementById('walletText').textContent = userAddress;
                    document.getElementById("start-button").textContent = "Enter Amount";

                    //register event listerners- Listen for account and network changes
                    accountChanged();
                    networkChanged();

                    showToast('Wallet connected successfully!');
                    return { success: true};;
                }               
            } 
            catch (error) {
                debugger;
                if(error.code === 4001){
                    showToast(`You rejected the request to connect to MetaMask`, 'error');
                }else{
                    showToast(`Failed to connect to MetaMask: ${error.message}`, 'error');
                }
                return { success: false};
            }
        } 
        else {
            showToast('Only MetaMask is supported. Please install MetaMask and refresh the page.', 'error');
            return { success: false};
        }
        return { success: false};
    }


    //Switch to wallet network to sepolia
    async function switchNetwork() {
        debugger;
        
        const chainId = await metamaskProvider.request({ method: 'eth_chainId'});
        if (chainId !== VarHelper.ethereum_sepolia_chain) {      
            // Sepolia chain ID
            showToast('You are being switched to the Sepolia network in MetaMask!', 'info');
            try {

                await metamaskProvider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: VarHelper.ethereum_sepolia_chain }],
                });
                showToast('Switched to Sepolia network!', 'info');

            } catch (switchError) {
                showToast('You rejected the automatic request to switch to sepolia network! Please switch manually on metamask.', 'error');
                document.getElementById("continue-button").setAttribute("disabled", "true");
                console.error("Failed to switch network:", switchError.message);
            }
        }
        return;
    }


   //Listen for account change or removal
    async function accountChanged() {
        debugger;

        metamaskProvider.on("accountsChanged", (accounts) => {

            if (accounts.length === 0) {
            
                localStorage.removeItem('connectedAccount');
                localStorage.removeItem('TokenBalance');
                
                document.getElementById('walletText').textContent = "Connect Metamask Wallet";
                showToast('Wallet disconnected!', 'info');
                document.getElementById('balance').value = "";                
                
            } else {
                localStorage.setItem('connectedAccount', accounts[0]);
                GetBalance(accounts[0]);
                
                document.getElementById('walletText').textContent = accounts[0];
                showToast('Wallet connected successfully!');
    
            }
            window.location.reload();
        });
        return;
    }

  // Listen for network changes
    function networkChanged(){ 
        debugger;
        if(metamaskProvider.isConnected())
        {
            metamaskProvider.on("chainChanged", async (chainId) => {
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
        return;
    }


    async function GetBalance(address) {
        debugger
        try  {
            let balance;
            let formatedBal;
            if (address) {
                if (tokenFrom.value === "ETH") {
                    balance = await provider.getBalance(address);
                    if (balance > 0) {
                      formatedBal = await ethers.formatUnits(balance, "ether");
                    }
                } else 
                {
                   
                    //Create a contract instance for the ERC-20 token
                    let token = getTokenBySymbol(tokenFrom.value.toUpperCase());
                    const tokenContract = new ethers.Contract(
                    token.address,
                    IERC20,
                    provider
                    );
                    //Get the token balance for the user's address
                    balance = await tokenContract.balanceOf(address);

                    formatedBal = await ethers.formatUnits(balance, token.decimals);
                }

                localStorage.setItem("TokenBalance", formatedBal);
                document.getElementById("balance").innerText = `Bal: ${formatedBal}`;
            }
            return;
        } catch (error) {
            debugger;
            if (error.code === "NETWORK_ERROR") {
                showToast("Network error. Please check your internet connection.", "error");
            }
            localStorage.removeItem("TokenBalance");
            document.getElementById("balance").value = "";
            console.log("Error fetching native balance:", error);
           
            return;
        }
    }


 
   
