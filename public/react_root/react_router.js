import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

// Reducers
import { rootApp, exampleView, loginView, newUserView, coderHomeView, indexView } from './reducers'

// Components
import MainComponent from '../react_components/Common/MainComponent'
import NotFound from '../react_components/NotFound'
import Example from '../react_components/Example/main'
import Login from '../react_components/Login/main'
import NewUser from '../react_components/NewUser/main'
import CoderHome from '../react_components/CoderHome/main'
import Root from '../react_components/Index/main' // index is taken


const store = createStore(
    combineReducers({
        // reminder: all info stored in here is visible at all times to the client
        global: rootApp,
        example: exampleView,
        login: loginView,
        newUser: newUserView,
        coderHome: coderHomeView,
        index: indexView,
        routing: routerReducer
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={MainComponent}>
                <IndexRoute component={Root} />
                <Route path="example" component={Example} />
                <Route path="login" component={Login} />
                <Route path="new_user" component={NewUser} />
                <Route path="coder_home" component={CoderHome} />
                <Route path="index" component={Root} />
                {/* Below MUST remain at end of list */}
                <Route path="*" component={NotFound} />
            </Route>
        </Router>
    </Provider>, 
    document.getElementById("root")
)