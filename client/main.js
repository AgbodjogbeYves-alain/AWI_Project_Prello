import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

// Client entry point, imports all client code

//import '/imports/startup/client';
//import '/imports/startup/both';


//import '../imports/startup/accounts-config.js';

import { renderRoutes } from '../imports/startup/client/routes.js';

Meteor.startup(() => {
    render(renderRoutes(), document.getElementById('render-target'));
});

/*import App from '../imports/ui/pages/App.js';
 
Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});*/
