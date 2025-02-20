const { app } = require("@azure/functions");
const { getCurrentUser, getAuthenticationResponse } = require("../auth/auth");
const { getDatabase } = require("../db/db");

const projection = {
  _id: 0,
  createdAt: 0,
  userId: 0,
  updatedAt: 0
}

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
        .find({ userId: currentUser.name }, { projection })
        .toArray()
    );

    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(networkList),
    };
  },
});
