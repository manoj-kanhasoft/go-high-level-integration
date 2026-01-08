import express from "express";
import { 
  getAuthorizationUrl, 
  exchangeCodeForToken 
} from "../services/ghlService";

const router = express.Router();

// Route to redirect user to the GHL OAuth authorization page
router.get("/authorize", (req, res) => {
  // Generate the authorization URL from GHL service
  const authUrl = getAuthorizationUrl();
  // Redirect user to the external GHL login page
  res.redirect(authUrl);
});

// Callback route for handling the OAuth response from GHL
router.get("/callback", async (req, res) => {
  // Retrieve the authorization code from query parameters
  const { code } = req.query;

  // Check if the authorization code is missing
  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  try {
    // Exchange the received code for an access token
    const token = await exchangeCodeForToken(code as string);
    // Send a response with token details after successful authentication
    res.json({
      message: "Authorization successful",
      tokenId: token._id,
      expiresAt: token.expiresAt,
      userId: token.userId,
      accessToken: token.accessToken,
    });
  } catch (error) {
    // Log the error and send a failure response if token exchange fails
    console.error("Error in callback:", error);
    res.status(500).json({ error: "Failed to exchange code for token" });
  }
});

export default router;
