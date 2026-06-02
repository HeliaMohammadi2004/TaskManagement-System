"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  // client component -> safe to read localStorage synchronously
  const hasToken = !!localStorage.getItem("access");

  useEffect(() => {
    if (!hasToken) {
      router.replace("/login");
    }
  }, [hasToken, router]);

  if (!hasToken) {
    return <div className="p-8">Redirecting...</div>;
  }

  return <>{children}</>;
}