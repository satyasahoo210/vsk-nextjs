"use client";

import { ITEMS_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";

type PaginationProps = {
  totalItems: number;
  currentPage: number;
};

const Pagination = ({ currentPage, totalItems }: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const router = useRouter();

  const changePage = (newPage: number) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${queryParams}`);
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={currentPage === 1}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(currentPage - 1)}
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageIndex = index + 1;
          return (
            <button
              key={pageIndex}
              className={`px-2 rounded-sm ${
                currentPage === pageIndex ? "bg-mSky" : ""
              }`}
              onClick={() => changePage(pageIndex)}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>
      <button
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
