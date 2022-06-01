import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input, HelperText } from '@windmill/react-ui'
import StratStepper from '../stepper/stratStepper';
import StratSingle from '../stepper/stratSingle';
import { toast } from "react-toastify";
import Dialog from '@mui/material/Dialog';
import { updateStrategy} from '../../action/accountsAction';

import { makeStyles } from "@mui/styles";


import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';
export default function UpdateStrategy({ strategy,closeDrop }) {
    const [values, setValues] = useState({
        name: strategy.name,
        entryTime: strategy.entryTime,
        exitTime: strategy.exitTime,
        direction: strategy.direction,
        timeFrame: strategy.timeFrame,
        orderType: strategy.orderType,
        quantity: strategy.quantity,
        stopLoss: strategy.stopLoss,
        target: strategy.target,
        instrument1: strategy.instrument1,
        period1: strategy.period1,
        multiplier1: strategy.multiplier1,
        candleParam1: strategy.candleParam1,
        instrument2: strategy.instrument2,
        period2: strategy.period2,
        multiplier2: strategy.multiplier2,
        candleParam2: strategy.candleParam2,
        indicator1: strategy.indicator1,
        indicator2: strategy.indicator2,
        condition: strategy.condition,
        stopLossunit: strategy.stopLossunit,
        targetunit: strategy.targetunit,
        active: strategy.active,
        loading: false,
        error: false,
        message: '',
    })



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
            
            updateStrategy(values,strategy._id).then(res => {
                setValues({ ...values, loading: false, message: res.message });
                toast.success(res.message);
                setIsModalOpen(false);
            }).catch(err => {
                setValues({ ...values, loading: false, error: err.message });
                toast.error(err.message);
            });
        } catch (error) {
            setValues({ ...values, loading: false, error: error.message });
            toast.error(error.message);
        }
        console.log(values);
        setIsModalOpen(false)
        closeDrop()
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
            <div>
                <Button onClick={openModal}>Update Strategy</Button>
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
