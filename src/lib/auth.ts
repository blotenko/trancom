import { createAuth0Client, Auth0Client } from "@auth0/auth0-spa-js";

let auth0Client: Auth0Client;

export const initAuth0 = async (): Promise<Auth0Client> => {
  auth0Client = await createAuth0Client({
    domain: import.meta.env.VITE_AUTH0_DOMAIN || "your-domain.auth0.com",
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || "your-client-id",
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE || "https://logiflow.app/api",
    },
  });

  return auth0Client;
};

export const getAuth0Client = (): Auth0Client => {
  if (!auth0Client) {
    throw new Error("Auth0 client not initialized");
  }
  return auth0Client;
};

export const getToken = async (): Promise<string | undefined> => {
  try {
    const client = getAuth0Client();
    return await client.getTokenSilently();
  } catch (error) {
    console.error("Error getting token:", error);
    return undefined;
  }
};
