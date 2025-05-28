import password from "models/password";
import user from "models/user";
import orchestrator from "tests/orchestrator";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPedingMigrations();
});

describe("PATCH to api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent username", async () => {
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
        {
          method: "PATCH",
        },
      );

      expect(response2.status).toBe(404);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encotrado no sistema.",
        action: "Verifique se o username está digitado corretamente",
        status_code: 404,
      });
    });

    test("With duplicated 'username'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          email: "user1@email.com",
          password: "senha123",
        }),
      });

      expect(user1Response.status).toBe(201);

      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
          email: "user2@email.com",
          password: "senha123",
        }),
      });

      expect(user2Response.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O nome informado já está sendo utilizado.",
        action: "Utilize outro nome para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With duplicated 'email'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: "email1",
          email: "email1@email.com",
          password: "senha123",
        }),
      });

      expect(user1Response.status).toBe(201);

      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: "email2",
          email: "email2@email.com",
          password: "senha123",
        }),
      });

      expect(user2Response.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/email2",
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email: "email1@email.com",
          }),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With unique 'username'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueUser1",
          email: "uniqueUser1@email.com",
          password: "senha123",
        }),
      });

      expect(user1Response.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/uniqueUser1",
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: "uniqueUser2",
          }),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueUser2",
        email: "uniqueUser1@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(response.status).toBe(200);
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With unique 'email'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueEmail1",
          email: "uniqueEmail1@email.com",
          password: "senha123",
        }),
      });

      expect(user1Response.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/uniqueEmail1",
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email: "uniqueEmail2@email.com",
          }),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueEmail1",
        email: "uniqueEmail2@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(response.status).toBe(200);
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With new 'password'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: "newPassword1",
          email: "newPassword1@email.com",
          password: "newPassword1",
        }),
      });

      expect(user1Response.status).toBe(201);

      const response = await fetch(
        "http://localhost:3000/api/v1/users/newPassword1",
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            password: "newPassword2",
          }),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "newPassword1",
        email: "newPassword1@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(response.status).toBe(200);
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.finOneByUserName("newPassword1");
      const correctPasswordMatch = await password.compare(
        "newPassword2",
        userInDatabase.password,
      );
      const incorrectPasswordMatch = await password.compare(
        "newPassword1",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
