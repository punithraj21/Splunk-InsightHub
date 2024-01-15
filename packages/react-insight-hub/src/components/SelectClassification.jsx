import React, { useEffect, useState } from "react";
import { isEmpty, startCase } from "lodash";
import Select from "@splunk/react-ui/Select";
import PropTypes from "prop-types";

import { classificationType } from "../../../insight-app/config";

// Component for selecting classification type
export const SelectClassification = ({ row, handleChangeClassification }) => {
    // State for managing the selected classification types and current ID
    const [classificationTypes, setClassificationTypes] = useState([]);
    const [currentId, setCurrentId] = useState("");

    // Effect hook to call the handleChangeClassification function whenever classificationTypes or the function itself changes
    useEffect(() => {
        handleChangeClassification(classificationTypes, currentId);
    }, [classificationTypes, handleChangeClassification]);

    // Function to handle classification change
    const changeClassification = (e, { value }) => {
        setClassificationTypes(value);
    };

    return (
        <Select
            style={{ width: "100%" }}
            value={isEmpty(classificationTypes) ? row.classification : classificationTypes}
            onChange={(e, { value }) => {
                setCurrentId(row._id);
                changeClassification(e, { value });
            }}
        >
            {classificationType.map((tab) => (
                <Select.Option key={tab} label={startCase(tab)} value={tab} />
            ))}
        </Select>
    );
};

// PropTypes for the SelectClassification component
const selectPropTypes = {
    row: PropTypes.object.isRequired,
    handleChangeClassification: PropTypes.func.isRequired,
};

// Assigning PropTypes to the component
SelectClassification.propTypes = selectPropTypes;
