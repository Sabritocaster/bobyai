import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/server";
import { LandingHero } from "@/components/landing/LandingHero";

export default async function LandingPage() {
  const session = await getServerSession().catch(() => null);

  if (session) {
    redirect("/chat");
  }

  return <LandingHero />;
}
