const { app } = require("@azure/functions");
const { getCurrentUser } = require("../auth/auth");

app.http("current-user", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const currentUser = await getCurrentUser(request, context);

    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentUser),
    };
  },
});
