import Token, { IToken } from "../models/Token";
// Import OAuth config values
import {
  CLIENT_ID,
  CLIENT_SECRET,
  GHL_MARKETPLACE_URL,
  REDIRECT_URI,
  GHL_SCOPE,
} from "../utils/constants";
import { makeAuthenticatedRequest, makeTokenRequest } from "./apiService";

// Build and return the OAuth authorization URL for the user
export const getAuthorizationUrl = (): string => {
  try {
    // Construct URL with necessary query parameters
    return `${GHL_MARKETPLACE_URL}/oauth/chooselocation?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${GHL_SCOPE}`;
  } catch (error) {
    console.error("Error getting authorization URL:", error);
    throw error;
  }
};

// Exchange the authorization code for access and refresh tokens
export const exchangeCodeForToken = async (code: string): Promise<IToken> => {
  try {
    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID as string);
    params.append("client_secret", CLIENT_SECRET as string);
    params.append("code", code);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", REDIRECT_URI as string);

    // Request token details from the OAuth provider
    const response = await makeTokenRequest<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
      locationId: string;
      companyId: string;
      userId: string;
    }>("/oauth/token", params);

    const {
      access_token,
      refresh_token,
      expires_in,
      locationId,
      companyId,
      userId,
    } = response;

    // Determine token expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

    // Check if a token already exists; if so, update it
    const existingToken = await Token.findOne({ userId });
    if (existingToken) {
      existingToken.accessToken = access_token;
      existingToken.refreshToken = refresh_token;
      existingToken.expiresAt = expiresAt;
      existingToken.locationId = locationId;
      existingToken.companyId = companyId;
      await existingToken.save();
      return existingToken;
    }

    // Create a new token record if none exists
    const token = new Token({
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt,
      locationId: locationId,
      companyId: companyId,
      userId: userId,
    });

    await token.save();
    return token;
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
};

// Refresh the access token when it is expired or about to expire
export const refreshAccessToken = async (token: IToken): Promise<IToken> => {
  try {
    if (!token) {
      throw new Error("Token not found");
    }

    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID as string);
    params.append("client_secret", CLIENT_SECRET as string);
    params.append("refresh_token", token.refreshToken);
    params.append("grant_type", "refresh_token");

    // Make a request to refresh the token
    const response = await makeTokenRequest<{
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    }>("/oauth/token", params);

    const { access_token, refresh_token, expires_in } = response;

    // Set new expiration date for the token
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

    // Update token values and use previous refresh token if new one is not provided
    token.accessToken = access_token;
    token.refreshToken = refresh_token || token.refreshToken;
    token.expiresAt = expiresAt;

    await token.save();
    return token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

// Retrieve a valid token for the given user ID; refresh if it's expiring soon
export const getValidToken = async (accessToken: string): Promise<IToken> => {
  const token = await Token.findOne({ accessToken });
  if (!token) {
    throw new Error("Invalid token provided");
  }

  // Refresh token if it expires within the next 5 minutes
  const now = new Date();
  const expirationBuffer = new Date(now.getTime() + 5 * 60 * 1000); // 5-minute buffer
  if (token.expiresAt < expirationBuffer) {
    return refreshAccessToken(token);
  }

  return token;
};

// Fetch contacts with optional pagination parameters
export const fetchContacts = async (
  token: IToken,
  paginationParams?: { page?: string; limit?: string }
): Promise<any> => {
  try {
    const queryParams: Record<string, string> = {};
    if (paginationParams) {
      if (paginationParams.page) {
        queryParams.page = paginationParams.page;
      }
      if (paginationParams.limit) {
        queryParams.limit = paginationParams.limit;
      }
    }
    // Make authenticated request to contacts endpoint
    return await makeAuthenticatedRequest({
      token,
      endpoint: "/contacts",
      params: queryParams,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

// Fetch opportunities based on the token's associated location
export const fetchOpportunities = async (token: IToken): Promise<any> => {
  try {
    const locId = token.locationId;
    if (!locId) {
      throw new Error("Location ID is required");
    }
    // Request opportunities using the location id
    return await makeAuthenticatedRequest({
      token,
      endpoint: "/opportunities/search",
      params: { location_id: locId },
    });
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    throw error;
  }
};

// Fetch users data from the API
export const fetchUsers = async (token: IToken): Promise<any> => {
  try {
    // Retrieve users using the provided token
    return await makeAuthenticatedRequest({
      token,
      endpoint: "/users/",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Fetch calendar events
export const fetchCalendars = async (token: IToken): Promise<any> => {
  try {
    // Access calendar endpoint with authenticated request
    return await makeAuthenticatedRequest({
      token,
      endpoint: "/calendars/",
    });
  } catch (error) {
    console.error("Error fetching calendars:", error);
    throw error;
  }
};

// Fetch associations linked to the account
export const fetchAssociations = async (token: IToken): Promise<any> => {
  try {
    // Retrieve associations data using the token
    return await makeAuthenticatedRequest({
      token,
      endpoint: "/associations/",
    });
  } catch (error) {
    console.error("Error fetching associations:", error);
    throw error;
  }
};
