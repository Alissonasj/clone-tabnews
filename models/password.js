import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(password, rounds);
}

async function compare(providerPassword, storedPassword) {
  return await bcryptjs.compare(providerPassword, storedPassword);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

const password = {
  hash,
  compare,
};

export default password;
