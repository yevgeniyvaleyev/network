const { app } = require("@azure/functions");

app.timer("scheduled-task", {
    schedule: "0 12 13 * * *",
    handler: async (myTimer, context) => {
        const timeStamp = new Date().toISOString();
        context.log('Timer trigger function ran at:', timeStamp);

        // Add your custom logic here
        // For example:
        // await doSomething();

        context.log('Timer function execution completed');
    }
});
