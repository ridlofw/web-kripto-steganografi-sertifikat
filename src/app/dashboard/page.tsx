"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("auth_session");
    if (!session) {
      router.push("/login");
    } else {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-50">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">buat beranda disini bang</h1>
    </div>
  );
}
