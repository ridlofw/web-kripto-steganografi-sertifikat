"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for active session
    const session = localStorage.getItem("auth_session");
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_session");
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    router.refresh();
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-zinc-50">Loading...</div>;
  }

  // View for Guest (Landing Page)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Web Kripto & Steganografi
      </h1>
      <p className="mt-4 max-w-[700px] text-zinc-500 md:text-xl">
        Amankan sertifikat Anda dengan teknologi enkripsi dan steganografi terkini.
      </p>
      <div className="mt-8 flex gap-4">
        {user ? (
          <Link href="/dashboard">
            <Button size="lg">Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <Button size="lg">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">Daftar</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
