"use server";
import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { David_Libre } from "next/font/google";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.action";

export const uploadFileAction = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to create File document");
      });
    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Upload failed");
  }
};

export const getFiles = async () => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("user Not Found");
    const queries = createQueries(currentUser);
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );
    return parseStringify(files.documents);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

export const deleteFile = async ({fileId, path}: {fileId:string, path:string}) => {
  const { storage, databases } = await createAdminClient();
  try {
    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );
    if (!file) throw new Error("File Not Found");
    await storage.deleteFile(appwriteConfig.bucketId, file.bucketFileId);
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );
    revalidatePath(path);
    return fileId;
  } catch (error) {
    handleError(error, "Failed to delete file");
  }
};
export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();
  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      }
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};
export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsers) => {
  const { databases } = await createAdminClient();
  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: emails,
      }
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
const createQueries = (user: User) => {
  const queries = [
    Query.or([
      Query.equal("owner", [user.$id]),
      Query.contains("users", [user.email]),
    ]),
  ];
  return queries;
};
