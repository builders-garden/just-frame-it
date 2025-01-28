import Image from "next/image";
import { Climate_Crisis } from "next/font/google";

const climateCrisis = Climate_Crisis({ subsets: ["latin"] });

interface Founder {
  name: string;
  username: string;
  avatarUrl: string;
}

interface SuccessStory {
  name: string;
  description: string;
  logoUrl: string;
  url: string;
  metrics: {
    label: string;
    value: string;
  }[];
  founders: Founder[]; // Changed from single founder to array of founders
}

const successStories: SuccessStory[] = [
  {
    name: "Farville",
    description: "Grow and harvest crops with your friends.",
    logoUrl: "https://farville.farm/images/icon.png",
    url: "https://warpcast.com/~/channel/farville",
    metrics: [
      { label: "DAU", value: "2k" },
      { label: "WAU", value: "5k" },
      { label: "Planted Seeds", value: "~100k" },
    ],
    founders: [
      {
        name: "limone.eth 🍋",
        username: "limone.eth",
        avatarUrl:
          "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/3acd1b12-0a6e-4370-ee6b-d81d3d717600/original",
      },
      {
        name: "Frank",
        username: "frankk",
        avatarUrl: "https://i.imgur.com/HLk7cUL.jpg",
      },
      {
        name: "mide (aka fraye)",
        username: "itsmide.eth",
        avatarUrl: "https://i.imgur.com/96rdcWp.jpg",
      },
      {
        name: "caso",
        username: "0xcaso",
        avatarUrl:
          "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/3f1c24b5-c05e-4147-9bab-22dcb3b8cc00/rectcrop3",
      },
    ],
  },
  {
    name: "Yo",
    description: "Send your friends a Yo",
    logoUrl: "https://yo.steer.fun/icon.png",
    url: "https://warpcast.com/~/channel/yo",
    metrics: [
      { label: "DAU", value: "2k" },
      { label: "WAU", value: "5k" },
      { label: "Yo Sent", value: "1.2M" },
    ],
    founders: [
      {
        name: "Stephan",
        username: "stephancill",
        avatarUrl:
          "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/d856be72-5b5a-4423-d6ba-8eded0978e00/rectcrop3",
      },
    ],
  },
  {
    name: "Farcade",
    description: "It's game time",
    logoUrl: "https://play.farcade.ai/icons/icon-512x512.png",
    url: "https://warpcast.com/~/channel/farcade",
    metrics: [
      { label: "DAU", value: "2k" },
      { label: "WAU", value: "5k" },
      { label: "Total Planted", value: "~100k" },
    ],
    founders: [
      {
        name: "chuckstock",
        username: "chuckstock",
        avatarUrl: "https://i.imgur.com/9RF2vWU.gif",
      },
      {
        name: "Blackstock",
        username: "blackstock",
        avatarUrl:
          "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/49f18400-1d26-4a52-25b5-e46fcab5ca00/original",
      },
      {
        name: "andrewjames",
        username: "Andrew",
        avatarUrl:
          "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/1235dba6-4afa-4451-a7da-a0a846dbd600/original",
      },
    ],
  },
  {
    name: "Farworld",
    description: "Onchain Monster Collector ",
    logoUrl: "https://farworld.gg/icon-512x512.png",
    url: "https://farworld.gg",
    metrics: [
      { label: "DAU", value: "2k" },
      { label: "WAU", value: "5k" },
      { label: "Total Planted", value: "~100k" },
    ],
    founders: [
      {
        name: "chuckstock",
        username: "chuckstock",
        avatarUrl: "https://i.imgur.com/9RF2vWU.gif",
      },
      {
        name: "Blackstock",
        username: "blackstock",
        avatarUrl:
          "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/49f18400-1d26-4a52-25b5-e46fcab5ca00/original",
      },
      {
        name: "andrewjames",
        username: "Andrew",
        avatarUrl:
          "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/1235dba6-4afa-4451-a7da-a0a846dbd600/original",
      },
    ],
  },
  {
    name: "Ponder",
    description: "The pulse of the Farcaster community",
    logoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/7d5d37b4-8658-43e8-ad5f-450b34fd4e00/original",
    url: "https://warpcast.com/~/channel/ponder",
    metrics: [
      { label: "DAU", value: "220" },
      { label: "WAU", value: "500" },
      { label: "Transactions/day", value: "400" },
    ],
    founders: [
      {
        name: "Colin Johnson 💭",
        username: "cojo.eth",
        avatarUrl: "https://i.imgur.com/5kWzCaA.jpg",
      },
      {
        name: "Ben Adamsky 💭",
        username: "ba",
        avatarUrl:
          "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/1ebcd498-0940-4ce9-2ff1-9260f4e00900/original",
      },
    ],
  },
  {
    name: "Bracket",
    description: "25 NFL",
    logoUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/cfbd4c9b-df12-4009-ec04-15ed68be7100/original",
    url: "https://warpcast.com/~/channel/bracket",
    metrics: [
      { label: "DAU", value: "2k" },
      { label: "WAU", value: "5k" },
      { label: "Total Planted", value: "~100k" },
    ],
    founders: [
      {
        name: "tldr (tim reilly)",
        username: "tldr",
        avatarUrl:
          "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/1d3c1cdd-db51-481d-4da2-c438b910b000/rectcrop3",
      },
    ],
  },
];

