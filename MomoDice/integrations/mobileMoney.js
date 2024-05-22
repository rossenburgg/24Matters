require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.MOBILE_MONEY_API_URL;
const API_KEY = process.env.MOBILE_MONEY_API_KEY;

async function initiateDeposit(userId, amount) {
    try {
        const response = await axios.post(`${API_URL}/deposit`, {
            userId,
            amount,
        }, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        console.log(`Deposit initiated for user ${userId} with amount ${amount}`);
        return response.data;
    } catch (error) {
        console.error('Error initiating deposit', error.message, error.stack);
        throw error;
    }
}

async function handleWithdrawal(userId, amount) {
    try {
        const response = await axios.post(`${API_URL}/withdraw`, {
            userId,
            amount,
        }, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        console.log(`Withdrawal handled for user ${userId} with amount ${amount}`);
        return response.data;
    } catch (error) {
        console.error('Error handling withdrawal', error.message, error.stack);
        throw error;
    }
}

async function checkTransactionStatus(transactionId) {
    try {
        const response = await axios.get(`${API_URL}/transaction/${transactionId}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        console.log(`Transaction status checked for transaction ID ${transactionId}`);
        return response.data;
    } catch (error) {
        console.error('Error checking transaction status', error.message, error.stack);
        throw error;
    }
}

async function initiateAuthorization(xTargetEnvironment, xCallbackUrl = '') {
    try {
        const response = await axios.post(`${API_URL}/bc-authorize`, {}, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'X-Target-Environment': xTargetEnvironment,
                ...(xCallbackUrl && { 'X-Callback-Url': xCallbackUrl })
            }
        });
        console.log(`Authorization initiated with X-Target-Environment: ${xTargetEnvironment}`);
        return {
            authReqId: response.data.auth_req_id,
            interval: response.data.interval,
            expiresIn: response.data.expires_in
        };
    } catch (error) {
        console.error('Error initiating authorization', error.message, error.stack);
        throw error;
    }
}

module.exports = {
    initiateDeposit,
    handleWithdrawal,
    checkTransactionStatus,
    initiateAuthorization,
};