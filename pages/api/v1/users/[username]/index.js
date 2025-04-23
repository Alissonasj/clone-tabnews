import controller from "infra/controller.js";
import user from "models/user";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getUsers);

export default router.handler(controller.errorHandlers);

async function getUsers(request, response) {
  const username = request.query.username;
  const userFound = await user.finOneByUserName(username);

  response.status(200).json(userFound);
}
