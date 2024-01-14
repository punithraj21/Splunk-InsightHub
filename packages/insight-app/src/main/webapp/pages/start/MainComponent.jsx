import React, { useEffect, useState } from "react";
import { debounce, isEmpty, map, startCase } from "lodash";
import ReactInsightHub from "@splunk/react-insight-hub/src/ReactInsightHub";

import LoginPage from "./Login";
import { SERVER_URL, tabs } from "../../../../../config";

const MainComponent = () => {
    // State hooks for managing various pieces of data
    const [indexes, setIndexes] = useState([]);
    const [paging, setPaging] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedTabId, setSelectedTabId] = useState("overview");
    const [knowledgeObjectSelectedSubTab, setKnowledgeObjectsSelectedSubTab] = useState("allKnowledgeObjects");
    const [overviewTabData, setOverviewTabData] = useState({});
    const [searchText, setSearchText] = useState("");
    const [searchOptions, setSearchOptions] = useState([]);
    const [storeSearchValue, setStoreSearchValue] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username] = useState(localStorage.getItem("user") || "");

    // Debounced function to handle adding new meta labels
    const handleAddNewMetaLabel = debounce(async (customMetaLabels, id) => {
        // Guard clause to exit if labels are empty
        if (isEmpty(customMetaLabels)) {
            return;
        }
        // Processing and posting the meta labels
        const labelsArray = customMetaLabels.split(",").map((label) => label.trim());

        const requestOptions = {
            method: "POST",
            body: JSON.stringify({
                metaLabel: labelsArray,
                id,
                username,
            }),
            credentials: "include",
            redirect: "follow",
        };
        await fetch(`${SERVER_URL}/updateMetaLabel`, requestOptions);
    }, 2000);

    // Function to handle change in classification
    const handleChangeClassification = (classificationTypes, id) => {
        // Guard clause to exit if classification types are empty
        if (isEmpty(classificationTypes)) {
            return;
        }
        // Function to update classification
        const updateClassification = async () => {
            const requestOptions = {
                method: "POST",
                body: JSON.stringify({
                    classification: classificationTypes,
                    id,
                    username,
                }),
                credentials: "include",
                redirect: "follow",
            };
            await fetch(`${SERVER_URL}/updateClassification`, requestOptions);
        };
        updateClassification();
        console.log(classificationTypes, id);
    };
    // Effect hook to handle storing search values
    useEffect(() => {
        // Function to store the search value
        const storeSearch = async () => {
            try {
                if (isEmpty(storeSearchValue)) {
                    return;
                }
                const requestOptions = {
                    method: "POST",
                    body: JSON.stringify({
                        searchTerm: storeSearchValue,
                        username,
                    }),
                    credentials: "include",
                    redirect: "follow",
                };

                await fetch(`${SERVER_URL}/storeSearches`, requestOptions);
            } catch (error) {
                console.log(error);
            }
        };
        storeSearch();
    }, [storeSearchValue, username]);

    // Effect hook to fetch data based on various state changes
    useEffect(() => {
        // Functions to fetch search results, overview data, and indexes
        const FetchSearchResult = async () => {
            map(tabs, (tabsData) => {
                tabsData.map((tab) => {
                    if (tab === knowledgeObjectSelectedSubTab) {
                        try {
                            const requestOptions = {
                                method: "GET",
                                credentials: "include",
                                redirect: "follow",
                            };
                            fetch(
                                `${SERVER_URL}/search?type=${knowledgeObjectSelectedSubTab}&page=${
                                    currentPage + 1
                                }&query=${searchText}&username=${username}`,
                                requestOptions
                            )
                                .then((response) => response.text())
                                .then((result) => {
                                    setSearchOptions(JSON.parse(result).results.searchOptions);
                                    setIndexes(JSON.parse(result).results.data);
                                    setPaging(JSON.parse(result).results.paging);
                                })
                                .catch((error) => console.log("error", error));
                        } catch (error) {
                            console.error("Error during index retrieval/parsing", error);
                        }
                    }
                });
            });
        };

        const fetchOverview = async () => {
            try {
                const requestOptions = {
                    method: "GET",
                    credentials: "include",
                    redirect: "follow",
                };

                fetch(`${SERVER_URL}/overview?username=${username}`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        const data = JSON.parse(result).results;
                        data.map((tab) => {
                            setOverviewTabData((existing) => ({
                                ...existing,
                                [`${tab._id}`]: tab.count,
                            }));
                        });
                    })
                    .catch((error) => console.log("error", error));
            } catch (error) {
                console.error("Error during index retrieval/parsing", error);
            }
        };

        const fetchIndexes = async () => {
            map(tabs, (tabsData) => {
                tabsData.map((tab) => {
                    if (tab === knowledgeObjectSelectedSubTab) {
                        try {
                            const requestOptions = {
                                method: "GET",
                                credentials: "include",
                                redirect: "follow",
                            };

                            fetch(
                                `${SERVER_URL}/list?type=${knowledgeObjectSelectedSubTab}&page=${currentPage + 1}&username=${username}`,
                                requestOptions
                            )
                                .then((response) => response.text())
                                .then((result) => {
                                    setIndexes(JSON.parse(result).results.data);
                                    setPaging(JSON.parse(result).results.paging);
                                })
                                .catch((error) => console.log("error", error));
                        } catch (error) {
                            console.error("Error during index retrieval/parsing", error);
                        }
                    }
                });
            });
        };

        if (searchText !== "") {
            FetchSearchResult();
        } else if (selectedTabId === "overview") {
            fetchOverview();
        } else {
            fetchIndexes();
        }
    }, [currentPage, paging.perPage, selectedTabId, knowledgeObjectSelectedSubTab, searchText]);

    return (
        <>
            {!isEmpty(username) || isLoggedIn ? (
                <ReactInsightHub
                    name={startCase(selectedTabId)}
                    items={indexes}
                    paging={paging}
                    setCurrentPage={setCurrentPage}
                    setSelectedTabId={setSelectedTabId}
                    setKnowledgeObjectsSelectedSubTab={setKnowledgeObjectsSelectedSubTab}
                    handleAddNewMetaLabel={handleAddNewMetaLabel}
                    handleChangeClassification={handleChangeClassification}
                    overviewTabData={overviewTabData}
                    setSearchText={setSearchText}
                    searchOptions={searchOptions}
                    setStoreSearchValue={setStoreSearchValue}
                />
            ) : (
                <LoginPage setIsLoggedIn={setIsLoggedIn} />
            )}
        </>
    );
};

export default MainComponent;
