// MongoDB connection URI from environment variables
export const MONGODB_URI = process.env.MONGODB_URI;

// URL for GHL marketplace used during OAuth authentication
export const GHL_MARKETPLACE_URL = "https://marketplace.leadconnectorhq.com";

// Base URL for GHL API services
export const GHL_SERVICE_URL = "https://services.leadconnectorhq.com";

// Scopes specifying the read permissions for various GHL resources
export const GHL_SCOPE =
  "contacts.readonly calendars.readonly associations.readonly opportunities.readonly users.readonly";

// OAuth client ID provided via environment variables
export const CLIENT_ID = process.env.GHL_CLIENT_ID;

// OAuth client secret provided via environment variables
export const CLIENT_SECRET = process.env.GHL_CLIENT_SECRET;

// Redirect URI for OAuth callbacks as set in environment variables
export const REDIRECT_URI = process.env.GHL_REDIRECT_URI;

// API version used for interacting with GHL services
export const GHL_API_VERSION = "2021-07-28";
