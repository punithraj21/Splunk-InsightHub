import React, { useCallback, useState } from "react";
import { debounce, startCase } from "lodash";
import Table from "@splunk/react-ui/Table";
import PropTypes from "prop-types";
import Text from "@splunk/react-ui/Text";

import { SelectClassification } from "./SelectClassification";

// TableRow component for rendering each row of the table
export const TableRow = ({ index, paging, row, handleAddNewMetaLabel, handleChangeClassification }) => {
    // State to manage the value of the meta label input
    const [localInputValue, setLocalInputValue] = useState(row?.metaLabel?.join(", ") || "");

    // Debounced function for handling input changes (to minimize frequent calls)
    const debouncedUpdate = useCallback(
        debounce((value, id) => {
            // Calling the handleAddNewMetaLabel function passed as a prop
            handleAddNewMetaLabel(value, id);
        }, 1000),
        []
    );

    // Function to handle changes in the meta label input
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        // Updating local state and debouncing the external update
        setLocalInputValue(newValue);
        debouncedUpdate(newValue, row._id);
    };

    return (
        <Table.Row key={row.id}>
            <Table.Cell>{(paging.currentPage - 1) * 30 + index + 1}</Table.Cell>
            <Table.Cell>
                <a href={row.id}>{row.name}</a>
            </Table.Cell>
            <Table.Cell
                style={{
                    maxWidth: "300px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {row?.content?.description || row?.description}
            </Table.Cell>
            <Table.Cell>{startCase(row.type)}</Table.Cell>
            <Table.Cell>{row.author}</Table.Cell>
            <Table.Cell>
                <div>
                    <Text
                        style={{ display: "flex", justifyContent: "center" }}
                        type="text"
                        value={localInputValue}
                        placeholder="Add custom labels"
                        onChange={handleInputChange}
                    />
                </div>
            </Table.Cell>
            <Table.Cell>
                <SelectClassification row={row} handleChangeClassification={handleChangeClassification} />
            </Table.Cell>
            <Table.Cell>{row.content?.actions}</Table.Cell>
        </Table.Row>
    );
};

// PropTypes for the TableRow component
TableRow.propTypes = {
    row: PropTypes.object.isRequired,
    handleAddNewMetaLabel: PropTypes.func.isRequired,
};
