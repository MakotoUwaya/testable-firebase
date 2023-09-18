import { usersTest } from "./collections/user";
import { messagesTest } from "./collections/message";
import { initializeTestEnvironment, getTestEnv } from "@/../test/utils";

describe("firestore.rules", () => {
  beforeAll(async () => {
    await initializeTestEnvironment("oichan-testable-firebase");
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
