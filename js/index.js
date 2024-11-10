//document.getElementById("to-amount").setAttribute("disabled", "true");

const startButton = document.getElementById("start-button");
const continueButton = document.getElementById("continue-button");

// continueButton.setAttribute("hidden", "true");
// startButton.setAttribute("disabled", "true");


let swapAmountInput = document.getElementById('swap-amount');
const tokenToInput = document.getElementById('selected-token-to-value');



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
               
                //DISPLAY WARNING
                document.getElementById("network-warning").style.display = "";
                document.getElementById("btn-div").style.marginTop = 0;
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


// swapAmountInput.addEventListener('input', () => {

//     const swapAmount = swapAmountInput.value.trim();
//     const selectedToken = tokenToInput.value.trim();

//     // Case: Both token is selected and amount is valid
//     if (selectedToken && swapAmount > 0) {
//         startButton.setAttribute("hidden", true);
//         continueButton.removeAttribute("hidden");
//         // startButton.textContent = "Continue";
//         // startButton.removeAttribute("disabled");
//     } 
//     // Case: Token is not selected but amount is entered
//     else if (!selectedToken && swapAmount > 0) {
//         startButton.textContent = "Select Token";
//         startButton.setAttribute("disabled", "true");
//     } 

//     // Case: Token is selected but no amount is entered
//     else if (selectedToken && swapAmount === 0) {
//         startButton.textContent = "Enter Amount";
//         startButton.setAttribute("disabled", "true");
//     }

//     // Case: Neither token is selected nor amount is entered
//     else {
//         startButton.textContent = "Enter Amount";
//         startButton.setAttribute("disabled", "true");
//     }
// });


function getStorage() {
    //debugger
    // Check if there's a previously connected account
    const storedAccount = localStorage.getItem('connectedAccount');
    const currentBalance = localStorage.getItem('TokenBalance');
    if (storedAccount) {
        document.getElementById('walletText').textContent = storedAccount;
        startButton.textContent = "Enter Amount";
    }else{
        startButton.textContent = "Connect Metamask Wallet";
    }

    if(currentBalance){
        document.getElementById('balance').value = `Bal: ${currentBalance} `;
    }
}


function selectOption(iconSrc, text, value) {

    // Update the selected icon and text in the dropdown button
    document.getElementById('selected-icon').src = iconSrc;
    document.getElementById('selected-text').textContent = text;

    // Update the hidden input field with the selected value
    document.getElementById('selected-value').value = value;
    // Log the selected network value to the console
    console.log("Selected network:", value);
}


function selectToken(iconSrc, tokenText, tokenValue) {
    // Update the dropdown button to show the selected token's icon and text
    document.getElementById('selected-token-icon').src = iconSrc;
    document.getElementById('selected-token-text').textContent = tokenText;

    // Update the hidden input field with the selected token value
    document.getElementById('selected-token-value').value = tokenValue;
    
    if(tokenToInput.value && swapAmountInput.value > 0){
        //DISPLAY WARNING
        document.getElementById("network-warning").style.display = "";
        document.getElementById("btn-div").style.marginTop = 0;
    }
    console.log("Selected token:", tokenValue);
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

            //DISPLAY WARNING
            document.getElementById("network-warning").style.display = "";
            document.getElementById("btn-div").style.marginTop = 0;
        } else {
            debugger;
            startButton.textContent = "Enter Amount";
        }
    }
    console.log("Swap Amount:", swapAmountInput.value);
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
}

// Select a token and update the input field
// function selectToken(tokenName, tokenLogo) {
//     document.getElementById("networkInput").value = tokenName;
//     var modal = bootstrap.Modal.getInstance(document.getElementById("networkModal")); // Get the modal instance
//     modal.hide(); // Close the modal programmatically
// }

//document.getElementById("amount").type = "number";


function showToast(message, type = "success") {
    debugger
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

// function initMetamask(){
//     const metamask = new MetaMaskSDK.MetaMaskSDK({
//         dappMetadata: {
//           name: "OnSwap",
//           url: window.location.host,
       
//         },
//        // infuraAPIKey: process.env.INFURA_API_KEY,
//         // Other options.
//     });
    
//     // Get the provider
//     window.ethereum = metamask.getProvider();
// }

getStorage();


