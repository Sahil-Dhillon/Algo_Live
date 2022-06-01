import React from "react";
import { Route, Switch,Redirect } from "react-router-dom";


import SignUP from "../pages/SignUp";
import Signin from "../pages/SignIn";
import Header from "../component/Header";
export default function Auth() {
    return (
        <>
           <Header />
            {/* <Protected /> */}
            <Switch>
                <Route path="/auth/signup" component={SignUP} exact />
                <Route path="/auth/signin" component={Signin} exact />
                <Redirect from="*" to="/auth/signin" />
            </Switch>
        </>
   
    );
}
