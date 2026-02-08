"use client";

import { use } from "react";
import PublicPortfolio from "@/components/public/PublicPortfolio";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function UserPortfolioPage({ params }: PageProps) {
  const { username } = use(params);
  return <PublicPortfolio username={username} />;
}
