"use server";

import ActionDropdown from "@/components/action-dropdown";
import { Chart } from "@/components/chart";
import FormattedDateTime from "@/components/formatted-date-time";
import Thumbnail from "@/components/thumbnail";
import { Separator } from "@/components/ui/separator";
import { getEachUsage, getFiles } from "@/lib/actions/file.action";
import { convertFileSize } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const files = (await getFiles({ limit: 20 })) as FileDocument[];
  const [categories, total] = (await getEachUsage()) as ResultType;
  console.log(categories, total);
  const usageSummary = Object.keys(categories).map((key) => {
    const title = key;
    const url = categories[key as keyof typeof categories].url;
    const size = categories[key as keyof typeof categories].size;
    const finalUpdate = categories[key as keyof typeof categories].finalUpdate;
    return {
      title,
      url,
      size,
      latestDate: finalUpdate,
    };
  });
  return (
    <main className="dashboard-container">
      <section>
        <Chart used={total} />
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
        {files.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.map((file) => (
              <Link
                href={file.url}
                target="_blank"
                className="flex items-center gap-3"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </main>
  );
}
