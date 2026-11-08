import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div className="mx-auto flex w-full flex-col md:w-64">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}
      </label>

      <input
        id={id}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none bg-white text-gray-900 placeholder-gray-400 transition-colors ${className}`}
        {...props}
      />

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
