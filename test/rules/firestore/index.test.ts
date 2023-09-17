import { usersTest } from "./collections/user";
import { messagesTest } from "./collections/message";
import { initializeTestEnvironment, getTestEnv } from "@/../test/utils";

describe("firestore.rules", () => {
  beforeAll(async () => {
    await initializeTestEnvironment("api-project-90393892794");
  });
  afterAll(async () => {
    await getTestEnv().cleanup();
  });
  afterEach(async () => {
    await getTestEnv().clearFirestore();
  });

  usersTest();
  messagesTest();
});
