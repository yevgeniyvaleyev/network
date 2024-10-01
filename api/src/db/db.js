const { MongoClient } = require("mongodb");

// Declare the MongoClient instance outside the function scope to maintain a singleton connection.
let client = null;

async function getDatabase(context) {
  context.log("--> Azure Function processing request to Cosmos DB.");

  // Connection string (best stored in Azure Application Settings)
  const connectionString = process.env["COSMOS_DB_CONNECTION_STRING"];
  const dbName = process.env["COSMOS_DB_NAME"];

  try {
    // Ensure the client is only created once
    if (!client) {
      client = new MongoClient(connectionString);
      await client.connect();
      context.log("--> Connected to Cosmos DB");
    }

    return client.db(dbName);
  } catch (err) {
    context.log.error("--> Error connecting to Cosmos DB", err);
  }
}

module.exports = {
  getDatabase,
};
