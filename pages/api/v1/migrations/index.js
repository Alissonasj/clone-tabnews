import controller from "infra/controller.js";
import migrator from "models/migrator.js";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getMigrations);
router.post(postMigrations);

export default router.handler(controller.errorHandlers);

async function getMigrations(request, response) {
  const pedingMigrations = await migrator.listPeddingMigrations();

  return response.status(200).json(pedingMigrations);
}

async function postMigrations(request, response) {
  const migratedMigrations = await migrator.runPedingMigrations();

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  response.status(200).json(migratedMigrations);
}
