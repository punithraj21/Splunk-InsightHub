import React from "react";
import PropTypes from "prop-types";
import Search from "@splunk/react-ui/Search";

const SearchComponent = ({ searchValue, isLoading, handleSearchChange, searchOptions, setStoreSearchValue }) => {
    // Function to generate search options
    const generateOptions = () => {
        if (isLoading) {
            return null;
        }

        return searchOptions.map((option, index) => (
            <Search.Option value={option.snippet} key={index} onClick={() => setStoreSearchValue(option.snippet)} />
        ));
    };

    // Generated search options
    const searchOption = generateOptions();

    return (
        <Search
            value={searchValue}
            inline
            onChange={handleSearchChange}
            isLoadingOptions={isLoading}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setStoreSearchValue(searchValue);
                }
            }}
            style={{ width: "80%" }}
        >
            {searchOption}
        </Search>
    );
};

SearchComponent.propTypes = {
    searchValue: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    handleSearchChange: PropTypes.func.isRequired,
    searchOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    setStoreSearchValue: PropTypes.func.isRequired,
};

export default SearchComponent;
