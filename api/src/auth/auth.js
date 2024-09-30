const allowedUsers = ["yevgeniyvaleyev"];

function getCurrentUser(req) {
  const clientPrincipalHeader = req.headers.get("x-ms-client-principal");
  let user = clientPrincipalHeader ? decodeUser(clientPrincipalHeader) : null;

  return {
    authenticated: !!clientPrincipalHeader,
    hasAccess:
      !!clientPrincipalHeader && allowedUsers.includes(user?.userDetails),
    name: user?.userDetails,
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
