# GHL Integration API

Node.js, Express, MongoDB and API integration with Go High Level (GHL) services.

## Table of Contents
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [API Endpoints](#api-endpoints-1)
- [Testing the API](#testing-the-api)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Go High Level API credentials

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GoHighLevel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a .env file**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ghl-integration
   GHL_CLIENT_ID=your_ghl_client_id
   GHL_CLIENT_SECRET=your_ghl_client_secret
   GHL_REDIRECT_URI=http://localhost:3000/auth/callback
   ```
   .env.example file is added for reference

4. **Start the server**

  For development with auto-restart:
   ```bash
   npm run dev
   ```

   For the production version:
   ```bash
   npm run build
   ```
   ```bash
   npm run start
   ```

5. **Verify the server is running**
   Open your browser and navigate to `http://localhost:3000`. You should see the message "GHL Integration API is running".

## API Endpoints

### Authentication Endpoints

These endpoints handle authentication with the Go High Level API.

#### 1. Initiate OAuth Flow
- **Endpoint**: `GET /auth/authorize`
- **Description**: Redirects to GHL authorization page.
- **URL for Browser**:
  ```bash
  http://localhost:3000/auth/authorize
  ```
  Please copy and paste this URL in your browser. It will redirect you to the **GHL authorization page**. After approval, you will be redirected to the callback endpoint.

#### 2. OAuth Callback
- **Endpoint**: `GET /auth/callback`
- **Description**: Handles the callback from GHL after authorization. The response will include token details such as tokenId, expiresAt, and importantly, an accessToken. This accessToken must be used in the Authorization header for all subsequent API calls.
- **Response Example**:
  ```json
  {
    "message": "Authorization successful",
    "tokenId": "tokenId string",
    "expiresAt": "expire date",
    "accessToken": "your_access_token"
  }
  ```
- **Note**: This endpoint is automatically called by GHL after authorization. Ensure you use the returned accessToken in the Authorization header for other API requests.

#### 3. Refresh Token
- **Endpoint**: `POST /api/tokens/refresh`
- **Description**: Refreshes an expired access token.
- **Headers**:
  - `Authorization: Bearer your_access_token`
- **Test Command**:
  ```bash
  curl --location --request POST 'http://localhost:3000/api/tokens/refresh' \
  --header 'Authorization: Bearer your_access_token' \
  --header 'Content-Type: application/json'
  ```

### API Endpoints

These endpoints interact with the Go High Level API. All endpoints require an Authorization header with a Bearer token.

#### 1. Get Contacts
- **Endpoint**: `GET /api/contacts`
- **Description**: Retrieves contacts from GHL.
- **Headers**:
  - `Authorization: Bearer your_access_token`
- **Test Command**:
  ```bash
  curl --location 'http://localhost:3000/api/contacts' \
  --header 'Authorization: Bearer your_access_token'
  ```

#### 2. Get Opportunities
- **Endpoint**: `GET /api/opportunities`
- **Description**: Retrieves opportunities from GHL.
- **Headers**:
  - `Authorization: Bearer your_access_token`
- **Test Command**:
  ```bash
  curl --location 'http://localhost:3000/api/opportunities' \
  --header 'Authorization: Bearer your_access_token'
  ```

#### 3. Get Users
- **Endpoint**: `GET /api/users`
- **Description**: Retrieves users from GHL.
- **Headers**:
  - `Authorization: Bearer your_access_token`
- **Curl**:
  ```bash
  curl --location 'http://localhost:3000/api/users' \
  --header 'Authorization: Bearer your_access_token'
  ```

#### 4. Get Calendars
- **Endpoint**: `GET /api/calendars`
- **Description**: Retrieves calendars from GHL.
- **Headers**:
  - `Authorization: Bearer your_access_token`
- **Curl**:
  ```bash
  curl --location 'http://localhost:3000/api/calendars' \
  --header 'Authorization: Bearer your_access_token'
  ```

#### 5. Get Associations
- **Endpoint**: `GET /api/associations`
- **Description**: Retrieves associations from GHL.
- **Headers**:
  - `Authorization: Bearer your_access_token`
- **Curl**:
  ```bash
  curl --location 'http://localhost:3000/api/associations' \
  --header 'Authorization: Bearer your_access_token'
  ```

## Project Structure 
```
├── src/
│   ├── index.ts # Entry point
│   ├── routes/
│   │   ├── auth.ts # Authentication routes
│   │   └── api.ts # API routes
│   ├── services/
│   │   ├── ghlService.ts # GHL API service
│   │   └── apiService.ts # Internal API service
│   ├── utils/
│   │   ├── dbconnection.ts # Database
│   │   ├── middleware.ts # Express middleware
│   │   └── constants.ts # Constants and config
│   └── models/
│       └── Token.ts # Token model
├── .env # Environment variables
├── package.json # Dependencies
└── tsconfig.json # TypeScript configuration
```

## Environment Variables

| Variable           | Description                         | Example                                     |
|--------------------|-------------------------------------|---------------------------------------------|
| PORT               | Port for the Express server         | 3000                                        |
| MONGODB_URI        | MongoDB connection string           | mongodb://localhost:27017/ghl-integration   |
| GHL_CLIENT_ID      | GHL OAuth client ID                 | your_client_id                              |
| GHL_CLIENT_SECRET  | GHL OAuth client secret             | your_client_secret                          |
| GHL_REDIRECT_URI   | OAuth callback URL                  | http://localhost:3000/auth/callback           |
