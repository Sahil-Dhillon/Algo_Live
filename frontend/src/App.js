import React from "react";
import { BrowserRouter as Router, Route, Switch,Redirect } from "react-router-dom";
import Admin from "./layouts/admin.js";
import Auth from "./layouts/auth.js";
function App() {
  return (
    <div className="App">
      <Router>
        
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/admin" component={Admin} />
          
        </Switch>
        <Redirect from="*" to="/auth/signin" />
      </Router>
    </div>
  );
}

export default App;
