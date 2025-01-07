const startButton = document.getElementById("start-button");
const continueButton = document.getElementById("continue-button");
const changeEvent = new Event('valueChanged');
const quoteEvent = new Event('estimateSwap');
const balanceEvent = new Event('getBalance');

let swapAmountInput = document.getElementById('swap-amount');
let tokenToInput = document.getElementById('selected-token-to-value');
let balanceId = document.getElementById('balance');


document.addEventListener('DOMContentLoaded', () => {
    getStorage();
   
    swapAmountInput.addEventListener('input', () => {

        const swapAmount = swapAmountInput.value.trim();
        const selectedToken = tokenToInput.value.trim();

        if (document.getElementById('walletText').textContent !== "Connect Metamask Wallet") {
            
            // Case: Both token is selected and amount is valid
            if (selectedToken && swapAmount > 0) {
                debugger;
                startButton.setAttribute("hidden", true);
                continueButton.removeAttribute("hidden");
               
                if(balanceId.innerText !== "Bal: 0.0"){
                
                    //DISPLAY WARNING
                    document.getElementById("network-warning-p").innerHTML = `<span class="fa fa-warning fa-1x"></span> Please make sure you are on the Sepolia testnet network before proceeding`;
                    document.getElementById("network-warning").style.display = "";
                    document.getElementById("btn-div").style.marginTop = 0;
                }else{
                    
                    let selectedTokenFrom = document.getElementById('selected-token-value');
                    
                    //DISPLAY Balance WARNING
                    document.getElementById("network-warning-p").innerHTML = `<span class="fa fa-warning fa-1x"></span> You need a sufficient balance of ${selectedTokenFrom.value} to continue`;
                    document.getElementById("btn-div").style.marginTop = 0;
                    continueButton.setAttribute("disabled", "true");             
                }

                //send event to get estimate for swap
                swapAmountInput.dispatchEvent(quoteEvent);

            }
            // Case: Token is not selected but amount is entered
            else if (!selectedToken && swapAmount > 0) {
                debugger;
                startButton.textContent = "Select Token";
                startButton.setAttribute("disabled", "true");
            }

            // Case: Token is selected but no amount is entered
            else if (
                (selectedToken && swapAmount === 0) ||
                (selectedToken && swapAmount === "")
            ) {
                debugger;
                startButton.textContent = "Enter Amount";
                startButton.setAttribute("disabled", "true");
            }
            // Case: Neither token is selected nor amount is entered
            // else {
            //     debugger;
            //     startButton.textContent = "Select Token";
            //     startButton.setAttribute("disabled", "true");
            // }
        }
    });
});



swapAmountInput.addEventListener('input', () => {

    const swapAmount = swapAmountInput.value.trim();
    const selectedToken = tokenToInput.value.trim();

    // Case: Both token is selected and amount is valid
    if (selectedToken && swapAmount > 0) {
        startButton.setAttribute("hidden", true);
        continueButton.removeAttribute("hidden");
        // startButton.textContent = "Continue";
        // startButton.removeAttribute("disabled");
    } 
    // Case: Token is not selected but amount is entered
    else if (!selectedToken && swapAmount > 0) {
        startButton.textContent = "Select Token";
        startButton.setAttribute("disabled", "true");
    } 

    // Case: Token is selected but no amount is entered
    else if (selectedToken && swapAmount === 0) {
        startButton.textContent = "Enter Amount";
        startButton.setAttribute("disabled", "true");
    }

    // Case: Neither token is selected nor amount is entered
    else {
        startButton.textContent = "Enter Amount";
        startButton.setAttribute("disabled", "true");
    }
});


function getStorage() {
    // Check if there's a previously connected account
    let storedAccount = localStorage.getItem('connectedAccount');
    let currentBalance = localStorage.getItem('TokenBalance');
    if (storedAccount) {
        document.getElementById('walletText').textContent = storedAccount;
        startButton.textContent = "Enter Amount";
    }else{
        startButton.textContent = "Connect Metamask Wallet";
    }
}

function clearStorage() {
    debugger;
    // Check if there's a previously connected account
    let storedAccount = localStorage.getItem('connectedAccount');
    localStorage.removeItem(storedAccount);
    startButton.textContent = "Connect Metamask Wallet";
    return;
}


