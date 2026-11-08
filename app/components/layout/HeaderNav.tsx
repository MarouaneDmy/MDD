"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

export default function HeaderNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const isOpen = openedOn === pathname;

  function close() {
    setOpenedOn(null);
  }

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenedOn(null);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenedOn(pathname)}
        aria-label="Ouvrir le menu"
        aria-expanded={isOpen}
        aria-controls="main-nav"
        className="cursor-pointer md:hidden"
      >
        <Menu className="h-8 w-8 text-black" strokeWidth={1.5} />
      </button>

      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 md:hidden ${
          isOpen ? "" : "hidden"
        }`}
      />

      <nav
        id="main-nav"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) close();
        }}
        className={`fixed inset-y-0 right-0 z-50 flex w-1/2 max-w-xs flex-col items-end gap-3 border-l border-black bg-white p-6 transition-[transform,visibility] duration-300 md:visible md:static md:w-auto md:max-w-none md:translate-x-0 md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 ${
          isOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        {children}
      </nav>
    </>
  );
}
