"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.action";
import Thumbnail from "./thumbnail";
import FormattedDateTime from "./formatted-date-time";
import {useDebounce} from "use-debounce"
function Search() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = usePathname();
  const searchQuery = searchParams.get("query");
  const [results, setResults] = useState<FileDocument[]>([]);
  const [open, setOpen] = useState(false);
  const [debounceQuery] = useDebounce(query, 500);
  useEffect(() => {
    if (!searchQuery) setQuery("");
  }, [searchQuery]);

  useEffect(() => {
    const fetchFiles = async () => {
      if(!debounceQuery) {
        setResults([]);
        setOpen(false);
        return 
      }
      const files = (await getFiles({ searchText: debounceQuery })) as FileDocument[];
      setResults(files);
      setOpen(true);
    };
    fetchFiles();
  }, [debounceQuery, path, router, searchParams]);
  const handleClickItem = (file: FileDocument) => {
    setOpen(false);
    setResults([]);
    router.push(
      `/${((file.type === "video") || (file.type === "audio")) ? "media" : file.type + "s"}?query=${file.name}`
    );
  };
  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />
        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  key={file.$id}
                  className="flex items-center justify-between"
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Search;
