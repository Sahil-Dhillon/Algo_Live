import React from "react";
import { createPopper } from "@popperjs/core";
import { toggleStrategy, deleteStrategy } from '../../action/accountsAction'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input, HelperText } from '@windmill/react-ui'
import UpdateStrategy    from "../Modals/updateStrategy";
const StrategyTableDrop = ({ strategy, values, setValues }) => {
    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();
    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "left-start",
        });
        setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };

    async function toggleStrat(id) {
        setValues({ ...values, loading: true })
        const res = await toggleStrategy(id)
        if (res.error) {
            setValues({ ...values, error: res.error, loading: false })
        } else {
            setValues({ ...values, error: false, loading: false })
        }
    }

    async function deleteStrat(id) {
        setValues({ ...values, loading: true })
        const res = await deleteStrategy(id)
        if (res.error) {
            setValues({ ...values, error: res.error, loading: false })
        } else {
            setValues({ ...values, error: false, loading: false })
        }
    }

    return (
        <>
            <a
                className="text-blueGray-500 py-1 px-3"
                href="#pablo"
                ref={btnDropdownRef}
                onClick={(e) => {
                    e.preventDefault();
                    dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
                }}
            >
                <i className="fas fa-ellipsis-v"></i>
            </a>
            <div
                ref={popoverDropdownRef}
                className={
                    (dropdownPopoverShow ? "block " : "hidden ") +
                    "bg-white text-base z-50 float py-2 list-none text-left rounded shadow-lg min-w-48"
                }
            >
                <UpdateStrategy strategy={strategy} closDrop={closeDropdownPopover} />
                <Button
                    style={{ margin: "0.5rem" }}
                    
                    onClick={(e) => {
                        e.preventDefault();
                        toggleStrat(strategy._id)
                        closeDropdownPopover();
                    }}
                >
                   Toggle
                </Button>
                <Button
                    style={{ margin: "0.5rem" }}
                  
                    onClick={(e) => {
                        e.preventDefault();
                        deleteStrat(strategy._id)
                        closeDropdownPopover();
                    }}
                >
                    Delete
                </Button>

            </div>
        </>
    );
};

export default StrategyTableDrop;
