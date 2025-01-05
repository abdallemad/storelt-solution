"use server";
import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { Allura, David_Libre } from "next/font/google";
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

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("user Not Found");
    const queries = createQueries(currentUser, types, searchText, sort, limit);
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

export const deleteFile = async ({
  fileId,
  path,
  bucketFileId,
}: {
  fileId: string;
  path: string;
  bucketFileId: string;
}) => {
  const { storage, databases } = await createAdminClient();
  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );
    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }
    revalidatePath(path);
    return { status: "success" };
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
export const getEachUsage = async ()=>{
  try {
    const allFiles = await getFiles({sort:'$updatedAt-desc'}) as FileDocument[]
    const sizes = {
      images:{
        size:0,
        finalUpdate:'',
        url:'/images',
        icon:'/assets/icons/images.svg'
      },
      documents:{
        size:0,
        finalUpdate:'',
        url:'/documents',
        icon:'/assets/icons/thumb-other.svg'
      },
      media:{
        size:0,
        finalUpdate:'',
        url:'/media',
        icon:'/assets/icons/thumb-video.svg'
      },
      others:{
        size:0,
        finalUpdate:'',
        url:'/others',
        icon:'/assets/icons/thumb-other.svg'
      },
    }
    allFiles.forEach(file=>{
      if(file.type === 'image') {
        sizes.images.size += file.size;
        sizes.images.finalUpdate = file.$updatedAt;
      }else if(file.type === 'document') {
        sizes.documents.size += file.size;
        sizes.documents.finalUpdate = file.$updatedAt;
      }else if(file.type === 'audio' || file.type === 'video') {
        sizes.media.size += file.size;
        sizes.media.finalUpdate = file.$updatedAt;
      }else if(file.type === 'other') {
        sizes.others.size += file.size;
        sizes.others.finalUpdate = file.$updatedAt;
      }
    })
    const allUsage = allFiles.reduce((acc, file) => acc + file.size, 0)
    return [ sizes, allUsage];
  } catch (error) {
    handleError(error,'try do make another request')
  }
}
const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
const createQueries = (
  user: User,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [user.$id]),
      Query.contains("users", [user.email]),
    ]),
  ];
  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));
  if (sort) {
    const [sortBy, orderBy] = sort.split("-");
    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }
  return queries;
};
