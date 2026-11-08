export const fieldStyles =
  "w-full rounded-lg border border-primary bg-white px-3 py-2 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string; // lu par les lecteurs d'écran, masqué visuellement
}

export default function TextField({
  id,
  label,
  className = "",
  ...props
}: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input id={id} className={`${fieldStyles} ${className}`} {...props} />
    </div>
  );
}
