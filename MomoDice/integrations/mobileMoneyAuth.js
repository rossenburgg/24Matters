require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.MOBILE_MONEY_API_URL;
const API_KEY = process.env.MOBILE_MONEY_API_KEY;

async function initiateAuthorization(X_Target_Environment, X_Callback_Url = '') {
    try {
        const headers = {
            'Authorization': `Bearer ${API_KEY}`,
            'X-Target-Environment': X_Target_Environment
        };

        if (X_Callback_Url) {
            headers['X-Callback-Url'] = X_Callback_Url;
        }

        const response = await axios.post(`${API_URL}/collection/v1_0/bc-authorize`, {}, { headers });
        console.log(`Authorization initiated with response: ${JSON.stringify(response.data)}`);
        return {
            auth_req_id: response.data.auth_req_id,
            interval: response.data.interval,
            expires_in: response.data.expires_in
        };
    } catch (error) {
        console.error('Error initiating authorization', error.message, error.stack);
        throw error;
    }
}

module.exports = {
    initiateAuthorization,
};