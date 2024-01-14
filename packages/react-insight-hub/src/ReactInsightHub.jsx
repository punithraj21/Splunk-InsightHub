import React, { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Heading from "@splunk/react-ui/Heading";
import Table from "@splunk/react-ui/Table";
import Paginator from "@splunk/react-ui/Paginator";
import TabBar from "@splunk/react-ui/TabBar";
import { startCase, isEmpty } from "lodash";
import Select from "@splunk/react-ui/Select";
import Card from "@splunk/react-ui/Card";
import Search from "@splunk/react-ui/Search";
import CirclesFour from "@splunk/react-icons/CirclesFour";
import Report from "@splunk/react-icons/Report";
import CylinderMagnifier from "@splunk/react-icons/CylinderMagnifier";
import TableSlide from "@splunk/react-icons/TableSlide";
import Indexes from "@splunk/react-icons/Indexes";
import ChevronsTextSmallA from "@splunk/react-icons/ChevronsTextSmallA";
import CylinderChevrons from "@splunk/react-icons/CylinderChevrons";
import FileCharts from "@splunk/react-icons/FileCharts";

import { StyledGrid } from "./ReactInsightHubStyles";

import { dropDownOptions, mainTabs, tabs } from "../../insight-app/config";
import { TableRow } from "../components/TableRow";

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
                    <Paginator onChange={handlePageChange} current={pageNum} alwaysShowLastPageLink totalPages={paging.totalPages} />
                </>
            )}
            {activeTabId === "overview" && (
                <>
                    <Heading level={1}>{name}</Heading>
                    <StyledGrid>
                        <Card>
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: "100%" }}>
                                <div>
                                    <Card.Header title="APPS"></Card.Header>
                                    <Card.Body>
                                        <p>{overviewTabData?.app || 0} APPS</p>
                                    </Card.Body>
                                </div>
                                <div style={{ color: "#53a051", fontSize: "30px" }}>
                                    <CirclesFour variant="filled" height={28} width={28} />
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: "100%" }}>
                                <div>
                                    <Card.Header title="Dashboards"></Card.Header>
                                    <Card.Body>
                                        <p>{overviewTabData?.dashboard || 0} Dashboards</p>
                                    </Card.Body>
                                </div>
                                <div style={{ color: "#53a051" }}>
                                    <FileCharts height={28} width={28} variant="filled" />
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: "100%" }}>
                                <div>
                                    <Card.Header title="Reports"></Card.Header>
                                    <Card.Body>
                                        <p>{overviewTabData?.report || 0} Reports</p>
                                    </Card.Body>
                                </div>
                                <div style={{ color: "#53a051" }}>
                                    <Report height={28} width={28} variant="filled" />
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: "100%" }}>
                                <div>
                                    <Card.Header title="Searches"></Card.Header>
                                    <Card.Body>
                                        <p>{overviewTabData?.searches || 0} Searches</p>
                                    </Card.Body>
                                </div>
                                <div style={{ color: "#53a051" }}>
                                    <CylinderMagnifier height={28} width={28} variant="filled" />
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: "100%" }}>
                                <div>
                                    <Card.Header title="Lookups"></Card.Header>
                                    <Card.Body>
                                        <p>{overviewTabData?.lookup || 0} Lookups</p>
                                    </Card.Body>
                                </div>
                                <div style={{ color: "#53a051" }}>
                                    <TableSlide height={28} width={28} variant="filled" />
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: "100%" }}>
                                <div>
                                    <Card.Header title="Indexes"></Card.Header>
                                    <Card.Body>
                                        <p>{overviewTabData?.index || 0} Indexes</p>
                                    </Card.Body>
                                </div>
                                <div style={{ color: "#53a051" }}>
                                    <Indexes height={28} width={28} variant="filled" />
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: "100%" }}>
                                <div>
                                    <Card.Header title="Unique Fields"></Card.Header>
                                    <Card.Body>
                                        <p>{overviewTabData?.field || 0} Unique Fields</p>
                                    </Card.Body>
                                </div>
                                <div style={{ color: "#53a051" }}>
                                    <ChevronsTextSmallA height={28} width={28} />
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: "100%" }}>
                                <div>
                                    <Card.Header title="Metas" style={{ flexDirection: "column-reverse" }}></Card.Header>
                                    <Card.Body>
                                        <p>{overviewTabData?.meta || 0} Meta</p>
                                    </Card.Body>
                                </div>
                                <div style={{ color: "#53a051" }}>
                                    <CylinderChevrons height={28} width={28} variant="filled" />
                                </div>
                            </div>
                        </Card>
                    </StyledGrid>
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
