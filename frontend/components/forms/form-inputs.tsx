"use client";

import * as React from "react";
import { Eye, EyeOff, Search, Calendar, UploadCloud, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

// 1. Label
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-semibold text-slate-700 dark:text-slate-300 select-none flex items-center gap-0.5", className)}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 font-bold">*</span>}
    </label>
  )
);
Label.displayName = "Label";

// 2. Helper Text & Validation Text
export const HelperText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-xs text-slate-500 dark:text-slate-400 mt-1.5", className)}>{children}</p>
);

export const ValidationText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-xs text-red-500 font-medium mt-1.5 animate-fade-in", className)}>{children}</p>
);

// 3. Input Primitive (Supports errors)
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// 4. Password Input
export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className="relative w-full">
        <Input
          type={show ? "text" : "password"}
          ref={ref}
          className={cn("pr-10", className)}
          error={error}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
        >
          {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

// 5. Search Input
export interface SearchInputProps extends InputProps {
  onClear?: () => void;
}
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
        <Input
          type="text"
          ref={ref}
          className={cn("pl-10", className)}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

// 6. Textarea
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-[100px] px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// 7. Select
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "w-full h-11 px-4 pr-10 rounded-xl border border-border bg-background text-sm text-foreground appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled selected>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

// 8. MultiSelect (Interactive selector mockup)
interface MultiSelectProps {
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: boolean;
}
export function MultiSelect({ options, selectedValues, onChange, placeholder = "Select multiple...", error }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelect = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full min-h-11 px-3 py-2 flex flex-wrap gap-1.5 rounded-xl border border-border bg-background text-sm cursor-pointer select-none items-center pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20",
          error && "border-red-500",
          open && "ring-2 ring-primary/20 border-primary"
        )}
      >
        {selectedValues.length === 0 ? (
          <span className="text-slate-400 px-1">{placeholder}</span>
        ) : (
          selectedValues.map((v) => {
            const label = options.find((o) => o.value === v)?.label || v;
            return (
              <span
                key={v}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg bg-primary/10 text-primary"
              >
                {label}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(v);
                  }}
                  className="hover:text-blue-800 transition-colors"
                >
                  &times;
                </button>
              </span>
            );
          })
        )}
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
      </div>

      {open && (
        <div className="absolute z-10 w-full mt-2 rounded-xl border border-border bg-card shadow-elevated py-1 max-h-60 overflow-y-auto animate-slide-up">
          {options.map((opt) => {
            const isSelected = selectedValues.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleSelect(opt.value)}
                className={cn(
                  "flex justify-between items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-muted cursor-pointer transition-colors",
                  isSelected && "bg-primary/5 text-primary dark:text-blue-400"
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 9. Checkbox
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const defaultId = React.useId();
    const activeId = id || defaultId;

    return (
      <div className="flex items-center gap-2.5 select-none">
        <input
          type="checkbox"
          id={activeId}
          ref={ref}
          className={cn(
            "h-5 w-5 rounded-lg border-border text-primary focus:ring-primary/20 focus:ring-2 bg-background accent-primary cursor-pointer disabled:opacity-50",
            className
          )}
          {...props}
        />
        <label htmlFor={activeId} className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer disabled:opacity-50">
          {label}
        </label>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

// 10. Switch/Toggle Slider
interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
export function Switch({ label, checked, onCheckedChange, id, className, ...props }: SwitchProps) {
  const defaultId = React.useId();
  const activeId = id || defaultId;

  return (
    <div className="flex items-center gap-3 select-none">
      <button
        type="button"
        id={activeId}
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30",
          checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-800",
          className
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-soft ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      {label && (
        <label htmlFor={activeId} className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
}

// 11. DatePickerPlaceholder
interface DatePickerPlaceholderProps {
  label?: string;
  value?: string;
  onClick?: () => void;
  error?: boolean;
}
export function DatePickerPlaceholder({ label, value, onClick, error }: DatePickerPlaceholderProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <Label>{label}</Label>}
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "w-full h-11 px-4 flex items-center justify-between rounded-xl border border-border bg-background text-sm text-slate-700 dark:text-slate-300 hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
          error && "border-red-500",
          !value && "text-slate-400"
        )}
      >
        <span>{value || "Select date..."}</span>
        <Calendar className="h-4.5 w-4.5 text-slate-400" />
      </button>
    </div>
  );
}

// 12. FileUploadPlaceholder
interface FileUploadPlaceholderProps {
  label?: string;
  helperText?: string;
  onUploadClick?: () => void;
}
export function FileUploadPlaceholder({ label, helperText = "SVG, PNG, JPG or PDF (MAX. 5MB)", onUploadClick }: FileUploadPlaceholderProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <Label>{label}</Label>}
      <div
        onClick={onUploadClick}
        className="w-full border-2 border-dashed border-border hover:border-primary/50 dark:hover:border-blue-400/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-card transition-colors group"
      >
        <UploadCloud className="h-10 w-10 text-slate-400 group-hover:text-primary transition-colors mb-3" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Click to upload <span className="text-primary group-hover:underline">or drag and drop</span>
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{helperText}</p>
      </div>
    </div>
  );
}
