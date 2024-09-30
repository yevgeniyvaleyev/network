const { app } = require("@azure/functions");
const { getCurrentUser } = require("../auth/auth");

app.http("items", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const currentUser = getCurrentUser(request);

    if (!currentUser.hasAccess) {
      return getAuthenticationResponse(currentUser);
    }

    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get("name") || (await request.text()) || "world";

    return { body: `Hello, ${name}!` };
  },
});
