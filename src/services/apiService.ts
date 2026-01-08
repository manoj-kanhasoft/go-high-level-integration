import axios, { AxiosRequestConfig } from "axios";
import { GHL_API_VERSION, GHL_SERVICE_URL } from "../utils/constants";
import { getValidToken } from "./ghlService";
import { IToken } from "../models/Token";

// Create a base axios instance for GHL API
const ghlApiClient = axios.create({
  baseURL: GHL_SERVICE_URL,
});

// Types for API requests
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiRequestConfig {
  endpoint: string;
  method?: HttpMethod;
  data?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  locationId?: string;
  token?: IToken;
}

/**
 * Makes an authenticated request to the GHL API
 */
export const makeAuthenticatedRequest = async <T = any>({
  endpoint,
  method = "GET",
  data = null,
  params = {},
  headers = {},
  locationId,
  token,
}: Omit<ApiRequestConfig, "token"> & { token: IToken }): Promise<T> => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }
    const locId = locationId || token.locationId;

    // Don't automatically add locationId if it's already in params
    // or if the endpoint already contains a location parameter
    if (
      locId &&
      !endpoint.includes("locationId=") &&
      !endpoint.includes("location_id=") &&
      !params.locationId &&
      !params.location_id
    ) {
      // Check if endpoint already has query parameters
      const separator = endpoint.includes("?") ? "&" : "?";

      // Default to locationId parameter format unless overridden by params
      endpoint = `${endpoint}${separator}locationId=${locId}`;
    }

    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        Version: GHL_API_VERSION,
        ...headers,
      },
    };

    if (data) {
      config.data = data;
    }

    // If locationId is provided and not already in params, add it to params
    // This allows the caller to specify which parameter name to use
    if (locId && !params.locationId && !params.location_id) {
      params = { ...params };
    }

    if (Object.keys(params).length > 0) {
      config.params = params;
    }

    const response = await ghlApiClient(config);
    return response.data;
  } catch (error) {
    console.error(`Error making authenticated request to ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Makes an unauthenticated request to the GHL API
 */
export const makeRequest = async <T = any>({
  endpoint,
  method = "GET",
  data = null,
  params = {},
  headers = {},
}: Omit<ApiRequestConfig, "userId" | "locationId">): Promise<T> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      headers,
    };

    if (data) {
      config.data = data;
    }

    if (Object.keys(params).length > 0) {
      config.params = params;
    }

    const response = await ghlApiClient(config);
    return response.data;
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Makes a token request (OAuth flows)
 */
export const makeTokenRequest = async <T = any>(
  endpoint: string,
  params: URLSearchParams
): Promise<T> => {
  try {
    const response = await ghlApiClient.post(endpoint, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error making token request to ${endpoint}:`, error);
    throw error;
  }
};
