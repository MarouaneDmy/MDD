import Link from "next/link";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary";
};

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary/90 cursor-pointer disabled:opacity-50",
  secondary: "bg-[#929292] text-white cursor-default",
};

export function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const styles = `inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-bold transition-colors ${variants[variant]} ${className}`;

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
