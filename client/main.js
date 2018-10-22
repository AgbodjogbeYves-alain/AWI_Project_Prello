import '../imports/startup/client/routes.js';

import { renderRoutes } from '../imports/startup/client/routes.js';

Meteor.startup(() => {
    render(renderRoutes(), document.getElementById('render-target'));
});