export default function SuccessStories() {
  return (
    <div className="w-full py-8 md:py-16">
      <h2
        className={`text-2xl md:text-4xl text-purple-600 mb-6 text-center px-4 ${climateCrisis.className}`}
      >
        Success Stories
      </h2>
      <div className="relative mx-auto max-w-[100vw] overflow-hidden">
        <div className="flex overflow-x-hidden">
          <div className="animate-scroll flex gap-4 md:gap-6 pl-4 md:pl-[max(2rem,calc((100vw-1200px)/2))] pr-4 md:pr-[max(2rem,calc((100vw-1200px)/2))]">
            {successStories.map((story) => (
              <div
                key={story.name}
                className="flex-shrink-0 w-[260px] md:w-[300px] bg-white border-2 border-purple-200 rounded-lg p-3 md:p-4 hover:border-purple-400 transition-colors duration-200 flex flex-col"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <Image
                    src={story.logoUrl}
                    alt={`${story.name} logo`}
                    width={32}
                    height={32}
                    className="rounded-lg flex-shrink-0 md:w-10 md:h-10 w-8 h-8"
                  />
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-purple-600">
                      {story.name}
                    </h3>
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] md:text-xs text-purple-400 hover:text-purple-600 transition-colors"
                    >
                      Try it out
                    </a>
                  </div>
                </div>

                <p className="text-gray-600 text-xs md:text-sm mt-2 md:mt-3 min-h-[32px] md:min-h-[40px]">
                  {story.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-auto mb-3 md:mb-4">
                  {story.metrics.map((metric) => (
                    <div key={metric.label} className="text-center">
                      <div className="text-base md:text-lg font-bold text-purple-600">
                        {metric.value}
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-500">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-row items-center gap-2 border-t border-purple-100 pt-2 md:pt-3">
                  <div className="text-[10px] md:text-xs text-gray-500">
                    Built by
                  </div>
                  <div className="flex flex-row -space-x-1">
                    {story.founders.map((founder) => (
                      <div key={founder.username} className="relative group">
                        <a
                          href={`https://warpcast.com/${founder.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center hover:bg-purple-50 p-0.5 rounded-full transition-colors w-[20px] h-[20px] md:w-[24px] md:h-[24px]"
                        >
                          <Image
                            src={founder.avatarUrl}
                            alt={founder.name}
                            width={20}
                            height={20}
                            className="rounded-full ring-2 ring-white w-full h-full object-cover"
                          />
                        </a>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 translate-y-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                          <div className="bg-gray-900 text-white text-[10px] md:text-xs rounded px-2 py-1 animate-fadeIn">
                            @{founder.username}
                          </div>
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {successStories.map((story) => (
              <div
                key={`${story.name}-duplicate`}
                className="flex-shrink-0 w-[260px] md:w-[300px] bg-white border-2 border-purple-200 rounded-lg p-3 md:p-4 hover:border-purple-400 transition-colors duration-200 flex flex-col"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <Image
                    src={story.logoUrl}
                    alt={`${story.name} logo`}
                    width={32}
                    height={32}
                    className="rounded-lg flex-shrink-0 md:w-10 md:h-10 w-8 h-8"
                  />
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-purple-600">
                      {story.name}
                    </h3>
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] md:text-xs text-purple-400 hover:text-purple-600 transition-colors"
                    >
                      Try it out
                    </a>
                  </div>
                </div>

                <p className="text-gray-600 text-xs md:text-sm mt-2 md:mt-3 min-h-[32px] md:min-h-[40px]">
                  {story.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-auto mb-3 md:mb-4">
                  {story.metrics.map((metric) => (
                    <div key={metric.label} className="text-center">
                      <div className="text-base md:text-lg font-bold text-purple-600">
                        {metric.value}
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-500">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-row items-center gap-2 border-t border-purple-100 pt-2 md:pt-3">
                  <div className="text-[10px] md:text-xs text-gray-500">
                    Built by
                  </div>
                  <div className="flex flex-row -space-x-1">
                    {story.founders.map((founder) => (
                      <div key={founder.username} className="relative group">
                        <a
                          href={`https://warpcast.com/${founder.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center hover:bg-purple-50 p-0.5 rounded-full transition-colors w-[20px] h-[20px] md:w-[24px] md:h-[24px]"
                        >
                          <Image
                            src={founder.avatarUrl}
                            alt={founder.name}
                            width={20}
                            height={20}
                            className="rounded-full ring-2 ring-white w-full h-full object-cover"
                          />
                        </a>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 translate-y-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                          <div className="bg-gray-900 text-white text-[10px] md:text-xs rounded px-2 py-1 animate-fadeIn">
                            @{founder.username}
                          </div>
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
