# SvelteCRUD

A basic CRUD application built with [SvelteKit](https://svelte.dev/) and [PocketBase](https://pocketbase.io/). The Salesforce integration is a rough proof of concept, with all interactions handled on the client-side, so it's borked for any real use case.

To configure the application, create a `.env` file in the root directory and add the following environment variables:

```env
VITE_SF_CLIENT_ID=<CONSUMER_KEY>
VITE_SF_CLIENT_SECRET=<CONSUMER_SECRET>
VITE_SF_INSTANCE_URL=<SALESFORCE_ORG_INSTANCE_URL>
VITE_SF_REDIRECT_URI=<REDIRECT_URL>
VITE_SF_SCOPE=<SCOPE>
```

Refer [Onboard](https://github.com/shresthashreejan/Onboard/).
