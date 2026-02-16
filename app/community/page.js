import CommunityBoardClient from "./board-client";

export const metadata = {
  title: "STYLE LASH | Community Board",
  description: "Read customer reviews and questions, and share your experience with STYLE LASH.",
  alternates: {
    canonical: "/community"
  },
  openGraph: {
    title: "STYLE LASH | Community Board",
    description: "Read customer reviews and questions, and share your experience with STYLE LASH.",
    url: "/community"
  }
};

export default function CommunityPage() {
  return <CommunityBoardClient />;
}

