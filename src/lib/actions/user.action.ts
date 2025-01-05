"use server";

import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { AVATAR_PLACEHOLDER_URL } from "../constance";
import { redirect } from "next/navigation";

export const createAccountAction = async ({
  fullname,
  email,
}: {
  fullname: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);
  const accountId = await sendEmailOTP(email);
  if (!accountId) throw new Error("Failed to send an OTP");
  if (!existingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        email,
        fullname,
        accountId,
        avatar: AVATAR_PLACEHOLDER_URL,
      }
    );
  }
  return parseStringify({ accountId });
};
export const signinUser = async (email: string) => {
  try {
    const user = await getUserByEmail(email);
    if (user) {
      await sendEmailOTP(email);
      return parseStringify({ accountId: user.accountId });
    }
    return parseStringify({ accountId: null, error:"User Not found" });
  } catch (error) {
    handleError(error, "Error signing in user");
  }
};
export const sendEmailOTP = async (email: string) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Error sending email OTP");
  }
};
export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Error verifying secret");
  }
};
export const getCurrentUser = async () => {
  const { account, databases } = await createSessionClient();

  const result = await account.get();
  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("accountId", [result.$id])]
  );
  if (user?.total <= 0) return null;
  return parseStringify(user.documents[0]);
};

export const handleLogout = async () => {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Error logging out");
  } finally {
    return redirect("/sign-in");
  }
};
const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const results = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("email", [email])]
  );
  if (results.total > 0) return results.documents[0];
  else return null;
};
