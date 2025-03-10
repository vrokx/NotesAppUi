"use client";

import React from "react";
import { cn } from "../../lib/utils";

export default function MyInput({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        className
      )}
      {...props}
    />
  );
}
