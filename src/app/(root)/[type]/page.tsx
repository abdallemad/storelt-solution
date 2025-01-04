import Card from "@/components/card";
import Sort from "@/components/sort";
import { getFiles } from "@/lib/actions/file.action";

interface SearchParams {
  params: {
    [key: string]: string | string[] | undefined;
  };
}

async function Page({ params }: SearchParams) {
  const type = ((await params)?.type as string) || "";
  const files = (await getFiles()) as FileDocument[];
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">0 MB</span>
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
