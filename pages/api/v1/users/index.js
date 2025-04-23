import controller from "infra/controller.js";
import user from "models/user";
import { createRouter } from "next-connect";

const router = createRouter();

router.post(postUsers);

export default router.handler(controller.errorHandlers);

async function postUsers(request, response) {
  const userInputValues = await request.body;
  const newUser = await user.create(userInputValues);

  response.status(201).json(newUser);
}
