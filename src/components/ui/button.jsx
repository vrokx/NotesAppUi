"use client";

import React from "react";
import { cn } from "../../lib/utils";

const variants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-gray-300 hover:bg-gray-50",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

export default function MyButton({
  children,
  className,
  variant = "default",
  ...props
}) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
