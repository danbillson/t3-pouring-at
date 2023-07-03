import type { PropsWithChildren } from "react";

export const Layout = (props: PropsWithChildren) => {
  return (
    <main className="container">
      <div className="flex w-full flex-col gap-12 px-8 py-16">
        {props.children}
      </div>
    </main>
  );
};
