import database from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPedingMigrations();
});

describe("POST to api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
      });

      await database.query({
        text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
        values: ["alissonasj", "email@email.com", "senha123"],
      });

      const users = await database.query("SELECT * FROM users;");
      console.log(users.rows);

      expect(response.status).toBe(201);
    });
  });
});
