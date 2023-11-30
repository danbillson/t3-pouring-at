import { Portal, Content } from "@radix-ui/react-popover";
import { useState } from "react";
import { SketchPicker } from "react-color";
import { Button } from "~/components/ui/button";
import { Popover, PopoverTrigger } from "~/components/ui/popover";

type ColourPickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
};

export const ColourPicker = ({
  value,
  onChange,
  disabled,
}: ColourPickerProps) => {
  const [colour, setColour] = useState(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <span className="mr-3 h-4 w-4 border" style={{ background: value }} />
          {value}
        </Button>
      </PopoverTrigger>
      <Portal>
        <Content sideOffset={4}>
          <SketchPicker
            color={colour}
            onChange={(color) => setColour(color.hex)}
            onChangeComplete={(color) => onChange(color.hex)}
          />
        </Content>
      </Portal>
    </Popover>
  );
};
