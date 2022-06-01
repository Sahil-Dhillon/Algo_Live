
import { API, FEED_URL } from "../config/config";
import cookie from "js-cookie";
import { isAuth, getCookie } from "./authAcation";
export const getAllAccounts = () => {
    let token = cookie.get("token")
    let id = isAuth()._id

    console.log(id)
    if (token) {

        return fetch(`${API}/accounts/getAllAccounts/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                console.log(res)
                return res.json();
            })
            .catch((err) => {
                return err;
            });
    }
    else {
        return {
            error: "You are not authenticated"
        };
    }
}

export const addAccount = (account) => {
    let token = cookie.get("token")
    let x = account
    x.user = isAuth()._id
    if (token) {
        return fetch(`${API}/accounts/addAccount`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(x),
        })
            .then((res) => {
                return res.json();
            })
            .catch((err) => {
                return err;
            });
    }
    else {
        return {
            error: "You are not authenticated"
        };
    }

}

export const updateAccount = (account, id) => {
    let token = cookie.get("token")

    if (token) {
        return fetch(`${API}/accounts/updateAccount/${id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(account),
        })
    }
}

export const loginAccount = (id) => {
    let token = cookie.get("token")
    if (token) {
        return fetch(`${API}/accounts/loginAccount/${id}`, {
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
    }
    else {
        return {
            error: "You are not authenticated"
        };
    }
}


export const getAllStrategies = () => {
    let token = cookie.get("token")
    let id = isAuth()._id
    if (token) {
        return fetch(`${API}/strategies/getAllStrategies/${id}`, {
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
    }
    else {
        return {
            error: "You are not authenticated"
        };
    }
}

export const addStrategy = (strategy) => {
    let token = cookie.get("token")
    let x = strategy
    x.user = isAuth()._id
    console.log(x)
    if (token) {
        return fetch(`${API}/strategies/addStrategy`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(x),
        })
            .then((res) => {
                return res.json();
            })
            .catch((err) => {

                return err;
            });
    }
    else {
        return {
            error: "You are not authenticated"
        };
    }
}

export const updateStrategy = (strategy, id) => {
    let token = cookie.get("token")
    if (token) {
        return fetch(`${API}/strategies/updateStrategy/${id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(strategy),
        }).then((res) => {
            return res.json();
        })
            .catch((err) => {
                return err;
            });
    }
    else {
        return {
            error: "You are not authenticated"
        };
    }
}

export const deleteStrategy = (id) => {
    let token = cookie.get("token")
    if (token) {
        return fetch(`${API}/strategies/deleteStrategy/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            return res.json();
        })
            .catch((err) => {
                return err;
            });
    }
    else {
        return {
            error: "You are not authenticated"
        };
    }
}

export const toggleStrategy = (id) => {
    let token = cookie.get("token")
    if (token) {
        return fetch(`${API}/strategies/toggleStrategy/${id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            return res.json();
        })
            .catch((err) => {
                return err;
            });
    }
    else {
        return {
            error: "You are not authenticated"
        };
    }
}

export const getPositions = (id) => {
    let token = cookie.get("token")
    if (token) {
        return fetch(`${API}/accounts/getPositions/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            return res.json();
        })
            .catch((err) => {
                return err;
            });
    }
    else {
        return {
            error: "You are not authenticated"
        };
    }
}

export const getAllInstruments = () => {


    return fetch(`${API}/strategies/getAllInstruments`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

        },
    }).then((res) => {
        return res.json();
    })
        .catch((err) => {
            return err;
        });
}
export const getAllFuturesExpiry = () => {


    return fetch(`${API}/strategies/getAllFuturesExpiry`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

        },
    }).then((res) => {
        return res.json();
    })
        .catch((err) => {
            return err;
        });
}
export const getAllFuturesTokens = () => {


    return fetch(`${API}/strategies/getAllFuturesTokens`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

        },
    }).then((res) => {
        return res.json();
    })
        .catch((err) => {
            return err;
        });
}
export const getAllFutures = () => {


    return fetch(`${API}/strategies/getAllFutures`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

        },
    }).then((res) => {
        return res.json();
    })
        .catch((err) => {
            return err;
        });
}
export const getAllOptions = () => {


    // return fetch('http://localhost:4007/api/getInstrumentList', {
    return fetch(`${FEED_URL}/api/getInstrumentList`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

        },
    }).then((res) => {
        return res.json();
    })
        .catch((err) => {
            return err;
        });
}