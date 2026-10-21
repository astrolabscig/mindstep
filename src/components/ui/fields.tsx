import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

const fieldBase =
  "w-full rounded-lg border border-forest-100 bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-mist/70 focus:border-forest-500 focus:outline-2 focus:outline-offset-2 focus:outline-quietblue-600 disabled:opacity-60";

export function Field({
  label,
  error,
  hint,
  htmlFor,
  required,
  children,
  className,
}: {
  label: string;
  error?: string;
  hint?: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-forest">
        {label}
        {required ? <span aria-hidden="true" className="ml-0.5 text-incorrect">*</span> : null}
      </label>
      {children}
      {hint && !error ? <p id={`${htmlFor}-hint`} className="text-xs text-mist">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-[#a3532b]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({ className, ariaDescribedBy, ...props }: InputHTMLAttributes<HTMLInputElement> & { ariaDescribedBy?: string }) {
  return <input className={cn(fieldBase, className)} aria-describedby={ariaDescribedBy} {...props} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-24 resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, "appearance-none pr-8", className)} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({ label, id, ...props }: { label: string; id: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-start gap-2.5">
      <input
        id={id}
        type="checkbox"
        className="mt-1 h-5 w-5 rounded border-forest-100 accent-forest-600"
        {...props}
      />
      <label htmlFor={id} className="text-sm leading-snug text-ink">
        {label}
      </label>
    </div>
  );
}
