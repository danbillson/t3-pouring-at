import { useCombobox } from "downshift";
import * as React from "react";
import { cn } from "~/lib/utils";
import { Input } from "./input";

type ComboboxProps = {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (...event: any[]) => void;
  minSearch?: number;
};

export const Combobox = ({
  options,
  minSearch = 2,
  ...props
}: ComboboxProps) => {
  const [items, setItems] = React.useState(options);
  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      props?.onChange?.(inputValue);
      setItems(
        options.filter(
          (option) =>
            option.toLowerCase().includes(inputValue?.toLowerCase() || "") &&
            option !== inputValue
        )
      );
    },
    items,
  });

  return (
    <div className="relative">
      <Input {...getInputProps(props)} autoComplete="off" />
      {isOpen && inputValue.length >= minSearch && items.length !== 0 && (
        <ul className="absolute z-50 max-h-72 w-full min-w-[8rem] translate-y-1 overflow-scroll rounded-md border-2 bg-popover text-popover-foreground shadow-md slide-in-from-top-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95" {...getMenuProps()}>
          {items.sort(byStartsWith(props.value)).map((option, index) => (
            <li
              key={`${option}${index}`}
              {...getItemProps({ item: option, index })}
              className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                highlightedIndex === index &&
                  "bg-accent text-accent-foreground",
                selectedItem === option && "bg-muted text-accent-foreground"
              )}
            >
              {option}
            </li>
          ))}
        </ul>
      )} 
    </div>
  );
};

const byStartsWith = (value: string | undefined) => (a: string, b: string) => {
  if (!value) return 0;

  const aStartsWith = a.toLowerCase().startsWith(value.toLowerCase());
  const bStartsWith = b.toLowerCase().startsWith(value.toLowerCase());

  if (aStartsWith && !bStartsWith) return -1;
  if (!aStartsWith && bStartsWith) return 1;
  return 0;
};
