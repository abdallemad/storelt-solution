interface User {
  fullname: string;
  avatar: string;
  accountId: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  permissions: string[];
  files: string[];
  $databaseId: string;
  $collectionId: string;
  email: string;
}
interface FileDocument {
  name: string;
  url: string;
  type: FileType;
  bucketFileId: string;
  accountId: string;
  extension: string;
  size: number;
  users: string[];
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  owner: User;
  $databaseId: string;
  $collectionId: string;
}

declare type FileType = "document" | "image" | "video" | "audio" | "other";
