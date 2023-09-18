import { messagesTest } from "@/../test/rules/storage/messages";
import { initializeTestEnvironment, getTestEnv } from "@/../test/utils";

describe("storage.rules", () => {
  beforeAll(async () => {
    await initializeTestEnvironment("testable-firebase-sample-chat-storage-rules-test");
  });
  afterAll(async () => {
    await getTestEnv().cleanup();
  });
  afterEach(async () => {
    await getTestEnv().clearFirestore();
  });

  messagesTest();
});
