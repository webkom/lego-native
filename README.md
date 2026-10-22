# lego-native

> Open source mobile app for Abakus.

[![Build Status](https://ci.webkom.dev/api/badges/webkom/lego-native/status.svg)](https://ci.webkom.dev/webkom/lego-native)

> **Issues**:

[![open issues](https://badgen.net/github/open-issues/webkom/lego-native)](https://github.com/webkom/lego-native/issues)

## Prerequisites

- Node.js
- npm
- Expo account with access to the `webkom` organization

## Install dependencies

```bash
npm install
```

## Build and install the development client

Log in to Expo:

```bash
npx eas-cli login
```

Build the development client:

```bash
# Android
npx eas-cli build --platform android --profile development

# iOS
npx eas-cli build --platform ios --profile development
```

Once the build has completed (typically within 10–15 minutes), open the EAS build page, download the development build, and install it on your device.

> **Note:** A new development build is only required after native changes, such as:
>
> - adding or updating native dependencies
> - changing the Expo configuration
> - updating Firebase configuration
> - upgrading the Expo SDK

## Start the development server

**Note:** To run the development server you must have a development build. It requires the Android Studio SDK (and probably something else for iOS). To create a development build,
start the development build with

```bash
npx expo run:android
```

The next time you wish to start the app, run this command instead:

```bash
npx expo start
```

**Note:** If you introduce native-level configuration changes, you need to create a new development build with one of these:

```bash
npx expo prebuild --clean
npx expo run:android
```

Then you can continue using `npx expo start` as before.

With the development build installed, open the app on your device and connect to the local Metro server.

## Development

We use some conventions and tools for our development.

- [prettier](https://github.com/prettier/prettier) and [eslint](https://eslint.org/) for formatting and linting.
  - `npm run lint`
  - `npm run format`
- [TypeScript](https://www.typescriptlang.org) for type checking.
  - `npm run typecheck`

When you open a pull request, CI will automatically run these checks.

## CI/CD

We use [Drone](https://drone.io) as our CI/CD system. The server runs at https://ci.webkom.dev.

Since we use secrets in the pipeline, the pipeline config must be signed. Use the [cli](https://docs.drone.io/cli):

```sh
drone sign webkom/abakus-app --save
```

Get your login data from your [user settings](https://ci.webkom.dev/account). Re-run this command any time `.drone.yml` changes.
