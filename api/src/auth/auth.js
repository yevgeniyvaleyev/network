const allowedUsers = ["yevgeniyvaleyev"];

function authorizeRequest(req) {
  const clientPrincipalHeader = req.headers.get("x-ms-client-principal");

  if (!clientPrincipalHeader) {
    return {
      status: 401,
      body: "Unauthorized. Please log in to access this API.",
    };
  }

  // Decode the Base64-encoded user info
  const decodedPrincipal = Buffer.from(
    clientPrincipalHeader,
    "base64",
  ).toString("utf8");
  const user = JSON.parse(decodedPrincipal);

  if (!allowedUsers.includes(user.userDetails)) {
    return {
      status: 403,
      body: "Access denied. You are not authorized to access this API.",
    };
  }

  return null;
}

module.exports = {
  authorizeRequest,
};
