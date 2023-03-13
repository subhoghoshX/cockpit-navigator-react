import React from "react";
import { Flex, Spinner } from "@patternfly/react-core";

export default function NavLoader() {
    return (
        <Flex
            className="nav-loader-container"
            justifyContent={{ default: "justifyContentCenter" }}
            alignItems={{ default: "alignItemsCenter" }}
        >
            <Spinner isSVG />
        </Flex>
    );
}
