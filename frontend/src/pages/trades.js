import React, { useState, useEffect } from "react";
import { getAllTrades } from "../action/tradeActions";
import TradesTable from "../components/Cards/tradesTable";

export default function Trades() {
  const [values, setValues] = useState({
    error: "",
    loading: false,
    message: "",
  });

  const [trades, setTrades] = useState([]);

  useEffect(() => {
    setValues({ ...values, loading: true });
    getAllTrades()
      .then((res) => {
        try {
          setTrades(res);
          setValues({ ...values, loading: false });
        } catch (error) {
          setValues({ ...values, error: error, loading: false });
          console.log(error);
        }
      })
      .catch((err) => {
        setValues({ ...values, error: err, loading: false });
        console.log(err);
      });
  }, []);
  const showLaoding = () =>
    values.loading ? <div className="alert alert-info">Loading...</div> : "";
  const showError = () =>
    values.error ? (
      <div className="alert alert-danger">{values.error}</div>
    ) : (
      ""
    );
  const showMessage = () =>
    values.message ? (
      <div className="alert alert-info">{values.message}</div>
    ) : (
      ""
    );
  return (
    <>
      <div className="container">
        {showLaoding()}
        {showError()}
        {showMessage()}
        <TradesTable trades={trades} />
      </div>
    </>
  );
}
