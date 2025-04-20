import controller from "infra/controller";
import database from "infra/database.js";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getStatus);

export default router.handler(controller.errorHandlers);

async function getStatus(request, response) {
  const databaseVersionResult = await database.query("SHOW server_version;");

  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionResult = await database.query(
    "SHOW max_connections;",
  );

  const databaseMaxConnectionValue =
    databaseMaxConnectionResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseCurrentConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseCurrentConnectionsValue =
    databaseCurrentConnectionsResult.rows[0].count;

  const updatedAt = new Date().toISOString();

  const statusServer = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        status: "",
        max_connections: parseInt(databaseMaxConnectionValue),
        opened_connections: databaseCurrentConnectionsValue,
        latency: "",
        version: databaseVersionValue,
      },
      webserver: "",
    },
  };

  response.status(200).json(statusServer);
}
