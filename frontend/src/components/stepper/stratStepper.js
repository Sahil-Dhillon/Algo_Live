import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, HelperText } from '@windmill/react-ui'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';

import { toast } from "react-toastify";

import Select from "@mui/material/Select";
import { makeStyles } from "@mui/styles";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Grid from '@mui/material/Grid';
const steps = ['Stratey details', 'Add Conditions', 'Select Account and quantity'];

export default function StratStepper({ values, setValues }) {
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
        candleparam1,
        instrument2,
        period2,
        multiplier2,
        candleparam2,
        indicator1,
        indicator2,
        condition,

        active,
        loading,
        error,
        message
    } = values;


    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState({});
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };


    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepButton color="inherit" onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <div>
                {allStepsCompleted() ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {
                            activeStep === 0 ?
                                <>
                                    <Grid container spacing={1}>

                                        <Grid item xs={7}>

                                            <Label className="mt-2">
                                                <span className="required">Strategy Name</span>
                                                <Input
                                                    className="mt-2"
                                                    placeholder="John Doe"
                                                    name="name"
                                                    value={name}
                                                    onChange={handleChange}
                                                />
                                            </Label>

                                        </Grid>
                                        <Grid item xs={6}>
                                            <Label className="mt-2">
                                                <span className="required">Entry Time</span>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Stack spacing={3}>
                                                        <TimePicker
                                                            renderInput={(params) => <TextField {...params} />}
                                                            value={entryTime}

                                                            onChange={
                                                                (newValue) => {
                                                                    setValues({ ...values, entryTime: newValue });
                                                                }
                                                            }
                                                            minTime={new Date(0, 0, 0, 9, 15)}
                                                            maxTime={new Date(0, 0, 0, 15, 30)}
                                                        />
                                                    </Stack>
                                                </LocalizationProvider>
                                            </Label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Label className="mt-2">
                                                <span className="required">Exit Time</span>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Stack spacing={3}>
                                                        <TimePicker
                                                            renderInput={(params) => <TextField {...params} />}
                                                            value={exitTime}

                                                            onChange={(newValue) => {
                                                                setValues({ ...values, exitTime: newValue });
                                                            }}
                                                            minTime={new Date(0, 0, 0, 9, 15)}
                                                            maxTime={new Date(0, 0, 0, 15, 30)}
                                                        />
                                                    </Stack>
                                                </LocalizationProvider>
                                            </Label>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <div className="form-group">
                                                <Label className="mt-2">
                                                    <span className="required">Direction</span>
                                                </Label>

                                                <Select
                                                    labelId="demo-simple-select-outlined-label"
                                                        id="demo-simple-select-outlined"
                                                        placeholder="Select Direction"
                                                    value={direction}
                                                    name="direction"
                                                    onChange={handleChange}
                                                    label="Direction"
                                                >
                                                    <MenuItem value="buy">BUY</MenuItem>
                                                    <MenuItem value="sell">SELL</MenuItem>
                                                    <MenuItem value="both">BOTH</MenuItem>
                                                </Select>

                                            </div>
                                        </Grid>

                                            <Grid item xs={6}>
                                                <div className="form-group">
                                                    <Label className="mt-2">
                                                        <span className="required">Timeframe</span>
                                                    </Label>

                                                    <Select
                                                        labelId="demo-simple-select-outlined-label"
                                                        id="demo-simple-select-outlined"
                                                        placeholder="Select Timeframe"
                                                        value={timeFrame}
                                                        name="timeFrame"
                                                        onChange={handleChange}
                                                        label="Direction"
                                                    >
                                                        <MenuItem value="1">1 min</MenuItem>
                                                        <MenuItem value="5">5 min</MenuItem>
                                                        <MenuItem value="15">15 min</MenuItem>
                                                        <MenuItem value="30">30 min</MenuItem>
                                                        <MenuItem value="60">60 min</MenuItem>
                                                    </Select>

                                                </div>
                                            </Grid>


                                    </Grid>
                                </>
                                :
                                (activeStep === 1 ?
                                    <>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <div className="form-group">
                                                    <Label className="mt-2">
                                                        <span className="required">Instrument</span>
                                                    </Label>

                                                    <Select
                                                        labelId="demo-simple-select-outlined-label"
                                                        id="demo-simple-select-outlined"
                                                            value={instrument1}
                                                            placeholder="Select Instrument1"
                                                        name="instrument1"
                                                        onChange={handleChange}
                                                        label="Direction"
                                                    >
                                                        <MenuItem value="NIFTYMARFUT">NIFTYMARFUT</MenuItem>
                                                        <MenuItem value="BANKNIFTYMARFUT">BANKNIFTYMARFUT</MenuItem>
                                                        <MenuItem value="RELIANCE">RELIANCE</MenuItem>
                                                    </Select>

                                                </div>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <div className="form-group">
                                                        <Label className="mt-2">
                                                            <span className="required">Instrument 2</span>
                                                        </Label>

                                                        <Select
                                                            labelId="demo-simple-select-outlined-label"
                                                            id="demo-simple-select-outlined"
                                                            value={instrument2}
                                                            placeholder="Select Instrument2"
                                                            name="instrument2"
                                                            onChange={handleChange}
                                                            label="Instrument2"
                                                        >
                                                            <MenuItem value="NIFTYMARFUT">NIFTYMARFUT</MenuItem>
                                                            <MenuItem value="BANKNIFTYMARFUT">BANKNIFTYMARFUT</MenuItem>
                                                            <MenuItem value="RELIANCE">RELIANCE</MenuItem>
                                                        </Select>

                                                    </div>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <div className="form-group">
                                                        <Label className="mt-2">
                                                            <span className="required">Indicator 1</span>
                                                        </Label>

                                                        <Select
                                                            labelId="demo-simple-select-outlined-label"
                                                            id="demo-simple-select-outlined"
                                                            placeholder='Select Indicator1'
                                                            value={indicator1}
                                                            name="indicator1"
                                                            onChange={handleChange}
                                                            label="Indicator1"
                                                        >
                                                            <MenuItem value="supertrend">supertrend</MenuItem>
                                                            <MenuItem value="rsi">rsi</MenuItem>
                                                            <MenuItem value="sma">sma</MenuItem>
                                                        </Select>

                                                    </div>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <div className="form-group">
                                                        <Label className="mt-2">
                                                            <span className="required">Indicator 2</span>
                                                        </Label>

                                                        <Select
                                                            labelId="demo-simple-select-outlined-label"
                                                            id="demo-simple-select-outlined"
                                                            placeholder='Select Indicator2'
                                                            value={indicator2}
                                                            name="indicator2"
                                                            onChange={handleChange}
                                                            label="Indicator2"
                                                        >
                                                            <MenuItem value="supertrend">supertrend</MenuItem>
                                                            <MenuItem value="rsi">rsi</MenuItem>
                                                            <MenuItem value="sma">sma</MenuItem>
                                                        </Select>

                                                    </div>
                                                </Grid>
                                                <Grid item xs={6}>

                                                    <Label className="mt-2">
                                                        <span className="required">Period 1</span>
                                                        <Input
                                                            className="mt-2"
                                                            placeholder="14"
                                                            name="period1"
                                                            value={period1}
                                                            onChange={handleChange}
                                                        />
                                                    </Label>

                                                </Grid>
                                                <Grid item xs={6}>

                                                    <Label className="mt-2">
                                                        <span className="required">Period 2</span>
                                                        <Input
                                                            className="mt-2"
                                                            placeholder="14"
                                                            name="period2"
                                                            value={period2}
                                                            onChange={handleChange}
                                                        />
                                                    </Label>

                                                </Grid>
                                                <Grid item xs={6}>

                                                    <Label className="mt-2">
                                                        <span className="required">Multiplier 1</span>
                                                        <Input
                                                            className="mt-2"
                                                            placeholder="0"
                                                            name="multiplier1"
                                                            value={multiplier1}
                                                            onChange={handleChange}
                                                        />
                                                    </Label>

                                                </Grid>
                                                <Grid item xs={6}>

                                                    <Label className="mt-2">
                                                        <span className="required">Multiplier 2</span>
                                                        <Input
                                                            className="mt-2"
                                                            placeholder="0"
                                                            name="multiplier2"
                                                            value={multiplier2}
                                                            onChange={handleChange}
                                                        />
                                                    </Label>

                                                </Grid>
                                                <Grid item xs={6}>
                                                    <div className="form-group">
                                                        <Label className="mt-2">
                                                            <span className="required">Candle param 1</span>
                                                        </Label>

                                                        <Select
                                                            labelId="demo-simple-select-outlined-label"
                                                            id="demo-simple-select-outlined"
                                                            placeholder='Select Indicator2'
                                                            value={candleparam1}
                                                            name="candleparam1"
                                                            onChange={handleChange}
                                                            label="Candleparam1"
                                                        >
                                                            <MenuItem value="close">close</MenuItem>
                                                            <MenuItem value="high">high</MenuItem>
                                                            <MenuItem value="low">low</MenuItem>
                                                        </Select>

                                                    </div>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <div className="form-group">
                                                        <Label className="mt-2">
                                                            <span className="required">Candle param 2</span>
                                                        </Label>

                                                        <Select
                                                            labelId="demo-simple-select-outlined-label"
                                                            id="demo-simple-select-outlined"
                                                            placeholder='Select Indicator2'
                                                            value={candleparam2}
                                                            name="candleparam2"
                                                            onChange={handleChange}
                                                            label="Candleparam2"
                                                        >
                                                            <MenuItem value="close">close</MenuItem>
                                                            <MenuItem value="high">high</MenuItem>
                                                            <MenuItem value="low">low</MenuItem>
                                                        </Select>

                                                    </div>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <div className="form-group">
                                                        <Label className="mt-2">
                                                            <span className="required">condition</span>
                                                        </Label>

                                                        <Select
                                                            labelId="demo-simple-select-outlined-label"
                                                            id="demo-simple-select-outlined"
                                                            placeholder='Select Indicator2'
                                                            value={condition}
                                                            name="condition"
                                                            onChange={handleChange}
                                                            label="condition"
                                                        >
                                                            <MenuItem value="crossabove">cross above</MenuItem>
                                                            <MenuItem value="crossbelow">cross below</MenuItem>
                                                            <MenuItem value="crossover">cross over</MenuItem>
                                                        </Select>

                                                    </div>
                                                </Grid>
                                        </Grid>
                                    </>
                                    :
                                    <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <div className="form-group">
                                                    <Label className="mt-2">
                                                        <span className="required">order Type</span>
                                                    </Label>

                                                    <Select
                                                        labelId="demo-simple-select-outlined-label"
                                                        id="demo-simple-select-outlined"
                                                        placeholder='Select Indicator2'
                                                        value={orderType}
                                                        name="orderType"
                                                        onChange={handleChange}
                                                        label="orderType"
                                                    >
                                                        <MenuItem value="MIS">MIS</MenuItem>
                                                        <MenuItem value="NRML">NRML</MenuItem>
                                                        <MenuItem value="CNC">CNC</MenuItem>
                                                    </Select>

                                                </div>
                                            </Grid>
                                            <Grid item xs={6}>

                                                <Label className="mt-2">
                                                    <span className="required">target</span>
                                                    <Input
                                                        className="mt-2"
                                                        placeholder="0"
                                                        name="target"
                                                        value={target}
                                                        onChange={handleChange}
                                                    />
                                                </Label>

                                            </Grid>
                                            <Grid item xs={6}>

                                                <Label className="mt-2">
                                                    <span className="required">stoploss</span>
                                                    <Input
                                                        className="mt-2"
                                                        placeholder="0"
                                                        name="stopLoss"
                                                        value={stopLoss}
                                                        onChange={handleChange}
                                                    />
                                                </Label>

                                            </Grid>
                                            <Grid item xs={6}>

                                                <Label className="mt-2">
                                                    <span className="required">Quantity</span>
                                                    <Input
                                                        className="mt-2"
                                                        placeholder="1"
                                                        name="quantity"
                                                        value={quantity}
                                                        onChange={handleChange}
                                                    />
                                                </Label>

                                            </Grid>
                                         
                                    </Grid>
                                )

                        }

                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleNext} sx={{ mr: 1 }}>
                                Next
                            </Button>
                            {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                    <Typography variant="caption" sx={{ display: 'inline-block' }}>
                                        Step {activeStep + 1} already completed
                                    </Typography>
                                ) : (
                                    <Button onClick={handleComplete}>
                                        {completedSteps() === totalSteps() - 1
                                            ? 'Finish'
                                            : 'Complete Step'}
                                    </Button>
                                ))}
                        </Box>
                    </React.Fragment>
                )}
            </div>
        </Box>
    );
}
