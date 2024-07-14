const noblox = require('noblox.js');
require('dotenv').config();

const initializeNoblox = async () => {
    try {
        await noblox.setCookie(process.env.ROBLOX_TOKEN);
        const currentUser = await noblox.getCurrentUser();
        console.log(`\x1b[32mLogged in as ${currentUser.UserName}\x1b[0m`);  // Green text
    } catch (error) {
        console.error(`\x1b[31mError initializing Noblox:\x1b[0m`, error);  // Red text
        throw error;
    }
};

const getCSRFToken = async () => {
    try {
        const token = await noblox.getGeneralToken();
        return token;
    } catch (error) {
        console.error(`\x1b[31mError fetching CSRF token:\x1b[0m`, error);  // Red text
        throw error;
    }
};

module.exports = { initializeNoblox, getCSRFToken };
