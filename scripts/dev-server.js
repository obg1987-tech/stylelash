const { startServer } = require("next/dist/server/lib/start-server");

startServer({
  dir: process.cwd(),
  port: Number(process.env.PORT) || 3000,
  isDev: true,
  allowRetry: true,
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
