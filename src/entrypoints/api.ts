import { createApp } from "../api/server.js";
import { env } from "../config/env.js"

async function main(): Promise<void> {
  const app = createApp();

  //app.listen sends HTTP objects 
  const server = app.listen(env.api.PORT, () => {
    console.log(`Chronos API Listening on port ${env.api.PORT}`);
  })

  //to check for server
  console.log(server);

  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down...`);

    server.close(() => {
      console.log("HTTP server colsed");
      process.exit(0);
    });
  };

  // SIGTERM is the request to showtdown properly
  // it request to shutdown, like if docker stops your container, it normally sends SIGTERM first
  // and gracefully shutdown, clean up first and close
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  // CTRL + C in terminal
  process.on("SIGINT", () => shutdown("SIGINT"));
}


main().catch((error: unknown) => {
  console.error("Failed to start Chronos API: ", error);
  process.exit(1);
});
