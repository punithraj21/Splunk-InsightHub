import styled from "styled-components";
import { variables, mixins } from "@splunk/themes";

const StyledContainer = styled.div`
    ${mixins.reset("inline-block")};
    font-size: ${variables.fontSizeLarge};
    line-height: 200%;
    margin: ${variables.spacing} ${variables.spacingHalf};
    padding: ${variables.spacing} calc(${variables.spacing} * 2);
    border-radius: ${variables.borderRadius};
    box-shadow: ${variables.overlayShadow};
    background-color: ${variables.backgroundColor};
`;

const StyledText = styled.div`
    margin-right: ${variables.spacingHalf};
    margin-left: ${variables.spacingHalf};
`;

const StyledGreeting = styled.div`
    font-weight: bold;
    color: ${variables.brandColor};
    font-size: ${variables.fontSizeXXLarge};
`;

const StyledGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 20px;
`;

export { StyledContainer, StyledGreeting, StyledText, StyledGrid };
