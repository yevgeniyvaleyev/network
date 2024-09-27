const { app } = require("@azure/functions");
const { authorizeRequest } = require("../auth/auth");

app.http("items", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const unauthorizedResponseObject = authorizeRequest(request);

    if (unauthorizedResponseObject) {
      return unauthorizedResponseObject;
    }

    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get("name") || (await request.text()) || "world";

    return { body: `Hello, ${name}!` };
  },
});
