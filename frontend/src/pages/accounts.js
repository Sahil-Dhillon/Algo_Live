import React, { useState } from 'react'

import AccountsTable from '../components/Cards/accountsTable'


export default function Account() {
    const [values, setValues] = useState({
        name: '',
    userID: "",
    password: "",
    broker: "zerodha",
    pin: "",
    apiKey: "",
    secret: "",
    totp_secret: "",
    auth_type: "pin",
        error: "",
        loading: false,
        message: "",
    
     });
    

    const showLaoding = () =>
        values.loading ? <div className="alert alert-info">Loading...</div> : "";
    const showError = () =>
        values.error ? <div className="alert alert-danger">{values.error}</div> : "";
    const showMessage = () =>
        values.message ? <div className="alert alert-info">{values.message}</div> : "";
 

    return (
        
            <>
                <div className="container">
                {showLaoding()}
                {showError()}
                {showMessage()}
                    <AccountsTable values={values} setValues={setValues}  />
                </div>
            </>
     
    )
}
