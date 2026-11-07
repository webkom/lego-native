# Auth Client ID

To make the app work against Abakus.no's SSO service, you'll need to set up an SSO integration. Follow these steps:

1. Navigate to [abakus.no/users/me/settings/oauth2](https://abakus.no/users/me/settings/oauth2)
2. Create a new integration
3. Use `https://abakus.no/users/me/settings/oauth2` as the redirect uri
4. Note down the client id. You have to save the integration before you can view it in the dashboard.
5. Set the `EXPO_PUBLIC_AUTH_CLIENT_ID` field in the .env file to the client id you noted down.
