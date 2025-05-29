"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoginClient from "./LoginClient";

function LoginContent() {
  const searchParams = useSearchParams();
  const params = {
    id: searchParams.get('id') || ''
  };
  return <LoginClient params={params} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
} 