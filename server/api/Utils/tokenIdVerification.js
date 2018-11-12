const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(Meteor.settings.google.clientId);
module.exports = {
    verify : async function(tokenId){
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: Meteor.settings.google.clientId, 
        });
        return ticket.getPayload();
       
    }
}

