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
interface File {
  type: string;
  name: string;
  url: string;
  extension: string;
  size: number;
  owner: string;
  accountId: string;
  users: User[];
  bucketFileId: string;
}
interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}
declare type FileType = "document" | "image" | "video" | "audio" | "other";
