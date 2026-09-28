import { createFileRoute } from "@tanstack/react-router";
import { CompressorApp } from "@/components/compressor-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <CompressorApp />;
}
