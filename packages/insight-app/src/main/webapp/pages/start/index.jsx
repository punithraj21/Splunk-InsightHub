import React from "react";

import layout from "@splunk/react-page";
import ReactInsightHub from "@splunk/react-insight-hub";
import { getUserTheme } from "@splunk/splunk-utils/themes";

import { StyledContainer, StyledGreeting } from "./StartStyles";
import MainComponent from "./MainComponent";

getUserTheme()
    .then((theme) => {
        layout(
            <StyledContainer>
                <MainComponent />
            </StyledContainer>,
            {
                theme,
            }
        );
    })
    .catch((e) => {
        const errorEl = document.createElement("span");
        errorEl.innerHTML = e;
        document.body.appendChild(errorEl);
    });
