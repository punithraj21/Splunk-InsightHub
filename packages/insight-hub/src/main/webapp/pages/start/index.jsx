import React from 'react';

import layout from '@splunk/react-page';
import ReactInsightHub from '@splunk/react-insight-hub';
import { getUserTheme } from '@splunk/splunk-utils/themes';

import { StyledContainer, StyledGreeting } from './StartStyles';

getUserTheme()
    .then((theme) => {
        layout(
            <StyledContainer>
                <StyledGreeting>Hello, from inside InsightHub!</StyledGreeting>
                <div>Your component will appear below.</div>
                <ReactInsightHub name="from inside ReactInsightHub" />
            </StyledContainer>,
            {
                theme,
            }
        );
    })
    .catch((e) => {
        const errorEl = document.createElement('span');
        errorEl.innerHTML = e;
        document.body.appendChild(errorEl);
    });
