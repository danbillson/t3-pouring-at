"use client";
import { useEffect } from "react";
import { Layout } from "~/components/ui/layout";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error", error);
  }, [error]);
  return <Layout>Sorry, we couldn&apos;t find this bar</Layout>;
}
