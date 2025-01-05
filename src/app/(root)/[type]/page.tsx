import Card from "@/components/card";
import Sort from "@/components/sort";
import { getFiles } from "@/lib/actions/file.action";
import { convertFileSize, getFileTypesParams } from "@/lib/utils";
import { notFound } from "next/navigation";

interface SearchParams {
  params: {
    [key: string]: string | string[] | undefined;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

async function Page({ params,searchParams }: SearchParams) {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || '';
  const sort = ((await searchParams)?.sort as string) || '';
  if(!['images','others','documents','media'].includes(type)) return notFound();
  const types = getFileTypesParams(type) as FileType[];
  const files = (await getFiles({types, searchText,sort})) as FileDocument[];
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">{convertFileSize(totalSize)}</span>
          </p>
          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>
      {files.length > 0 ? (
        <section className="file-list">
          {files.map((file) => {
            return <Card key={file.$id} file={file} />;
          })}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
}

export default Page;
