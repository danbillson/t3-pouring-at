import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t">
      <div className="container p-8 pb-0 text-sm">
        Built by{" "}
        <a
          href="https://danbillson.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          danbillson
        </a>
        . Found some good beers?{" "}
        <a
          href="https://ko-fi.com/danbillson"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Support me
        </a>
      </div>
      <div className="container p-8 text-sm text-muted-foreground underline">
        <Link href="/privacy">Privacy Policy</Link>
      </div>
    </footer>
  );
};
