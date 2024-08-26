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

### Runtime Configuration Overrides

The application configuration can be overridden at run time using url params. This is useful for testing different configurations without having to change the `.env` file.

#### Project Access Key

The Sequence Project Access Key can be set in run time using url param.

Example:
```
https://0xsequence.github.io/demo-waas-auth/?projectAccessKey=XYZ#/
```

#### WaaS Config Key

The Sequence WaaS Config Key can also be set in run time using url param.

Example:
```
https://0xsequence.github.io/demo-waas-auth/?waasConfig=XYZ#/
```

#### Preset

The preset that determines the environment can also be set in run time using url param. The configuration is a base64 encoded json string.

Example:
```
{
  "rpcServer": "http://localhost:9123",
  "kmsRegion": "us-east-2",
  "idpRegion": "us-east-2",
  "keyId": "arn:aws:kms:us-east-1:000000000000:key/aeb99e0f-9e89-44de-a084-e1817af47778",
  "emailRegion": "us-east-2",
  "endpoint": "http://localstack:4566"
}

https://0xsequence.github.io/demo-waas-auth/?extendedConfig=ewogICJycGNTZXJ2ZXIiOiAiaHR0cDovL2xvY2FsaG9zdDo5MTIzIiwKICAia21zUmVnaW9uIjogInVzLWVhc3QtMiIsCiAgImlkcFJlZ2lvbiI6ICJ1cy1lYXN0LTIiLAogICJrZXlJZCI6ICJhcm46YXdzOmttczp1cy1lYXN0LTE6MDAwMDAwMDAwMDAwOmtleS9hZWI5OWUwZi05ZTg5LTQ0ZGUtYTA4NC1lMTgxN2FmNDc3NzgiLAogICJlbWFpbFJlZ2lvbiI6ICJ1cy1lYXN0LTIiLAogICJlbmRwb2ludCI6ICJodHRwOi8vbG9jYWxzdGFjazo0NTY2Igp9
```

## Documentation
Access detailed information about Sequence WaaS in the [Sequence WaaS Documentation](https://docs.sequence.xyz/waas/waas-auth/getting-started). Note that this documentation is subject to change and currently available only through this link.

## Current Limitations
- The demo currently supports only social logins for transaction activities. The email login is present but does not support transaction functionalities at this stage.
- Sign in with Apple requires running the server in host mode at port 443. The app must then be accessed from a domain that's not localhost, e.g. https://localhost.direct.

---

This demo is intended for development and demonstration purposes. Replace the API keys with your own for any production use.
