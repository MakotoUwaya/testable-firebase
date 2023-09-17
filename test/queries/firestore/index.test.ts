import { getTestEnv, initializeTestEnvironment } from "@/../test/utils";
import { messagesTest } from "./collections/messages";

describe('firestore.rules', () => {
  beforeAll(async () => {
    await initializeTestEnvironment('testable-firebase-sample-chat-queries-test');
  });
  afterAll(async () => {
    await getTestEnv().cleanup();
  });
  afterEach(async () => {
    await getTestEnv().clearFirestore();
  });

  messagesTest();
});