const { getDatabase } = require("../db/db");

async function getCurrentUser(req, context) {
  const clientPrincipalHeader = req.headers.get("x-ms-client-principal");
  let user = clientPrincipalHeader ? decodeUser(clientPrincipalHeader) : null;

  const db = await getDatabase(context);
  const userProfile = (await db.collection("users").find({}).toArray()).find(
    u => u.name === user?.userDetails);

  return {
    authenticated: !!clientPrincipalHeader,
    hasAccess:
      !!clientPrincipalHeader && userProfile,
    name: user?.userDetails,
    languages: userProfile?.languages,
  };
}

function decodeUser(clientPrincipalHeader) {
  const decodedPrincipal = Buffer.from(
    clientPrincipalHeader,
    "base64",
  ).toString("utf8");
  const user = JSON.parse(decodedPrincipal);
  return user;
}

function getAuthenticationResponse(currentUser) {
  if (!currentUser.authenticated) {
    return {
      status: 401,
      body: "Unauthorized. Please log in to access this API.",
    };
  }

  if (!currentUser.hasAccess) {
    return {
      status: 403,
      body: "Access denied. You are not authorized to access this API.",
    };
  }

  return null;
}

module.exports = {
  getAuthenticationResponse,
  getCurrentUser,
};
