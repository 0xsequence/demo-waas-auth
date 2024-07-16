import {ReactNode} from "react";
import {StytchProvider} from "@stytch/react";
import {StytchHeadlessClient} from "@stytch/vanilla-js/headless";

const STYTCH_PUBLIC_TOKEN = import.meta.env.VITE_STYTCH_PUBLIC_TOKEN

export function MaybeWithStytch({ children }: { children: ReactNode }) {
  if (STYTCH_PUBLIC_TOKEN) {
    return (
      <StytchProvider stytch={new StytchHeadlessClient(STYTCH_PUBLIC_TOKEN)}>
        {children}
      </StytchProvider>
    )
  }
  return children
}
