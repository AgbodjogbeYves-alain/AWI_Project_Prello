const {OAuth2Client} = require('google-auth-library');

const clientId =process.env.KEYAPI ? process.env.KEYAP : "909976969961-r4v6ls5qbgjvslotg7trcb066vig4cb8.apps.googleusercontent.com"; 
const client = new OAuth2Client(clientId);
module.exports = {
    verify : async function(tokenId){
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: clientId,
        });
        return ticket.getPayload();

    }
}

