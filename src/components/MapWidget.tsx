"use client";

import dynamic from "next/dynamic";

// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface-variant">
      <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
    </div>
  ),
});

export default function MapWidget() {
  return <Map />;
}
