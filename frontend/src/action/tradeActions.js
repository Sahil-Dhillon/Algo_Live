import fetch from "isomorphic-fetch";
import { API } from "../config/config";
import cookie from "js-cookie";
import { isAuth, getCookie } from "./authAcation";

export const getAllTrades = () => {
    let token = cookie.get("token");
    let id = isAuth()._id;
    
    if (token) {
        return fetch(`${API}/trades/getAllTrades/${id}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        })
        .then((res) => {
            return res.json();
        })
        .catch((err) => {
            return err;
        });
    } else {
        return {
        error: "You are not authenticated",
        };
    }
}