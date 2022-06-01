import React from "react";
import ReactDOM from "react-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import './assets/styles/tailwind.css';
import './assets/styles/tailwind.output.css';

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Admin from "./layouts/admin.js";
import Auth from "./layouts/auth.js";
ReactDOM.render(
 
   

      <Router>

        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/admin" component={Admin} />

        </Switch>
        <Redirect from="*" to="/auth/signin" />
      </Router>
   
 ,
  document.getElementById("root")
);
