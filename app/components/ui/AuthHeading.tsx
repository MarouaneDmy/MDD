import Image from "next/image";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

interface AuthHeadingProps {
  title: string;
  backHref?: string;
}

export default function AuthHeading({
  title,
  backHref = "/",
}: AuthHeadingProps) {
  return (
    <div className="px-6 pt-4 md:pt-8">
      <div className="relative flex flex-col items-center pt-10 md:flex-row md:justify-center md:pt-0">
        <Link
          href={backHref}
          aria-label="Retour"
          className="absolute left-0 top-0 md:top-1/2 md:-translate-y-1/2"
        >
          <MoveLeft className="h-8 w-8 text-black" strokeWidth={1.5} />
        </Link>

        <Image
          src="/logo.png"
          alt="Logo Monde de Dév"
          width={140}
          height={81}
          className="mb-2 h-auto w-32 md:hidden"
          priority
        />

        <h1 className="text-xl text-black">{title}</h1>
      </div>
    </div>
  );
}
