"use client";

import dynamic from "next/dynamic";

const CreateTripClient = dynamic(() => import("./CreateTripClient"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function CreateTripPage() {
  return <CreateTripClient />;
}
