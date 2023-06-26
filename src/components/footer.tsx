export const Footer = () => {
  return (
    <footer className="w-full border-t text-slate-600">
      <div className="mx-auto w-full max-w-6xl p-8 text-sm">
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
    </footer>
  );
};
