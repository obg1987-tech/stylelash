import CommunityBoardClient from "./board-client";

export const metadata = {
  title: "커뮤니티 게시판",
  description: "STYLE LASH 고객 후기와 문의를 확인할 수 있는 커뮤니티 게시판입니다.",
  alternates: {
    canonical: "/community"
  },
  openGraph: {
    title: "STYLE LASH 커뮤니티 게시판",
    description: "고객 후기와 문의를 확인해 보세요.",
    url: "/community"
  }
};

export default function CommunityPage() {
  return <CommunityBoardClient />;
}
