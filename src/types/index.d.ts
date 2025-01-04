interface RenameFileProps{
  fileId:string;
  name:string;
  extension:string;
  path: string;
}
interface UpdateFileUsers{
  fileId:string;
  emails:string[];
  path: string;
}
interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}
declare interface ActionType {
  label: string;
  icon: string;
  value: string;
}