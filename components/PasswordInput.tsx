import React, { ChangeEvent } from "react";

interface PasswordInputProps {
  password: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleBlur: () => void;
}

// Password input component with additional handlers for focus and blur events
const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  handleChange,
  handleFocus,
  handleBlur,
}) => {
  return (
    <div className="flex items-center justify-center my-5">
      <input
        type="password"
        className={`
          nx-appearance-none nx-transition-colors
          rounded-l-lg rounded-r-none px-3 py-2 h-[33.5px]
          nx-text-sm nx-leading-tight text-center
          nx-bg-black/[.05] dark:nx-bg-gray-50/10
          focus:nx-bg-white dark:focus:nx-bg-dark
          placeholder:nx-text-gray-500 dark:placeholder:nx-text-gray-400
          focus:placeholder:opacity-0
          contrast-more:nx-border contrast-more:nx-border-current
        `}
        value={password}
        onChange={handleChange}
        onFocus={handleFocus} // Clear messages on focus
        onBlur={handleBlur} // Clear messages on blur
        placeholder="Please enter password"
        required // Require input for form submission
      />
      <button
        type="submit"
        className={`
        nx-appearance-none nx-transition-all active:nx-opacity-50
        rounded-r-lg rounded-l-none p-2 h-[33.5px]
        nx-bg-black/[.05] dark:nx-bg-gray-50/10
        nx-text-gray-500 dark:nx-text-gray-400
        hover:nx-text-gray-900 dark:hover:nx-text-gray-50
        `}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-[1.125rem] w-[1.125rem]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
            className="nx-origin-center nx-transition-transform rtl:-nx-rotate-180"
          ></path>
        </svg>
      </button>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(PasswordInput);
