const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

function environment() {
    let clientId = "AVgtk5t9Fi3J9LUMMvdRuPR50nM1srSLz7lPtJjN77Was-cF3G5SvWr880ZsAmBuC2uTGH1SvBPYgTR5";
    let clientSecret = "EKguSqVDaUQlEWp09WW2l8rCrfENZmi_71yzzOk6X_m7Mon4jS7xICEmYYf0r-c-5KW7GvstItSRsOW_";

    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

module.exports = { client };