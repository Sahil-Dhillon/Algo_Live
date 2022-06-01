import React,{useState,useEffect} from "react";
import PropTypes from "prop-types";
import './accountTable.css'

// components
import AddAccount from "../Modals/addAccount.js";
import TableDropdown from "../Dropdowns/TableDropdown.js";
import { getAllAccounts, addAccount } from '../../action/accountsAction';
export default function AccountsTable({ color,  values, setValues }) {
     const [accounts, setAccounts] = useState([]);

  
    useEffect(() => {
     
        getAllAccounts().then(res => {
            
            setAccounts(res)
          
        }).catch(err => {
         
            console.log(err)
        })
    }, [values])
    return (
        <>
            <div style={{borderRadius:'13px'}}
                className={ "container"+
                    "relative flex flex-col min-w-0 break-words w-full mb-8 shadow-lg rounded" + 
                    (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white") 
                }
            >
                
                <div className="rounded-t mb-0 px-4 py-3 border-12 " style={{background:'#B9FCFB',textAlign:"center"}}>
                    <div className="flex flex-wrap items-center" >
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1 accountHeading" >
                            <h3 
                                className={
                                    "font-semibold text-lg " +
                                    (color === "light" ? "text-blueGray-700" : "text-white")
                                }
                            >
                               Accounts
                            </h3>
                        </div>
                        <AddAccount update={accounts.length > 0 ? true : false} account={accounts.length > 0 ? accounts[0] : -1} values={values} setValues={setValues}/>

                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* Projects table */}
                    <table className="items-center w-full bg-transparent border-collapse accountTable">
                        <thead>
                            <tr>
                                <th 
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    No.
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                   Name
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                   UserId
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                   Balance
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Auth
                                </th>
                                <th 
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-light" +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.length > 0 && accounts.map((account, index) => (
                                
                                <tr key={account?._id}>
                                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                                       
                                        <span 
                                            className={
                                                "ml-3 font-bold " +
                                                +(color === "light" ? "text-blueGray-600" : "text-white")
                                            }
                                        >
                                            {index + 1}
                                        </span>
                                    </th>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                       {account.name}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {account.userID}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex">
                                          {account.balance}  
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        <div className="flex">
                                            {account.auth_type}
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                        <TableDropdown values={values} setValues={setValues} id={account._id}/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

AccountsTable.defaultProps = {
    color: "light",
};

AccountsTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
