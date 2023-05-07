import {
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";

import { userFactory } from "@/../test/factories/user";
import { getTestEnv, setCollection } from "../utils";
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const user = userFactory.build({ id: "user-id" });
const other = userFactory.build({ id: "other-id" });
const users = [user, other];

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const usersTest = () => {
  let env: RulesTestEnvironment;
  beforeEach(async () => {
    env = getTestEnv();
    await env.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setCollection(collection(adminDb, "users"), users);
    });
  });

  describe("認証済の場合", () => {
    test("一覧を読み込みできる(list)", async () => {
      const db = env.authenticatedContext(user.id).firestore();
      const collectionRef = collection(db, "users");
      await assertSucceeds(getDocs(collectionRef));
    });
    describe("自分のデータの場合", () => {
      let db: Firestore;

      beforeEach(() => {
        db = env.authenticatedContext(user.id).firestore();
      });

      test("読み込みできる(get)", async () => {
        const docRef = doc(db, `users/${user.id}`);
        await assertSucceeds(getDoc(docRef));
      });
      test("作成できる", async () => {
        const newUser = userFactory.build();
        db = env.authenticatedContext(newUser.id).firestore();
        const docRef = doc(db, `users/${newUser.id}`);
        await assertSucceeds(setDoc(docRef, newUser));
      });
      test("更新できる", async () => {
        const docRef = doc(db, `users/${user.id}`);
        await assertSucceeds(updateDoc(docRef, { name: "違う名前" }));
      });
      test("削除できる", async () => {
        const docRef = doc(db, `users/${user.id}`);
        await assertSucceeds(deleteDoc(docRef));
      });
    });
    describe("自分以外のデータの場合", () => {
      let db: Firestore;

      beforeEach(() => {
        db = env.authenticatedContext(user.id).firestore();
      });

      test("読み込みできる(get)", async () => {
        const docRef = doc(db, `users/${other.id}`);
        await assertSucceeds(getDoc(docRef));
      });
      test("作成できない", async () => {
        const newUser = userFactory.build();
        const docRef = doc(db, `users/${newUser.id}`);
        await assertFails(setDoc(docRef, newUser));
      });
      test("更新できない", async () => {
        const docRef = doc(db, `users/${other.id}`);
        await assertFails(updateDoc(docRef, { name: "違う名前" }));
      });
      test("削除できない", async () => {
        const docRef = doc(db, `users/${other.id}`);
        await assertFails(deleteDoc(docRef));
      });
    });
  });
  describe("未認証の場合", () => {
    let db: Firestore;
    beforeEach(() => {
      db = env.unauthenticatedContext().firestore();
    });
    test("一覧を読み込みできない(list)", async () => {
      const collectionRef = collection(db, "users");
      await assertFails(getDocs(collectionRef));
    });
    test("読み込みできない(get)", async () => {
      const docRef = doc(db, `users/${other.id}`);
      await assertFails(getDoc(docRef));
    });
    test("作成できない", async () => {
      const newUser = userFactory.build();
      const docRef = doc(db, `users/${newUser.id}`);
      await assertFails(setDoc(docRef, newUser));
    });
    test("更新できない", async () => {
      const docRef = doc(db, `users/${other.id}`);
      await assertFails(updateDoc(docRef, { name: "違う名前" }));
    });
    test("削除できない", async () => {
      const docRef = doc(db, `users/${other.id}`);
      await assertFails(deleteDoc(docRef));
    });
  });
};
