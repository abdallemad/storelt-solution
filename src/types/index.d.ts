interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}
interface UpdateFileUsers {
  fileId: string;
  emails: string[];
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
declare interface GetFilesProps {
  types?: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
}
type ResultType = [
  {
    images: {
        size: number;
        finalUpdate: string;
        url: string;
        icon: string;
    };
    documents: {
        size: number;
        finalUpdate: string;
        url: string;
        icon: string;
    };
    media: {
        size: number;
        finalUpdate: string;
        url: string;
        icon: string;
    };
    others: {
      size: number;
      finalUpdate: string;
      url: string;
      icon: string;
  };
},
  number,
];
