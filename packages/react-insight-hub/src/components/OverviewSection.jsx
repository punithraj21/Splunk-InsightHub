import React from "react";
import PropTypes from "prop-types";
import Heading from "@splunk/react-ui/Heading";
import Card from "@splunk/react-ui/Card";
import CirclesFour from "@splunk/react-icons/CirclesFour";
import Report from "@splunk/react-icons/Report";
import CylinderMagnifier from "@splunk/react-icons/CylinderMagnifier";
import TableSlide from "@splunk/react-icons/TableSlide";
import Indexes from "@splunk/react-icons/Indexes";
import ChevronsTextSmallA from "@splunk/react-icons/ChevronsTextSmallA";
import CylinderChevrons from "@splunk/react-icons/CylinderChevrons";
import FileCharts from "@splunk/react-icons/FileCharts";

import { StyledGrid } from "../ReactInsightHubStyles";

const OverviewSection = ({ name, overviewTabData }) => {
    return (
        <>
            {/* <Heading level={1}>{name}</Heading> */}
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
    );
};

OverviewSection.propTypes = {
    name: PropTypes.string,
    overviewTabData: PropTypes.object.isRequired,
};

export default OverviewSection;
