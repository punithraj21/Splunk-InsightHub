import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Table from "@splunk/react-ui/Table";
import Paginator from "@splunk/react-ui/Paginator";
import TabBar from "@splunk/react-ui/TabBar";
import { isEmpty, startCase } from "lodash";
import Select from "@splunk/react-ui/Select";
import Search from "@splunk/react-ui/Search";

import { dropDownOptions, mainTabs, tabs } from "../../insight-app/config";
import { TableRow } from "./components/TableRow";
import OverviewSection from "./components/OverviewSection";

// Main component for displaying insights and data management
const ReactInsightHub = ({
    name = "User",
    items = [],
    paging,
    setCurrentPage,
    setSelectedTabId,
    setKnowledgeObjectsSelectedSubTab,
    handleAddNewMetaLabel,
    handleChangeClassification,
    overviewTabData,
    setSearchText,
    searchOptions,
    setStoreSearchValue,
}) => {
    // State hooks for managing various aspects of the component
    const [pageNum, setPageNum] = useState(1);
    const [activeTabId, setActiveTabId] = useState(mainTabs[0]);

    const [selectedValue, setSelectedValue] = useState(activeTabId === "dataInventory" ? "allDataInventory" : "allKnowledgeObjects");
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [searchVale, setSearchVale] = useState("");

    // Function to handle fetching of data based on search value
    const handleFetch = (searchValue = "") => {
        setSearchVale(searchValue);
        setSearchText(searchValue);
        setIsLoading(true);
        setOptions(searchOptions);
        setIsLoading(false);
    };

    // Effect hook to update options when searchOptions change
    useEffect(() => {
        setOptions(searchOptions);
    }, [searchOptions]);

    // Function to generate search options
    const generateOptions = () => {
        if (isLoading) {
            return null;
        }

        return options.map((option, index) => (
            <Search.Option
                value={option.snippet}
                key={index}
                onClick={() => {
                    setStoreSearchValue(option.snippet);
                }}
            />
        ));
    };

    // Generated search options
    const searchOption = generateOptions();

    // Function to handle selected data from dropdown
    const handleSelectedData = (e, { value }) => {
        setSelectedValue(value);
    };

    // Effect hook to handle active tab change for dataInventory
    useEffect(() => {
        if (activeTabId === "dataInventory") {
            setSelectedValue("allDataInventory");
        } else if (activeTabId === "knowledgeObjects") {
            setSelectedValue("allKnowledgeObjects");
        } else {
            setSelectedValue("overview");
        }
    }, [activeTabId]);

    // Effect hook to set active tab based on URL parameter
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tabIdFromUrl = params.get("tab");
        if (mainTabs.includes(tabIdFromUrl)) {
            setActiveTabId(tabIdFromUrl);
            setSelectedTabId(tabIdFromUrl);
        }
    }, [setSelectedTabId, mainTabs]);

    // Effect hook to set selected sub tab for knowledge objects
    useEffect(() => {
        setKnowledgeObjectsSelectedSubTab(selectedValue);
    }, [selectedValue, setKnowledgeObjectsSelectedSubTab]);

    // Callback for handling tab change
    const handleTabChange = useCallback(
        (e, { selectedTabId }) => {
            setActiveTabId(selectedTabId);
            setSelectedTabId(selectedTabId);
            const params = new URLSearchParams(window.location.search);
            params.set("tab", selectedTabId);
            window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
        },
        [setSelectedTabId]
    );

    // Callback for handling page change
    const handlePageChange = useCallback(
        (event, { page }) => {
            setPageNum(page);
            setCurrentPage(page - 1);
        },
        [setCurrentPage]
    );

    // Effect hook to reset current page and set selected tab when activeTabId changes
    useEffect(() => {
        setCurrentPage(0);
        setSelectedTabId(activeTabId);
    }, [activeTabId, setCurrentPage, setSelectedTabId]);

    // Function to handle search changes
    const handleSearchChange = (e, { value: searchValue }) => {
        if (e.key === "Enter") {
            setStoreSearchValue(searchValue);
        }
        handleFetch(searchValue);
    };

    return (
        <>
            <TabBar activeTabId={activeTabId} onChange={handleTabChange}>
                {mainTabs.map((tabMain) => (
                    <TabBar.Tab key={tabMain} label={startCase(tabMain)} tabId={tabMain} />
                ))}
            </TabBar>
            {(activeTabId === "knowledgeObjects" || activeTabId === "dataInventory") && (
                <>
                    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                        <Search
                            value={searchVale}
                            inline
                            onChange={handleSearchChange}
                            isLoadingOptions={isLoading}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setStoreSearchValue(searchVale);
                                }
                            }}
                            style={{ width: "80%" }}
                        >
                            {searchOption}
                        </Search>
                        <Select value={selectedValue} onChange={(e, { value }) => handleSelectedData(e, { value })}>
                            {activeTabId === "knowledgeObjects"
                                ? tabs.knowledgeObjects.map((tab, index) => (
                                      <Select.Option
                                          key={tab}
                                          label={`${
                                              index === 0
                                                  ? ""
                                                  : (overviewTabData[dropDownOptions.knowledgeObjects[tab]] || paging.totalItems || 0) + " "
                                          } ${startCase(tab)}`}
                                          value={tab}
                                      />
                                  ))
                                : tabs.dataInventory.map((tab, index) => (
                                      <Select.Option
                                          key={tab}
                                          label={`${
                                              index === 0 ? "" : (overviewTabData[dropDownOptions.dataInventory[tab]] || paging.totalItems || 0) + " "
                                          } ${startCase(tab)}`}
                                          value={tab}
                                      />
                                  ))}
                        </Select>
                    </div>
                    <Table stripeRows>
                        <Table.Head>
                            <Table.HeadCell>Id</Table.HeadCell>
                            <Table.HeadCell>Name</Table.HeadCell>
                            <Table.HeadCell>Description</Table.HeadCell>
                            <Table.HeadCell>Type</Table.HeadCell>
                            <Table.HeadCell>Owner</Table.HeadCell>
                            <Table.HeadCell>Meta Label</Table.HeadCell>
                            <Table.HeadCell>Classification</Table.HeadCell>
                            <Table.HeadCell>Actions</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {items.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    index={index}
                                    handleAddNewMetaLabel={handleAddNewMetaLabel}
                                    handleChangeClassification={handleChangeClassification}
                                    paging={paging}
                                    row={row}
                                />
                            ))}
                        </Table.Body>
                    </Table>
                    {!isEmpty(items) && (
                        <Paginator onChange={handlePageChange} current={pageNum} alwaysShowLastPageLink totalPages={paging.totalPages} />
                    )}
                </>
            )}
            {activeTabId === "overview" && (
                <>
                    <OverviewSection name={name} overviewTabData={overviewTabData} />
                </>
            )}
        </>
    );
};

// PropTypes for ReactInsightHub
const propTypes = {
    name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    paging: PropTypes.object.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    setSelectedTabId: PropTypes.func.isRequired,
    setKnowledgeObjectsSelectedSubTab: PropTypes.func.isRequired,
    handleAddNewMetaLabel: PropTypes.func.isRequired,
    handleChangeClassification: PropTypes.func.isRequired,
    overviewTabData: PropTypes.object.isRequired,
    setSearchText: PropTypes.func.isRequired,
    searchOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    setStoreSearchValue: PropTypes.func.isRequired,
};

ReactInsightHub.propTypes = propTypes;

export default ReactInsightHub;
