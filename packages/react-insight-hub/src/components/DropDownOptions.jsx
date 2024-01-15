import React from "react";
import PropTypes from "prop-types";
import Select from "@splunk/react-ui/Select";
import { startCase } from "lodash";

export const SelectComponent = ({ selectedValue, handleSelectedData, activeTabId, tabs, overviewTabData, paging, dropDownOptions }) => {
    return (
        <Select style={{ width: "14%" }} value={selectedValue} onChange={handleSelectedData}>
            {activeTabId === "knowledgeObjects"
                ? tabs.knowledgeObjects.map((tab, index) => (
                      <Select.Option
                          key={tab}
                          label={`${
                              index === 0 ? "" : (overviewTabData[dropDownOptions.knowledgeObjects[tab]] || paging.totalItems || 0) + " "
                          }${startCase(tab)}`}
                          value={tab}
                      />
                  ))
                : tabs.dataInventory.map((tab, index) => (
                      <Select.Option
                          key={tab}
                          label={`${
                              index === 0 ? "" : (overviewTabData[dropDownOptions.dataInventory[tab]] || paging.totalItems || 0) + " "
                          }${startCase(tab)}`}
                          value={tab}
                      />
                  ))}
        </Select>
    );
};

SelectComponent.propTypes = {
    selectedValue: PropTypes.string.isRequired,
    handleSelectedData: PropTypes.func.isRequired,
    activeTabId: PropTypes.string.isRequired,
    tabs: PropTypes.object.isRequired,
    overviewTabData: PropTypes.object.isRequired,
    paging: PropTypes.object.isRequired,
    dropDownOptions: PropTypes.object.isRequired,
};
