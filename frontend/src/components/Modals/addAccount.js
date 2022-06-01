import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input, HelperText } from '@windmill/react-ui'


import { toast } from "react-toastify";
import { getAllAccounts,updateAccount, addAccount } from '../../action/accountsAction';
import Select from "@mui/material/Select";
import { makeStyles } from "@mui/styles";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import {Visibility,VisibilityOff} from '@mui/icons-material'
import Grid from '@mui/material/Grid';

export default function AddAccount({update,account, values, setValues }) {
    const {
        
        userID,
        name,
        broker,
        password,
        pin,
      
        apiKey,
        secret,
        totp_secret,
        auth_type,
    
       
    } = values;
   
    const [showPassword, setShowPassword] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };


    const useStyles = makeStyles(() => ({
        formControl: {
            margin: 1,
            minWidth: 250,
        },
        selectEmpty: {
            marginTop: 2,
        },
    }));

    const handleSubmit = async (e) => {
        setValues({ ...values, loading: true, error: false, message: false })
        e.preventDefault();
        if (!userID || !password || !broker || !apiKey || !secret) {
            toast.error("Required fields cannot be empty!");
            return;
        }
        if (auth_type === "totp" && !totp_secret) {
            toast.error("totp_secret field cannot be empty!");
            return;
        }
        if (auth_type === "totp" && totp_secret.length !== 32) {
            toast.error("totp_secret should contain 32 Characters!");
            return;
        }
        if (auth_type === "pin" && !pin) {
            toast.error("Pin field cannot be empty!");
            return;
        }
        console.log(values);
        if (update) {
            updateAccount(values, account?._id).then(res => {
                toast.success("Account Updated Successfully!");
                setValues({ ...values, loading: false, error: false, message: false })
                setIsModalOpen(false);
               
            }).catch(err => {
                setValues({ ...values, loading: false, error: err, message: false })
                console.log(err)
            })
        }
        else {
            addAccount(values).then(res => {
                console.log(res)
                toast.success("Account Added Successfully!");
                setValues({ ...values, loading: false, error: false, message: false })
            }).catch(err => {
                console.log(err)
                setValues({ ...values, loading: false, error: err, message: false })
                toast.error("Error Adding Account!");
            })
        }
        
        setIsModalOpen(false)
    };

    function closeModal() {
        setIsModalOpen(false)
        setValues({
            name: '',
            userID: "",
            password: "",
            broker: "",
            pin: "",
            pan: "",
            apiKey: "",
            secret: "",
            totp_secret: "",
            auth_type: "pin",
      
        });
    }

    const classes = useStyles();
    function openModal() {
        if (update) {
            setValues({
                name: account.name,
                userID: account.userID,
                password: account.password,
                broker: account.broker,
                pin: account.pin,
                apiKey: account.apiKey,
                secret: account.secret,
                totp_secret: account.totp_secret,
                auth_type: account.auth_type,

            })
        }
        setIsModalOpen(true)
    }
   
   
    return (
        <>
            <div>
                <Button onClick={openModal}>{update ? "Update" : "Add"} Account</Button>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalHeader>Add Account</ModalHeader>
                <ModalBody>
                    <Grid container spacing={1}>
                       
                    <Grid item xs={7}>
                       
                            <Label className="mt-2">
                                <span className="required">Name</span>
                                <Input
                                    className="mt-2"
                                    placeholder="John Doe"
                                    name="name"
                                    value={name}
                                    onChange={handleChange}
                                />
                            </Label>
                     
                        </Grid>
                        <Grid item xs={5}>
                            <Label className="mt-2">
                                <span className="required">userID</span>
                                <Input
                                    className="mt-2"
                                    placeholder="K12345"
                                    name="userID"
                                    value={userID}
                                    onChange={handleChange}
                                />
                            </Label>
                        </Grid>

                        <Grid item xs={6}>
                            <div className="form-group">
                                <Label className="mt-2">
                                    <span className="required">Broker</span>
                                </Label>
                              
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={broker}
                                        name="broker"
                                        onChange={handleChange}
                                        label="Broker"
                                    >
                                        <MenuItem value="zerodha">Zerodha</MenuItem>
                                        <MenuItem value="iifl">IIFL</MenuItem>
                                        <MenuItem value="fyers">Fyers</MenuItem>
                                    </Select>
                                
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <Label className="mt-2">
                                <span className="required">Password</span>
                            </Label>
                            <div>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="mt-1"
                                    value={password}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ marginRight: "2px", marginTop: "-40px", "cursor": "pointer", "float": "right" }}
                                    onMouseDown={(e) => e.preventDefault()}            >
                                    {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                                </IconButton>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className="form-group">
                                <Label className="mt-2">
                                    <span className="required">Auth Type</span>
                                </Label>
                               
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={auth_type}
                                        name="auth_type"
                                        onChange={handleChange}
                                        label="Auth Type"
                                    >
                                        <MenuItem value="pin">PIN</MenuItem>
                                        <MenuItem value="totp">TOTP</MenuItem>
                                    </Select>
                               
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            {auth_type === "totp" ? (
                                <Label className="mt-2">
                                    <span className="required">T-OTP Secret</span>
                                    <Input
                                        className="mt-1"
                                        // onInput={totp_secret = totp_secret.toUpperCase()}
                                        style={{ textTransform: "uppercase" }}
                                        placeholder="DSJFBIWBFEIEI23HUBIREI"
                                        name="totp_secret"
                                        value={totp_secret}
                                        onChange={handleChange}
                                    />
                                </Label>
                            ) : (
                                <Label className="mt-2">
                                    <span className="required">Pin</span>
                                    <Input
                                        className="mt-1"
                                        placeholder="123456"
                                        name="pin"
                                        value={pin}
                                        onChange={handleChange}
                                    />
                                </Label>
                            )}
                        </Grid>
                       

                        <Grid item xs={12}>
                            <Label className="mt-2">
                                <span className="required">apiKey</span>
                                <Input
                                    className="mt-1"
                                    placeholder="sdf23jnj1221"
                                    name="apiKey"
                                    value={apiKey}
                                    onChange={handleChange}
                                />
                            </Label>
                        </Grid>
                        <Grid item xs={12}>
                            <Label className="mt-2">
                                <span className="required">Secret</span>
                                <Input
                                    className="mt-1"
                                    placeholder="fdswe234878hdflnjBu3"
                                    name="secret"
                                    value={secret}
                                    onChange={handleChange}
                                />
                            </Label>
                        </Grid>

                        
                       
                
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button className="w-full sm:w-auto" layout="outline" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button className="w-full sm:w-auto" onClick={handleSubmit}>Accept</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}
