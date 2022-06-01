import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input, HelperText } from '@windmill/react-ui'
import StratStepper from '../stepper/stratStepper';
import StratSingle from '../stepper/stratSingle';
import { toast } from "react-toastify";
import Dialog from '@mui/material/Dialog';
import { getAllStrategies, addStrategy } from '../../action/accountsAction';
import Select from "@mui/material/Select";
import { makeStyles } from "@mui/styles";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Grid from '@mui/material/Grid';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
export default function AddStrategy({ values, setValues }) {
    const {
        name,
        entryTime,
        exitTime,
        direction,
        timeFrame,
        orderType,
        quantity,
        stopLoss,
        target,

        instrument1,
        period1,
        multiplier1,
        candleParam1,
        instrument2,
        period2,
        multiplier2,
        candleParam2,
        indicator1,
        indicator2,
        condition,
        stopLossunit,
        targetunit,
        active,
        loading,
        error,
        message
    } = values;


    const [isModalOpen, setIsModalOpen] = useState(false)



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
        e.preventDefault();
        setValues({ ...values, loading: true, error: "" });
        try {
            let x = {
                name: name,
                entryTime: entryTime,
                exitTime: exitTime,
                direction: direction,
                timeFrame: timeFrame,
                orderType: orderType,
                quantity: quantity,
                stopLoss: stopLoss,
                target: target,
                indicator1: indicator1,
                period1: period1,
                multiplier1: multiplier1,
                candleParam1: candleParam1,
                indicator2: indicator2,
                period2: period2,
                multiplier2: multiplier2,
                candleParam2: candleParam2,
                stopLossunit: stopLossunit,
                targetunit: targetunit,
                condition: condition,
                active: active,
                instrument1: instrument1,
                instrument2: instrument2,

            }
            addStrategy(x).then(res => {
                setValues({ ...values, loading: false, message: res.message });
                toast.success(res.message);
                setIsModalOpen(false);
            }).catch(err => {
                setValues({ ...values, loading: false, error: err.message });
                console.log("Error")
                toast.error(err.message);
            });
        } catch (error) {
            setValues({ ...values, loading: false, error: error.message });
            console.log("Error 2")
            // toast.error(error.message);
        }
        console.log(values);
        setIsModalOpen(false)
    };

    function closeModal() {
        setIsModalOpen(false)

    }

    const classes = useStyles();
    function openModal() {
        setIsModalOpen(true)
    }


    return (
        <>
            <div >
                <Button onClick={openModal}>Add Strategy</Button>
            </div>
            <Dialog fullScreen open={isModalOpen} onClose={closeModal}>



                <DialogTitle>Add Strategy</DialogTitle>
                <DialogContent>
                    <StratSingle values={values} setValues={setValues} />
                </DialogContent>
                <DialogActions>
                    <Button className="w-full sm:w-auto" layout="outline" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button className="w-full sm:w-auto" onClick={handleSubmit}>Accept</Button>
                </DialogActions>

            </Dialog>
        </>
    )
}
