import {
    Box,
    Button,
    DropdownMenuContent,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuRoot,
    DropdownMenuTrigger,
} from "@0xsequence/design-system";
import { Chain } from "../App.tsx";
import { useEffect, useState } from "react";
import { sequence } from "../main.tsx";
import { ChainListReturn } from "../../../sequence.js/packages/waas/src/clients/authenticator.gen.ts";

export function NetworkSwitch(props: {onNetworkChange: (network: Chain) => void}) {
    const [network, setNetwork] = useState(undefined as unknown as Chain)
    const [networkList, setNetworkList] = useState<Chain[]>([])

    useEffect(() => {
        sequence.chainList().then((chainsReturn: ChainListReturn) => {
            setNetworkList(chainsReturn.chains)
        })
    }, []);

    useEffect(() => {
        if (network === undefined && networkList.length > 0) {
            setNetwork(networkList[0])
        }
    }, [networkList, network]);

    return <DropdownMenuRoot>

        <DropdownMenuTrigger asChild>
           <Button
                label={network !== undefined ? network.name : 'Select network'}
                size={'xs'}
            />
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
            <DropdownMenuContent style={{ zIndex: 9999 }}>
                <DropdownMenuRadioGroup>
                    {networkList.map(o => {
                        return (
                            <DropdownMenuRadioItem
                                key={o.name}
                                value={o.name}
                                disabled={false}
                                onSelect={() => {
                                    setNetwork(o)
                                    props.onNetworkChange(o)
                                }}
                            >
                                <Box alignItems="center" gap="1" width="full">
                                    {o.name}
                                </Box>
                            </DropdownMenuRadioItem>
                        )
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
}
