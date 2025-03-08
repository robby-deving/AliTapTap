import { Button } from "@/components/ui/button";

type ButtonOutlineProps = {
  text: string; // Custom text for different pages
  onClick?: () => void; // Function to handle button click
  disabled?: boolean; // Optional: Disable button if needed
  className?: string; // Optional: Add custom styles
  
};

export function ButtonOutline({ text, onClick, disabled, className }: ButtonOutlineProps) {
  return (
    <Button 
      variant="outline" 
      onClick={onClick} 
      disabled={disabled}
      className={`cursor-pointer hover:bg-gray-200 text-[#232323] border !border-[#E4E4E7] ${className}`}
    >
      {text}
    </Button>
  );
}