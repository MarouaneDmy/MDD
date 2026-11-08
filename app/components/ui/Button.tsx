import Link from "next/link";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
};

export function Button({
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const styles = `inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/90 cursor-pointer disabled:opacity-50 ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
