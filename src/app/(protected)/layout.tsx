import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getServerSession } from "@/lib/auth/server";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession().catch(() => null);

  if (!session) {
    redirect("/");
  }

  return <AppShell session={session}>{children}</AppShell>;
}
