"use client";
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dropdown-menu"
import { digitalReconstructionList, experimentalDataList, type DigitalReconstructionListKeys, type ExperimentalDataListKeys } from "../../lib/shared";

export function Workspaces() {
    return (
        <DropdownMenu dir="ltr">
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Workspaces</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-56">
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Experimental data</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                {Object.keys(experimentalDataList).map(i => (
                                    <DropdownMenuItem textValue={i} key={i}>{experimentalDataList[i as ExperimentalDataListKeys]}</DropdownMenuItem>
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
                                {Object.keys(digitalReconstructionList).map(i => (
                                    <DropdownMenuItem textValue={i} key={i}>{digitalReconstructionList[i as DigitalReconstructionListKeys]}</DropdownMenuItem>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
