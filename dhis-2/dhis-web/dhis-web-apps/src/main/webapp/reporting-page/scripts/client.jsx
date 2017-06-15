import 'react-toolbox/lib/commons.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import D2Library from 'd2/lib/d2';
import calUrl from "./utils/cal-url.js";
import OpsReporting from './components/ops-reporting/index.jsx'
import MessageReporting from './components/message-reporting/index.jsx'
import CommentsReporting from './components/comments-reporting/index.jsx'
import { Router, Route, hashHistory } from 'react-router'

import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';
import ReportingPage from './components/reporting-page/index.jsx';

D2Library.getManifest('manifest.webapp')
    .then(manifest => {
        D2Library.config.baseUrl = calUrl.getBaseUrl();
    })
    .then(D2Library.getUserSettings)
    .then(userSettings => {
        if (userSettings.keyUiLocale !== 'en' && userSettings.keyUiLocale !== null) {
            D2Library.config.i18n.sources.add(`i18n/i18n_module_${userSettings.keyUiLocale}.properties`);
        }
        D2Library.config.i18n.sources.add('i18n/i18n_module_en.properties');
    })
    .then(D2Library.init)
    .then(d2 => {
        ReactDOM.render((
                <Router history={hashHistory}>
                    <Route path="/" component={ReportingPage} d2={d2}/>
                    <Route path="/ops" component={OpsReporting} d2={d2}/>
                    <Route path="/message" component={MessageReporting} d2={d2}/>
                    <Route path="/comments" component={CommentsReporting} d2={d2}/>
                </Router>
            ), document.getElementById('app'));
    })
    .catch(error => {
        console.log("error:",error);
        ReactDOM.render((<div>Failed to initialise D2</div>), document.getElementById('app'));
    });

ReactDOM.render(<LoadingMask />, document.getElementById('app'));
