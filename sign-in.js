const apiEndpoint = "https://api.valency.exchange";     // API Endpoint


// Function 1: Sign in with Email + Password
async function signInWithEmailPassword(email, password) {
    // Padding email and password if required
    email = email.padEnd(32, ' ');
    password = password.padEnd(32, ' ');

    // Constructing the request string
    let requestString = `${email}${password}`;

    return await sendRequest(requestString);
}


// Function 2: Sign in with Client Index + Email + Password
async function signInWithClientIndexEmailPassword(clientIndex, email, password) {
    // Padding email and password if required
    email = email.padEnd(32, ' ');
    password = password.padEnd(32, ' ');

    // Constructing the request string
    let requestString = `${clientIndex}${email}${password}`;

    return await sendRequest(requestString);
}


// Function 3: Sign in with Email + Password + 2FA Code
async function signInWithEmailPassword2FA(email, password, twoFactorCode) {
    // Padding email and password if required
    email = email.padEnd(32, ' ');
    password = password.padEnd(32, ' ');

    // Constructing the request string
    let requestString = `${email}${password}${twoFactorCode}`;

    return await sendRequest(requestString);
}


// Function 4: Sign in with Client Index + Email + Password + 2FA Code
async function signInWithClientIndexEmailPassword2FA(clientIndex, email, password, twoFactorCode) {
    // Padding email and password if required
    email = email.padEnd(32, ' ');
    password = password.padEnd(32, ' ');

    // Constructing the request string
    let requestString = `${clientIndex}${email}${password}${twoFactorCode}`;

    return await sendRequest(requestString);
}


// Networking
async function sendRequest(requestString) {
    try {
        // Making the API call
        let response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ request: requestString })
        });

        // Parsing the response
        let result = await response.json();
        return handleSignInResponse(result);
    } catch (error) {
        return 'Network Error';
        throw error;
    }
}


// Response Handling
function handleSignInResponse(response) {
    switch (response) {
        case '0':
            return 'Invalid Index/Email/Password. Please re-input login details.';
        case '1':
            return 'Invalid 2FA Code. Please re-input the 2FA code.';
        case '2':
            return 'Expired 2FA Code. A new code has been sent. Please re-input the 2FA code.';
        case '3':
            return 'Expired 2FA Code. Error sending new code. Please try again.';
        case '4':
            return 'User already performing API function. Please try again.';
        case '5':
            return 'User Account Temporarily Locked due to too many incorrect login attempts. Please wait 10 minutes.';
        case '6':
            return 'User Account Locked. Please check your email.';
        case '7':
            return '2FA Code Required. A new code has been sent. Please input the 2FA code.';
        case '8':
            return '2FA Code Required. User Account Temporarily locked due to too many incorrect login attempts. Please wait 10 minutes.';
        case '9':
            return 'Session Key Generation Error. Please try again.';
        case '10':
            return parseSessionKey(response);
        default:
            return 'Unexpected response. Please try again.';
    }
}

function parseSessionKey(response) {
    const sessionKey = response.substring(2, 34);
    const clientIndex = response.substring(34, 38);
    
    // Number of assets owned - 8 byte per asset amount, 2 byte per asset index (asset index, then asset amount, repeating)
    // First 2 bytes are number of assets indexes that are owned by the customer
    const numOfAssetIndex = response.subString(38, 40);
    const assetsOwned = [];                                 // Contains the asset names and respspective amounts
    for(i = 0; i < numOfAssetIndex; i = i + 2) {
        assetsOwned[i] = response.substring((i * 10) + 40, (i * 10) + 42);
        assetsOwned[i + 1] = response.substring((i * 10) + 42, (i * 10) + 50);
    }
    
    return { sessionKey, clientIndex, assetsOwned };
}
