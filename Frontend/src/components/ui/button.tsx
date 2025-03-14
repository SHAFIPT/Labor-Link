import React from "react";

interface ButtonProps {
  onClick?: () => void;  // Function type, optional
  children: React.ReactNode;  // React nodes (text, elements, etc.)
  className?: string;  // Optional className for styling
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = "" }) => {
  return (
    <button
      className={`bg-[#21A391] focus:outline-none hidden lg:block md:hidden text-white p-3 w-[220px] rounded-xl ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
