import { Check, Circle } from "lucide-react";
import { PASSWORD_RULES } from "@/lib/validations/password-rules";

interface PasswordRequirementsProps {
  value: string;
  id?: string;
}

export default function PasswordRequirements({
  value,
  id,
}: PasswordRequirementsProps) {
  return (
    <ul id={id} className="mx-auto w-full space-y-1 md:w-64">
      {PASSWORD_RULES.map((rule) => {
        const isValid = rule.test(value);

        return (
          <li
            key={rule.id}
            className={`flex items-center gap-2 text-xs ${
              isValid ? "text-green-700" : "text-gray-500"
            }`}
          >
            {isValid ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Circle className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{rule.label}</span>
            <span className="sr-only">
              {isValid ? "(respecté)" : "(non respecté)"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
