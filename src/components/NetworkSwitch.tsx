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
import { useEffect, useState } from "react";
import { sequence } from "../main.tsx";
import { NetworkList, Network } from "@0xsequence/waas";

export function NetworkSwitch(props: {onNetworkChange: (network: Network) => void}) {
    const [network, setNetwork] = useState<undefined | Network>()
    const [networkList, setNetworkList] = useState<NetworkList>([])

    useEffect(() => {
        sequence.networkList().then((networks: NetworkList) => {
            setNetworkList(networks)
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
                    {networkList.map((o: Network) => {
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
