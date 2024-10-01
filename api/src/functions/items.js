const { app } = require("@azure/functions");
const { getCurrentUser } = require("../auth/auth");
const { getDatabase } = require("../db/db");

app.http("items", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const currentUser = await getCurrentUser(request, context);

    if (!currentUser.hasAccess) {
      return getAuthenticationResponse(currentUser);
    }

    const db = await getDatabase(context);
    const networkList = (
      await db
        .collection("network-list")
        .find({ userId: currentUser.name })
        .toArray()
    ).map(({ name }) => name);

    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(networkList),
    };
  },
});
