const { app } = require("@azure/functions");
const { getCurrentUser } = require("../auth/auth");
const { getDatabase } = require("../db/db");

app.http("item", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const currentUser = await getCurrentUser(request, context);

    if (!currentUser.hasAccess) {
      return getAuthenticationResponse(currentUser);
    }

    if (request.method === "POST") {
      const { 
        name, 
        phoneNumber, 
        lastConnect, 
        jobTitle, 
        workedAt, 
        preferredCommunicationChannel, 
        email, 
        reconnectionFrequency 
      } = await request.json();

      // Validate required fields
      if (!name) {
        return {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: "Name is required" })
        };
      }

      const db = await getDatabase(context);
      
      const networkItem = {
        id: name.toLowerCase().replace(/\s+/g, ''),
        name,
        phoneNumber,
        lastConnect: new Date(lastConnect),
        jobTitle,
        workedAt,
        preferredCommunicationChannel,
        email,
        reconnectionFrequency: Number(reconnectionFrequency),
        userId: currentUser.name,
        createdAt: new Date()
      };

      try {
        await db.collection("network-list").insertOne(networkItem);

        return {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(networkItem),
        };
      } catch (error) {
        context.log.error('Error creating network item:', error);
        
        return {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: "Failed to create network item" })
        };
      }
    }

    return {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  },
});
