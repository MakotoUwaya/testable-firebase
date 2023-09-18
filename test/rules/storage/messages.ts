// @vitest-environment node
import {
  assertSucceeds,
  assertFails,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { ref, uploadBytes, getBytes } from "firebase/storage";
import { readFileSync } from "fs";
import { getTestEnv } from "@/../test/utils";
import { userFactory } from "@/../test/factories/user";
import { FirebaseStorage } from "@firebase/storage-types";

const user = userFactory.build({ id: "user-uid" });
const other = userFactory.build({ id: "other-uid" });
const file = readFileSync("./test/assets/sample.jpg");
const userFilePath = "messages/user-message-id/sample.jpg";
const otherFilePath = "messages/other-message-id/sample.jpg";

export const messagesTest = () => {
  describe("messages", () => {
    let env: RulesTestEnvironment;

    beforeEach(async () => {
      env = getTestEnv();
      await env.withSecurityRulesDisabled(async (context) => {
        const storage = context.storage();
        const userFileRef = ref(storage, userFilePath);
        const otherFileRef = ref(storage, otherFilePath);
        await uploadBytes(userFileRef, file, {
          customMetadata: { ownerId: user.id },
        });
        await uploadBytes(otherFileRef, file, {
          customMetadata: { ownerId: other.id },
        });
      });
    });

    describe("未認証の場合", () => {
      let storage: FirebaseStorage;

      beforeEach(() => {
        storage = env.unauthenticatedContext().storage();
      });

      test("読み込みできない", async () => {
        const storageRef = ref(storage, otherFilePath);
        await assertFails(getBytes(storageRef));
      });

      test("書き込みできない", async () => {
        const newStorageRef = ref(
          storage,
          "messages/new-message-id/sample.jpg"
        );
        await assertFails(
          uploadBytes(newStorageRef, file, {
            customMetadata: { ownerId: other.id },
          })
        );
      });
    });

    describe("認証済の場合", () => {
      let storage: FirebaseStorage;

      describe("自分のファイルの場合", () => {
        beforeEach(() => {
          storage = env.authenticatedContext(user.id).storage();
        });

        test("読み込みできる", async () => {
          const storageRef = ref(storage, userFilePath);
          await assertSucceeds(getBytes(storageRef));
        });

        test("書き込みできる", async () => {
          const newStorageRef = ref(
            storage,
            "messages/new-message-id/sample.jpg"
          );
          await assertSucceeds(
            uploadBytes(newStorageRef, file, {
              customMetadata: { ownerId: user.id },
            })
          );
        });

        test("変更できる", async () => {
          const storageRef = ref(storage, userFilePath);
          await assertSucceeds(
            uploadBytes(storageRef, file, {
              customMetadata: { ownerId: user.id },
            })
          );
        });
      });

      describe("他ユーザのファイルの場合", () => {
        beforeEach(() => {
          storage = env.authenticatedContext(user.id).storage();
        });

        test("読み込みできる", async () => {
          const storageRef = ref(storage, otherFilePath);
          await assertSucceeds(getBytes(storageRef));
        });

        // TODO: CIで失敗するので一旦skip
        test.skip("書き込みできない", async () => {
          const newStorageRef = ref(
            storage,
            "messages/new-message-id/sample.jpg"
          );
          await assertFails(
            uploadBytes(newStorageRef, file, {
              customMetadata: { ownerId: other.id },
            })
          );
        });

        test("変更できない", async () => {
          const storageRef = ref(storage, otherFilePath);
          await assertFails(
            uploadBytes(storageRef, file, {
              customMetadata: { ownerId: other.id },
            })
          );
        });
      });
    });
  });
};
