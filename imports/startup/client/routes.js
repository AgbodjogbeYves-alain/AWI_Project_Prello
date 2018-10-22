import React from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// route components
import App from '../../ui/pages/Home/App.js';
import AuthPageSignIn from '../../ui/pages/SignUp/AuthPageSignIn.js';

/*import ListPageContainer from '../../ui/containers/ListPageContainer.js';
import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.js';
import AuthPageJoin from '../../ui/pages/AuthPageJoin.js';
import NotFoundPage from '../../ui/pages/NotFoundPage.js';*/

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
    <Router history={browserHistory}>
        <Switch>
            <Route exact path="/" component={App}/>
        </Switch>
    </Router>
);