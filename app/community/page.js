import CommunityBoardClient from "./board-client";

export const metadata = {
  title: "후기 게시판",
  description: "고객 후기와 문의를 확인할 수 있는 커뮤니티 게시판입니다."
};

export default function CommunityPage() {
  return <CommunityBoardClient />;
}
