import { usersTest } from "./collections/user";
import { initializeTestEnvironment, getTestEnv } from "./utils";

process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

describe("firestore.rules", () => {
  beforeAll(async () => {
    await initializeTestEnvironment();
  });
  afterAll(async () => {
    await getTestEnv().cleanup();
  })
  afterEach(async () => {
    await getTestEnv().clearFirestore();
  })

  // TODO: Add test code here.
  usersTest();
});
