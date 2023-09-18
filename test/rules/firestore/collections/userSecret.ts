import {
  assertSucceeds,
  assertFails,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { collection } from "firebase/firestore";
import { getTestEnv, setCollection } from "@/../test/utils";
import { userSecretFactory } from "@/../test/factories/userSecret";

const userSecret = userSecretFactory.build({ id: "user-id" });
const otherSecret = userSecretFactory.build({ id: "other-id" });
const userSecrets = [userSecret, otherSecret];

export const userSecretsTest = () => {
  describe("userSecrets", () => {
    let env: RulesTestEnvironment;

    beforeEach(async () => {
      env = getTestEnv();
      await env.withSecurityRulesDisabled(async (context) => {
        const adminDb = context.firestore();
        await setCollection(collection(adminDb, "userSecrets"), userSecrets);
      });
    });

    describe("未認証の場合", () => {
      let db: firebase.default.firestore.Firestore;

      beforeEach(() => {
        db = env.unauthenticatedContext().firestore();
      });

      test("読み込みできない(get)", async () => {
        const ref = db.collection("userSecrets").doc(otherSecret.id);
        await assertFails(ref.get());
      });

      test("読み込みできない(list)", async () => {
        const ref = db.collection("userSecrets");
        await assertFails(ref.get());
      });

      test("作成できない", async () => {
        const newUserSecret = userSecretFactory.build();
        const ref = db.collection("userSecrets");
        await assertFails(ref.add(newUserSecret));
      });

      test("更新できない", async () => {
        const ref = db.collection("userSecrets").doc(otherSecret.id);
        await assertFails(ref.update({ fcmToken: "違うトークン" }));
      });

      test("削除できない", async () => {
        const ref = db.collection("userSecrets").doc(otherSecret.id);
        await assertFails(ref.delete());
      });
    });

    describe("認証済の場合", () => {
      test("一覧を読み込みできない(list)", async () => {
        const db = env.authenticatedContext(userSecret.id).firestore();
        const ref = db.collection("userSecrets");
        await assertFails(ref.get());
      });

      describe("自分のデータの場合", () => {
        let db: firebase.default.firestore.Firestore;

        beforeEach(() => {
          db = env.authenticatedContext(userSecret.id).firestore();
        });

        test("読み込みできる(get)", async () => {
          const ref = db.collection("userSecrets").doc(userSecret.id);
          await assertSucceeds(ref.get());
        });

        test("作成できる", async () => {
          const newUserSecret = userSecretFactory.build({ id: "new-user-id" });
          const db = env.authenticatedContext(newUserSecret.id).firestore();
          const ref = db.collection("userSecrets");
          await assertSucceeds(ref.doc(newUserSecret.id).set(newUserSecret));
        });

        test("更新できる", async () => {
          const ref = db.collection("userSecrets").doc(userSecret.id);
          await assertSucceeds(ref.update({ fcmToken: "違うトークン" }));
        });

        test("削除できる", async () => {
          const ref = db.collection("userSecrets").doc(userSecret.id);
          await assertSucceeds(ref.delete());
        });
      });

      describe("自分以外のデータの場合", () => {
        let db: firebase.default.firestore.Firestore;

        beforeEach(() => {
          db = env.authenticatedContext(userSecret.id).firestore();
        });

        test("読み込みできない(get)", async () => {
          const ref = db.collection("userSecrets").doc(otherSecret.id);
          await assertFails(ref.get());
        });

        test("作成できない", async () => {
          const newUserSecret = userSecretFactory.build({ id: "new-user-id" });
          const ref = db.collection("userSecrets");
          await assertFails(ref.doc(newUserSecret.id).set(newUserSecret));
        });

        test("更新できない", async () => {
          const ref = db.collection("userSecrets").doc(otherSecret.id);
          await assertFails(ref.update({ fcmToken: "違うトークン" }));
        });

        test("削除できない", async () => {
          const ref = db.collection("userSecrets").doc(otherSecret.id);
          await assertFails(ref.delete());
        });
      });
    });
  });
};
