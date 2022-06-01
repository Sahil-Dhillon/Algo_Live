import React from "react";
import { Switch, Route } from "react-router-dom";



import FooterAdmin from "../components/Footers/FooterAdmin.js";

// views
import Account from '../pages/accounts.js'
import Strategy from '../pages/strategy.js'
import Position from '../pages/positions.js'
import Trade from '../pages/trades.js'
import Header from "../component/Header";
export default function Admin() {
  return (
    <>
      <Header />
      <div className="container" style={{ height: 100 }}>

      </div>
      <Switch>

        <Route path="/admin/accounts" exact component={Account} />
        <Route path="/admin/strategies" exact component={Strategy} />
        <Route path="/admin/positions" exact component={Position} />
        <Route path="/admin/trades" exact component={Trade} />

      </Switch>
      
      <FooterAdmin />


    </>
  );
}
