"use client";

import { Drawer } from 'vaul';
import { DownloadIcon } from "lucide-react";
import { actions } from 'astro:actions';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import type { Distribution, Resource } from '@/lib/shared';
import { ensureArray } from '@/lib/utils';
import { useState } from 'react';


function bytesToMB(bytes: number) {
    const MB = 1024 * 1024;  // 1 MB = 1024 * 1024 bytes
    return (bytes / MB).toFixed(2);  // Convert to MB and round to 2 decimal places
}

function Artifacts({ self, distributions }: { self: string; distributions: Array<Distribution> }) {
    const [errorDownloading, setErrorDownloading] = useState<"not-found" | "error" | null>(null);
    const distributionsList = ensureArray(distributions);
    const onDownload = async ({ self, url }: { self: string; url: string }) => {
        setErrorDownloading(null);
        const { data, error } = await actions.getArtifacts({ self, url })
        if (!error && data?.binary) {
            const blob = new Blob([data.binary], { type: data.type! });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = data.name!;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
        if (!data) {
            setErrorDownloading("not-found");
            setTimeout(() => setErrorDownloading(null), 3000);
        }
        else if (error) {
            setErrorDownloading("error");
            setTimeout(() => setErrorDownloading(null), 3000);
        }
    }
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="text-right">...</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {distributionsList.map((distr) => (
                        <TableRow key={distr.contentUrl}>
                            <TableCell className="font-medium">{distr.name}</TableCell>
                            <TableCell>{distr.encodingFormat}</TableCell>
                            <TableCell>{bytesToMB(distr.contentSize.value)} mb</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="icon" onClick={() => {
                                    onDownload({
                                        self,
                                        url: distr.contentUrl,
                                    });
                                }}>
                                    <DownloadIcon className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">{distributionsList.length}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            {errorDownloading === "error" && <div className='text-red-600 font-light ml-2 w-full'>Error while trying to download the artifact</div>}
            {errorDownloading === "not-found" && <div className='text-red-600 font-light ml-2 w-full'>Artifact not found, please contact the portal administrator</div>}
        </>
    )
}

export function ResourceViewer(
    { open, resource, onClose }:
        { open: boolean; resource: Resource | null; onClose: () => void }
) {
    if (!resource) return null;
    return (
        <Drawer.Root
            direction="right"
            modal
            open={open}
            onClose={onClose}
        >
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content
                    className="right-2 top-2 bottom-2 fixed z-10 outline-none max-w-3xl w-full flex"
                    style={{ '--initial-transform': 'calc(100% + 8px)' } as React.CSSProperties}
                >
                    <div className="bg-zinc-50 h-full w-full grow p-5 flex flex-col rounded-[2px]  overflow-scroll">
                        <Drawer.Title className="p-4 pb-0 font-medium mb-2 text-zinc-900">{resource?.["name"]}</Drawer.Title>
                        <Drawer.Description className="text-zinc-600 mb-2">
                            <Accordion type="single" collapsible className="w-full" defaultValue="resource">
                                {resource && resource["distribution"] && <AccordionItem value="artifacts">
                                    <AccordionTrigger>Artifacts</AccordionTrigger>
                                    <AccordionContent>
                                        <Artifacts
                                            self={resource["_self"]}
                                            distributions={resource["distribution"]}
                                        />
                                    </AccordionContent>
                                </AccordionItem>}
                                <AccordionItem value="resource">
                                    <AccordionTrigger>Resource</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-4 pb-0">
                                            <JsonView
                                                src={resource}
                                                collapsed={1}
                                                displaySize={3}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                        </Drawer.Description>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
