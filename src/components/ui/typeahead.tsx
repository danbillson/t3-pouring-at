import * as React from "react";
import { useClickAway } from "react-use";
import { cn } from "~/lib/utils";
import { Input } from "./input";

type ContentProps = {
  children: React.ReactNode;
  open: boolean;
  className?: string;
};

const Content = ({ className, open, children }: ContentProps) => {
  return (
    <div
      role="listbox"
      className={cn(
        "absolute z-50 max-h-72 w-full min-w-[8rem] translate-y-1 overflow-scroll rounded-md border-2 bg-popover text-popover-foreground shadow-md slide-in-from-top-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      data-state={open ? "open" : "closed"}
    >
      <div
        role="presentation"
        className={cn(
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] p-1"
        )}
      >
        {children}
      </div>
    </div>
  );
};

type TypeAheadProps = {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (...event: any[]) => void;
};

export const TypeAhead = ({ options, ...props }: TypeAheadProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [focused, setFocused] = React.useState(false);
  const length = props.value?.length || 0;
  const open = length >= 2 && focused;
  useClickAway(ref, () => setFocused(false));

  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(props.value?.toLowerCase() || "") &&
      option !== props.value
  );

  return (
    <div ref={ref} className="relative">
      <Input {...props} onFocus={() => setFocused(true)} autoComplete="off" />
      {open && filteredOptions.length !== 0 && (
        <Content open={open}>
          {filteredOptions.map((option) => (
            <div
              key={option}
              role="option"
              aria-selected={props.value === option}
              onClick={() => {
                props.onChange?.(option);
                setFocused(false);
              }}
              className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              {option}
            </div>
          ))}
        </Content>
      )}
    </div>
  );
};
