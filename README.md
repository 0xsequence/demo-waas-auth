# Sequence WaaS Integration Demo

This project demonstrates the integration of Sequence Wallet as a Service (WaaS) using the `@0xsequence/waas` typescript SDK.

Sequence WaaS simplifies wallet functionalities for users and devs, eliminating the need for extensions or popups, whili efficiently managing user authentication, transaction processing, and message signing.

## Getting Started

### Installation
Install the project dependencies with:
```
pnpm install
```

### Launching the Demo
Start the development server using:
```
pnpm dev
```

If you want to use Sign in with Apple you must run the server using:
```
pnpm dev --host --port=443
```

Then you must access it at https://localhost.direct instead of "real" localhost. This is an Apple ID security limitation.

## Configuration
### Environment Setup
Customize the application by setting `GOOGLE_CLIENT_ID`, `APPLE_CLIENT_ID` and `SEQUENCE_API_KEY` in the `.env` file. The project includes sample API keys for initial local testing.

Setting either `GOOGLE_CLIENT_ID` or `APPLE_CLIENT_ID` will disable that social identity provider.

### Fallback to Sample Configuration
If configurations in the `.env` file are missing, the project automatically uses the sample configuration.

## Documentation
Access detailed information about Sequence WaaS in the [Sequence WaaS Documentation](https://docs.sequence.xyz/waas/waas-auth/getting-started). Note that this documentation is subject to change and currently available only through this link.

## Current Limitations
- The demo currently supports only social logins for transaction activities. The email login is present but does not support transaction functionalities at this stage.
- Sign in with Apple requires running the server in host mode at port 443. The app must then be accessed from a domain that's not localhost, e.g. https://localhost.direct.

---

This demo is intended for development and demonstration purposes. Replace the API keys with your own for any production use.