function selectOption(iconSrc, text, value) {

    // Update the selected icon and text in the dropdown button
    document.getElementById('selected-icon').src = iconSrc;
    document.getElementById('selected-text').textContent = text;

    // Update the hidden input field with the selected value
    document.getElementById('selected-value').value = value;
    // Log the selected network value to the console
    console.log("Selected network:", value);
    return;
}


function selectToken(iconSrc, tokenText, tokenValue) {
    debugger;
    // Update the dropdown button to show the selected token's icon and text
    document.getElementById('selected-token-icon').src = iconSrc;
    document.getElementById('selected-token-text').textContent = tokenText;

    // Update the hidden input field with the selected token value
    let selectedTokenFrom = document.getElementById('selected-token-value');
    selectedTokenFrom.value = tokenValue;


    if(tokenToInput.value && swapAmountInput.value > 0){
        debugger;

        if(balanceId.innerText !== "Bal: 0.0"){
           //DISPLAY WARNING
           document.getElementById("network-warning-p").innerHTML = `<span class="fa fa-warning fa-1x"></span> Please make sure you on the sepolia testnet network before proceeding`;
            document.getElementById("network-warning").style.display = "";
            document.getElementById("btn-div").style.marginTop = 0;
        }
        else{
              
            //DISPLAY WARNING
            document.getElementById("network-warning-p").innerHTML = `<span class="fa fa-warning fa-1x"></span> You need a sufficient balance of ${selectedTokenFrom.value} to continue`;
            document.getElementById("btn-div").style.marginTop = 0;
            continueButton.setAttribute("disabled", "true");
        }
    }
    // Dispatch a custom event to notify that the token To value has changed
    selectedTokenFrom.dispatchEvent(changeEvent);
    return;
}


function selectToToken(iconSrc, tokenText, tokenValue) {
    // Update the dropdown button to show the selected token's icon and text
    document.getElementById('selected-token-to-icon').src = iconSrc;
    document.getElementById('selected-token-to-text').textContent = tokenText;

    // Update the hidden input field with the selected token value
    document.getElementById('selected-token-to-value').value = tokenValue;
    document.getElementById('selected-token-to-icon').removeAttribute("hidden");
    console.log("Selected token:", tokenValue);

    
    if (document.getElementById('walletText').textContent !== "Connect Metamask Wallet") {
        
        if (swapAmountInput.value !== "") {
            //debugger;
            //startButton.textContent = "Continue";
            startButton.setAttribute("hidden", true);
            continueButton.removeAttribute("hidden");

            debugger;
            if(balanceId.innerText !== "Bal: 0.0"){
                
                //DISPLAY WARNING
                document.getElementById("network-warning-p").innerHTML = `<span class="fa fa-warning fa-1x"></span> Please make sure you on the sepolia testnet network before proceeding`;
                document.getElementById("network-warning").style.display = "";
                document.getElementById("btn-div").style.marginTop = 0;
            }else{
                
                let selectedTokenFrom = document.getElementById('selected-token-value');
                
                //DISPLAY WARNING
                document.getElementById("network-warning-p").innerHTML = `<span class="fa fa-warning fa-1x"></span> You need a sufficient balance of ${selectedTokenFrom.value} to continue`;
                document.getElementById("btn-div").style.marginTop = 0;
                continueButton.setAttribute("disabled", "true");

            }
        } else {
            startButton.textContent = "Enter Amount";
        }
    }
    console.log("Swap Amount:", swapAmountInput.value);
    return;
}


// Filter tokens based on search input
function filterTokens() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const tokenItems = document.querySelectorAll(".token-item");

    tokenItems.forEach(item => {
        const tokenText = item.textContent.toLowerCase();
        if (tokenText.includes(searchValue)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
    return;
}


function showToast(message, type = "success") {
    // Define background colors for each type
    const backgroundColors = {
        info: '#0dcaf0',
        warning: '#ffc107',
        success: '#198754',
        error: '#dc3545'
    };
    Toastify({
        text: message,
        duration: 4000,
        className: type, 
        close: true,
        gravity: "top", 
        position: 'center',
        style: {
            background: backgroundColors[type],
        },
       // backgroundColor: type === 'success' ? 'green' : 'red',
        stopOnFocus: false // Prevents dismissing of toast on hover
    }).showToast();
}

getStorage();
//clearStorage()

