import database from "infra/database.js";
import { ServiceError } from "infra/erros";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

let dbClient;
let defaultMigrationsOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPeddingMigrations() {
  try {
    dbClient = await database.getNewClient();
    const pedingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
    });
    return pedingMigrations;
  } catch (error) {
    const serviceErrorObject = new ServiceError({ cause: error });
    console.error(serviceErrorObject);
  } finally {
    await dbClient?.end();
  }
}

async function runPedingMigrations() {
  try {
    dbClient = await database.getNewClient();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: false,
    });
    return migratedMigrations;
  } catch (error) {
    const serviceErrorObject = new ServiceError({ cause: error });
    console.error(serviceErrorObject);
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPeddingMigrations,
  runPedingMigrations,
};

export default migrator;
