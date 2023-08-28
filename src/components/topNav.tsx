import { Menu } from "lucide-react";

interface TopNavProps {
  title: string;
}

function TopNav({ title }: TopNavProps) {
  return (
    <section className="fixed inset-x-0 top-0 flex justify-center gap-6 px-2 py-2 backdrop-blur-md">
      <div className="container flex w-full max-w-2xl items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 bg-size-200 bg-pos-0 p-2 text-sm font-semibold text-zinc-800 transition-all duration-500 hover:scale-105 hover:bg-pos-100">
          <Menu />
          <span className="sr-only">View Previous Conversations</span>
        </button>
        <h1 className="truncate text-lg font-bold tracking-wide md:text-xl">
          {title}
        </h1>
      </div>
    </section>
  );
}

export default TopNav;
