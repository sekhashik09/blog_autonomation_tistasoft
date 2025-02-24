"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    HSStaticMethods: {
      autoInit: () => void;
    };
  }
}

export default function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [path]);

  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/preline@2.0.3/dist/preline.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.HSStaticMethods?.autoInit();
      }}
    />
  );
}