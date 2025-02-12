const { app } = require("@azure/functions");
const { getCurrentUser } = require("../auth/auth");
const { getDatabase } = require("../db/db");

const projection = {
  _id: 0,
  createdAt: 0,
  userId: 0,
  updatedAt: 0
}

app.http("item", {
  methods: ["POST", "GET", "PUT", "DELETE"],
  authLevel: "anonymous",
  route: "item/{id?}",
  handler: async (request, context) => {
    const currentUser = await getCurrentUser(request, context);

    if (!currentUser.hasAccess) {
      return getAuthenticationResponse(currentUser);
    }

    const db = await getDatabase(context);

    // GET request - fetch item by ID
    if (request.method === "GET") {
      const id = request.params.id;

      if (!id) {
        return {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: "Item ID is required" })
        };
      }

      try {
        const networkItem = await db.collection("network-list").findOne(
          {
            id,
            userId: currentUser.name
          },
          {
            projection
          }
        )

        if (!networkItem) {
          return {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ error: "Item not found" })
          };
        }

        return {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(networkItem)
        };
      } catch (error) {
        context.log.error('Error fetching network item:', error);

        return {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: "Failed to fetch network item" })
        };
      }
    }

    // PUT request - update item
    if (request.method === "PUT") {
      const id = request.params.id;

      if (!id) {
        return {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: "Item ID is required" })
        };
      }

      const updateData = await request.json();

      // Ensure lastConnect is a Date object if provided
      if (updateData.lastConnect) {
        updateData.lastConnect = new Date(updateData.lastConnect);
      }

      // Ensure reconnectionFrequency is a number if provided
      if (updateData.reconnectionFrequency) {
        updateData.reconnectionFrequency = Number(updateData.reconnectionFrequency);
      }

      try {
        const result = await db.collection("network-list").findOneAndUpdate(
          { id, userId: currentUser.name },
          { $set: { ...updateData, updatedAt: new Date() } },
          {
            returnDocument: 'after',
            projection
          }
        );

        if (!result) {
          return {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ error: "Item not found" })
          };
        }

        return {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result)
        };
      } catch (error) {
        context.error('Error updating network item:', error);

        return {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: "Failed to update network item" })
        };
      }
    }

    // POST request - create new item
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

    // DELETE request - delete item
    if (request.method === "DELETE") {
      const id = request.params.id;

      if (!id) {
        return {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: "Item ID is required" })
        };
      }

      try {
        const result = await db.collection("network-list").findOneAndDelete({
          id,
          userId: currentUser.name
        });

        if (!result) {
          return {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ error: "Item not found" })
          };
        }

        return {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: "Item deleted successfully" })
        };
      } catch (error) {
        context.log.error('Error deleting network item:', error);

        return {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ error: "Failed to delete network item" })
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
