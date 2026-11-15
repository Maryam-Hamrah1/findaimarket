import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export default function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || props.name

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-foreground"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`
          w-full rounded-xl border bg-surface px-4 py-3
          text-sm text-foreground outline-none
          placeholder:text-muted
          transition-all duration-200
          focus:border-accent focus:ring-2 focus:ring-accent/20
          disabled:cursor-not-allowed disabled:opacity-60
          ${error ? 'border-danger' : 'border-brand-border'}
          ${className}
        `}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : undefined
        }
        {...props}
      />

      {error && (
        <span
          id={`${inputId}-error`}
          className="text-xs text-danger"
        >
          {error}
        </span>
      )}

      {!error && helperText && (
        <span className="text-xs text-muted">
          {helperText}
        </span>
      )}
    </div>
  )
}
