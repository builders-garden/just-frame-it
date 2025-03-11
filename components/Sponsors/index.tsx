import Image from "next/image";

// Array of sponsor data with all necessary information
const sponsorData = [
  {
    name: "Base",
    href: "https://www.base.org/",
    imageSrc: "/images/base-logo.svg",
    width: 80,
    height: 26,
    className: "w-[100px] md:w-[120px]",
  },
  {
    name: "Purple",
    href: "https://nouns.build/dao/base/0x8de71d80ee2c4700bc9d4f8031a2504ca93f7088/",
    imageSrc: "/images/purple-logo.svg",
    width: 100,
    height: 32,
    className: "w-[120px] md:w-[150px]",
  },
  {
    name: "Warpcast",
    href: "https://www.warpcast.com/",
    imageSrc: "/images/warpcast-logo.svg",
    width: 100,
    height: 32,
    className: "w-[120px] md:w-[150px]",
  },
  {
    name: "Splits",
    href: "https://splits.org/",
    imageSrc: "/images/splits-logo.svg",
    width: 100,
    height: 32,
    className: "w-[120px] md:w-[150px]",
  },
  {
    name: "Neynar",
    href: "https://neynar.com/",
    imageSrc: "/images/neynar-logo.svg",
    width: 50,
    height: 16,
    className: "w-[50px] md:w-[75px]",
  },
  {
    name: "Daimo Pay",
    href: "https://pay.daimo.com/",
    imageSrc: "/images/daimo-logo.svg",
    width: 50,
    height: 16,
    className: "w-[50px] md:w-[75px]",
  },
  {
    name: "Privy",
    href: "https://www.privy.io/",
    imageSrc: "/images/privy-logo.svg",
    width: 50,
    height: 16,
    className: "w-[50px] md:w-[75px]",
  },
  {
    name: "MBD",
    href: "https://mbd.xyz/",
    imageSrc: "/images/mbd-logo.svg",
    width: 50,
    height: 16,
    className: "w-[50px] md:w-[75px]",
  },
  {
    name: "Zapper",
    href: "https://protocol.zapper.xyz/",
    imageSrc: "/images/zapper-logo.svg",
    width: 50,
    height: 16,
    className: "w-[50px] md:w-[75px]",
  },
];

export default function Sponsors() {
  // Split the sponsors into two rows
  const firstRowSponsors = sponsorData.slice(0, 4);
  const secondRowSponsors = sponsorData.slice(4);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* First row - 2x2 grid on mobile, row on desktop */}
      <div className="md:px-0 px-12 grid grid-cols-2 md:flex md:flex-row gap-6 md:gap-8 justify-center items-center">
        {firstRowSponsors.map((sponsor) => (
          <a
            key={sponsor.name}
            href={sponsor.href}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 hover:opacity-100 transition-opacity flex justify-center"
          >
            <Image
              src={sponsor.imageSrc}
              alt={`${sponsor.name} logo`}
              width={sponsor.width}
              height={sponsor.height}
              className={`object-contain ${sponsor.className} h-auto`}
            />
          </a>
        ))}
      </div>
      {/* Second row - updated with larger logos on mobile */}
      <div className="md:px-0 px-12 flex flex-row gap-8 justify-center items-center">
        {secondRowSponsors.map((sponsor) => (
          <a
            key={sponsor.name}
            href={sponsor.href}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 hover:opacity-100 rounded-lg transition-opacity"
          >
            <Image
              src={sponsor.imageSrc}
              alt={`${sponsor.name} logo`}
              width={sponsor.width}
              height={sponsor.height}
              className={`object-contain scale-125 md:scale-100 ${sponsor.className} h-auto`}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
