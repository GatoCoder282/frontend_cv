"use client";

import PublicPortfolio from "@/components/public/PublicPortfolio";

export default function Home() {
  const defaultUsername = process.env.NEXT_PUBLIC_DEFAULT_USERNAME || 'droyy282';
  return <PublicPortfolio username={defaultUsername} />;
}