import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ButtonIconProps = {
  direction: "left" | "right" | "double-left" | "double-right";
  onClick: () => void; // Ensure TypeScript knows this is a function
  disabled?: boolean;
};

export function ButtonIcon({ direction }: ButtonIconProps) {
  let Icon;

  switch (direction) {
    case "double-left":
      Icon = ChevronsLeft;
      break;
    case "left":
      Icon = ChevronLeft;
      break;
    case "right":
      Icon = ChevronRight;
      break;
    case "double-right":
      Icon = ChevronsRight;
      break;
    default:
      Icon = ChevronRight;
  }

  return (
    <Button variant="outline" size="icon" className="border-[#E4E4E7]">
      <Icon className="h-4 w-4 text-[#232323]" />
    </Button>
  );
}