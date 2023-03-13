/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

import cockpit from "cockpit";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Flex, FlexItem, Text } from "@patternfly/react-core";
import { FolderIcon, FileIcon, ArrowUpIcon, SyncIcon } from "@patternfly/react-icons";
import NavLoader from "./components/NavLoader.jsx";

export function Application() {
    const [pathStack, setPathStack] = useState([]);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const refresh = useCallback(
        async function () {
            setIsLoading(true);
            const path = pathStack.length === 0 ? "/" : "/" + pathStack.join("/");

            const res = await cockpit.spawn(["/usr/share/cockpit/navigator/scripts/ls.py3", path], {
                err: "out",
                superuser: "try",
            });

            const data = JSON.parse(res);

            setEntries(data.children);
            setIsLoading(false);
        },
        [pathStack]
    );

    useEffect(() => {
        refresh();
    }, [refresh]);

    function updatePackStack(entry) {
        setPathStack((pathStack) => [...pathStack, entry]);
    }

    return (
        <Flex direction={{ default: "column" }} flexWrap={{ default: "nowrap" }} className="outer-container">
            {isLoading && <NavLoader />}
            <FlexItem>
                <Flex>
                    <Button
                        variant="tertiary"
                        title="Up"
                        onClick={() => setPathStack((pathStack) => pathStack.slice(0, -1))}
                        isDisabled={pathStack.length === 0}
                    >
                        <ArrowUpIcon />
                    </Button>
                    <Button variant="tertiary" title="Refresh" onClick={refresh}>
                        <SyncIcon />
                    </Button>
                    <FlexItem grow={{ default: "grow" }}>
                        <input
                            value={pathStack.length === 0 ? "/" : "/" + pathStack.join("/")}
                            type="text"
                            className="navigation-bar"
                            onChange={() => {}}
                        />
                    </FlexItem>
                </Flex>
            </FlexItem>

            <FlexItem className="inner-container" grow={{ default: "grow" }}>
                <Flex>
                    {entries.map((entry, i) => (
                        <FlexItem className="nav-item" key={i} onDoubleClick={() => updatePackStack(entry.filename)}>
                            {entry.isdir ? <FolderIcon height={80} width={80} /> : <FileIcon height={80} width={80} />}
                            <Text>{entry.filename}</Text>
                        </FlexItem>
                    ))}
                </Flex>
            </FlexItem>
        </Flex>
    );
}
