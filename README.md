# Sequence Embedded Wallet Integration Demo

This project demonstrates the integration of Sequence Embedded Wallet using the `@0xsequence/waas` typescript SDK.

Sequence Embedded Wallet simplifies wallet functionalities for users and devs, eliminating the need for extensions or popups, while efficiently managing user authentication, transaction processing, and message signing.

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
Customize the application by setting `VITE_GOOGLE_CLIENT_ID`, `VITE_APPLE_CLIENT_ID` and `VITE_SEQUENCE_PROJECT_ACCESS_KEY` in the `.env` file. The project includes sample API keys for initial local testing.

## Documentation
Access detailed information about Sequence Embedded Wallets in the [Sequence Embedded Wallet Documentation](https://docs.sequence.xyz/solutions/wallets/embedded-wallet/quickstart/). Note that this documentation is subject to change and currently available only through this link.

## Limitations
- Sign in with Apple requires running the server in host mode at port 443. The app must then be accessed from a domain that's not localhost, e.g. https://localhost.direct.

---

This demo is intended for development and demonstration purposes. Replace the API keys with your own for any production use.
