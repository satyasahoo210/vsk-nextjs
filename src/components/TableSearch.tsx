"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const TableSearch = () => {
  const router = useRouter();

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const value = (evt.currentTarget[0] as HTMLInputElement).value;

    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("q", value);
    router.push(`${window.location.pathname}?${queryParams}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
    >
      <Image src="/search.png" alt="Search" width={14} height={14} />
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
};

export default TableSearch;
