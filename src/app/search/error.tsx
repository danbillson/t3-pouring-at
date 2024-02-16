"use client";

export default function SearchError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <p className="pb-4">{prettyError(error)}</p>;
}

const prettyError = (error: { message: string } | undefined) => {
  if (!error) return "Something went wrong...";
  if (error.message === "Invalid address") {
    return "Invalid address, please try a different location or postcode";
  }
};
