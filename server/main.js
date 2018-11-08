import { Meteor } from 'meteor/meteor';

import './api/users.js';
import './api/boards';
import './api/lists';
import './api/teams';
import { ServiceConfiguration } from 'meteor/service-configuration';

Meteor.startup(() => {
    if(Meteor.settings.google){
        ServiceConfiguration.configuration.upsert({
            service: 'google',
        },{
            $set: Meteor.settings.google
        });
    }

});