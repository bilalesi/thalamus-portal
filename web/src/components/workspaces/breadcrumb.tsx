
"use client";

import { SlashIcon } from "@radix-ui/react-icons"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { digitalReconstructionList, experimentalDataList, workspacesList } from "../../lib/shared";
import type { DigitalReconstructionListKeys, ExperimentalDataListKeys } from "../../lib/shared";
import { useEffect, useState } from "react";

type Location = {
    ws: Workspace;
    dash: Dashboard;
} | null;

type Workspace = "exp_data" | "dig_recons";
type Dashboard = ExperimentalDataListKeys | DigitalReconstructionListKeys;

const getWorkspace = (value?: Workspace) => value && workspacesList[value];
const getDashboard = ({ ws, value }: { ws: Workspace, value: Dashboard }) => {
    if (ws === "exp_data") return experimentalDataList[value as ExperimentalDataListKeys];
    else if (ws === "dig_recons") return digitalReconstructionList[value as DigitalReconstructionListKeys];
    else null;
}

export function BreadcrumbWithDropdown() {
    const [location, setLocation] = useState<Location>(null);

    const onLocationChange = (value: Location) => {
        if (value === null) return;
        const url = new URL(window.location.href);
        url.pathname = `/result/${value.ws}-${value.dash}`;
        window.location.replace(url);
    }

    useEffect(() => {
        const url = new URL(window.location.href);
        const ws = url.pathname.split("/").pop()?.split('-').at(0) as Workspace;
        const dash = url.pathname.split("/").pop()?.split('-').at(1) as Dashboard;
        if (ws && dash) setLocation({ ws, dash });
    }, []);


    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <DropdownMenu dir="ltr">
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{location?.ws ? getWorkspace(location?.ws) : "Workspaces"}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" align="start" className="w-56">
                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Experimental data</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            {Object.keys(experimentalDataList).map(i => (
                                                <DropdownMenuItem
                                                    key={i}
                                                    textValue={i}
                                                    onSelect={() => {
                                                        onLocationChange({ ws: "exp_data", dash: i as ExperimentalDataListKeys })
                                                    }}
                                                >
                                                    {experimentalDataList[i as ExperimentalDataListKeys]}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Digital reconstruction</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            {Object.keys(digitalReconstructionList).map((i) => (
                                                <DropdownMenuItem
                                                    onSelect={() => {
                                                        onLocationChange({ ws: "dig_recons", dash: i as DigitalReconstructionListKeys })
                                                    }}
                                                    key={i}
                                                    textValue={i}
                                                >
                                                    {digitalReconstructionList[i as DigitalReconstructionListKeys]}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </BreadcrumbItem>
                {location && location.dash && (
                    <>
                        <BreadcrumbSeparator>
                            <SlashIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage>{getDashboard({
                                ws: location.ws,
                                value: location.dash,
                            })}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
