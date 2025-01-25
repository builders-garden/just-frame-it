import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/images/feed.png`,
  button: {
    title: "Apply Now",
    action: {
      type: "launch_frame",
      name: "Just Frame It",
      url: appUrl,
      splashImageUrl: `${appUrl}/images/splash.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Just Frame It",
    openGraph: {
      title: "Just Frame It",
      description: "Build sprint to reframe the future of social feeds",
      images: [
        {
          url: `${appUrl}/images/preview.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
