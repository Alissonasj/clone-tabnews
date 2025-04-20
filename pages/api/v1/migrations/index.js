import controller from "infra/controller";
import database from "infra/database.js";
import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

let dbClient;
let defaultMigrationsOptions;
const router = createRouter();

router.use(connectDatabase);
router.get(getMigrations);
router.post(postMigrations);

export default router.handler(controller.errorHandlers);

async function connectDatabase(request, response, next) {
  dbClient = await database.getNewClient();

  defaultMigrationsOptions = {
    dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  await next();
  await dbClient?.end();
}

async function getMigrations(request, response) {
  const pedingMigrations = await migrationRunner(defaultMigrationsOptions);

  return response.status(200).json(pedingMigrations);
}

async function postMigrations(request, response) {
  const migratedMigrations = await migrationRunner({
    ...defaultMigrationsOptions,
    dryRun: false,
  });

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  response.status(200).json(migratedMigrations);
}
