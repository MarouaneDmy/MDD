import Link from "next/link";
import Image from "next/image";

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="text-center space-y-8 pt-24 md:pt-32">
        <div className="flex justify-center px-4">
          <Image
            src="/logo.png"
            alt="Logo Monde de Dév"
            width={412}
            height={238}
            className="object-contain w-[250px] md:w-[412px] h-auto"
            priority
          />
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-14">
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-48 px-2 py-1 border-1 border-gray-900 text-gray-900 bg-white rounded-lg hover:bg-gray-900 hover:text-white transition-colors font-medium"
          >
            Se connecter
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center justify-center w-48 px-2 py-1 border-1 border-gray-900 text-gray-900 bg-white rounded-lg hover:bg-gray-900 hover:text-white transition-colors font-medium"
          >
            {"S'inscrire"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
