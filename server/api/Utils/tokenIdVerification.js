const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client("909976969961-r4v6ls5qbgjvslotg7trcb066vig4cb8.apps.googleusercontent.com");
module.exports = {
    verify : async function(tokenId){
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: "909976969961-r4v6ls5qbgjvslotg7trcb066vig4cb8.apps.googleusercontent.com",
        });
        return ticket.getPayload();

    }
}

