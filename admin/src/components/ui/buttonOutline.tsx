import React from "react";
import { Button } from "@/components/ui/button";

type ButtonOutlineProps = {
  text: string; // Custom text for different pages
  onClick?: () => void; // Function to handle button click
  disabled?: boolean; // Optional: Disable button if needed
  className?: string; // Optional: Add custom styles
  
};

export const ButtonOutline = React.forwardRef<HTMLButtonElement, ButtonOutlineProps>(
  ({ text, onClick, disabled, className, ...props }, ref) => {
  return (
    <Button
      ref={ref} 
      variant="outline" 
      onClick={onClick} 
      disabled={disabled}
      className={`cursor-pointer hover:bg-gray-200 text-[#232323] border !border-[#E4E4E7] ${className}`}
      {...props}
    >
      {text}
    </Button>
  );
}
);

ButtonOutline.displayName = "ButtonOutline";