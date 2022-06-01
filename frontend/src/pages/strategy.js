import React, { useState, useEffect } from 'react'
import { getAllStrategies } from '../action/accountsAction';


import StrategyTable from '../components/Cards/strategiesTable'


export default function Strategy() {
    const [values, setValues] = useState({
        name: "",
        entryTime: "",
        exitTime: "",
        direction: "",
        timeFrame: "",
        orderType: "",
        quantity: 0,
        stopLoss: "",
        target: "",
        instrument1: "",
        instrument2: "",
        indicator1:"",
        period1: "",
        multiplier1: "",
        candleParam1: "close",
        indicator2: "",
        period2: "",
        multiplier2: "",
        candleParam2: "close",
        condition: "",
        targetunit: "%",
        stopLossunit: "%",
        active: "true",
        loading: false,
        error: "",
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
                <StrategyTable values={values}  setValues={setValues} />
            </div>
        </>

    )
}
