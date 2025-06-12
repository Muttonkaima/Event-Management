import * as React from "react";
import { Input } from "./input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  toggleAriaLabel?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, type = "password", toggleAriaLabel = "Toggle password visibility", ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    const handleToggle = () => setShow((s) => !s);
    return (
      <div className="relative flex-1">
        <Input
          {...props}
          ref={ref}
          type={show ? "text" : "password"}
          className={className}
        />
        <button
          type="button"
          aria-label={toggleAriaLabel}
          tabIndex={0}
          onClick={handleToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 focus:outline-none"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
