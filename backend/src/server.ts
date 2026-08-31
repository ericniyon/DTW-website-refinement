import { createApp } from "./createApp";
import { env } from "./config/env";
import { prisma } from "./db/prisma";
import { warnIfCloudinaryMisconfigured } from "./services/cloudinaryService";

const app = createApp();

export default app;

if (!process.env.VERCEL) {
  const server = app.listen(env.PORT, () => {
    console.log(`Backend listening on port ${env.PORT}`);
    if (env.NODE_ENV === "development") {
      void warnIfCloudinaryMisconfigured();
    }
  });

  async function shutdown() {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
