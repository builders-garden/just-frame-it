import Image from "next/image";

export default function Sponsors() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-row gap-8 justify-center items-center">
        <a
          href="https://www.base.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          <Image
            src="/images/base-logo.svg"
            alt="Sponsor 1"
            width={80}
            height={26}
            className="object-contain w-[80px] md:w-[120px] h-auto"
          />
        </a>
        <a
          href="https://nouns.build/dao/base/0x8de71d80ee2c4700bc9d4f8031a2504ca93f7088/"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          <Image
            src="/images/purple-logo.svg"
            alt="Sponsor 3"
            width={100}
            height={32}
            className="object-contain w-[100px] md:w-[150px] h-auto"
          />
        </a>
        <a
          href="https://www.warpcast.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-80 hover:opacity-100 rounded-lg transition-opacity"
        >
          <Image
            src="/images/warpcast-logo.svg"
            alt="Sponsor 2"
            width={100}
            height={32}
            className="object-contain w-[100px] md:w-[150px] h-auto"
          />
        </a>
      </div>
    </div>
  );
}
