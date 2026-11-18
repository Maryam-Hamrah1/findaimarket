import { ChevronDown } from 'lucide-react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

/* Labelled form controls with required marker, hint and error message. */

interface FieldShellProps {
  id: string
  label: string
  /** true shows "*", false shows "(optional)" */
  required: boolean
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}

function FieldShell({
  id,
  label,
  required,
  error,
  hint,
  children,
  className = '',
}: FieldShellProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
        {required ? (
          <span className="ml-1 text-accent" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-muted">(optional)</span>
        )}
      </label>

      {children}

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

const CONTROL =
  'min-h-12 w-full rounded-xl border bg-surface px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60'

function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  containerClassName?: string
  /** Control placed inside the right edge of the input, e.g. a show/hide button */
  trailing?: ReactNode
}

export function TextField({
  id,
  label,
  required = false,
  error,
  hint,
  containerClassName,
  trailing,
  className = '',
  ...input
}: TextFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={containerClassName}
    >
      <div className="relative">
        <input
          id={id}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, hint)}
          className={`${CONTROL} ${error ? 'border-danger' : 'border-brand-border'} ${trailing ? 'pr-12' : ''} ${className}`}
          {...input}
        />
        {trailing && (
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</div>
        )}
      </div>
    </FieldShell>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  containerClassName?: string
}

export function SelectField({
  id,
  label,
  required = false,
  error,
  hint,
  containerClassName,
  children,
  className = '',
  ...select
}: SelectFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={containerClassName}
    >
      <div className="relative">
        <select
          id={id}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, hint)}
          className={`${CONTROL} cursor-pointer appearance-none pr-11 [color-scheme:dark] ${error ? 'border-danger' : 'border-brand-border'} ${className}`}
          {...select}
        >
          {children}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  containerClassName?: string
  /** Shows "12 / 500" under the field */
  maxCharacters?: number
}

export function TextAreaField({
  id,
  label,
  required = false,
  error,
  hint,
  containerClassName,
  maxCharacters,
  className = '',
  value,
  ...area
}: TextAreaFieldProps) {
  const length = typeof value === 'string' ? value.length : 0

  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={containerClassName}
    >
      <textarea
        id={id}
        value={value}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        className={`${CONTROL} min-h-28 resize-y py-3 leading-6 ${error ? 'border-danger' : 'border-brand-border'} ${className}`}
        {...area}
      />
      {maxCharacters !== undefined && (
        <p
          className={`text-right text-xs ${length > maxCharacters ? 'text-danger' : 'text-muted'}`}
          aria-hidden="true"
        >
          {length} / {maxCharacters}
        </p>
      )}
    </FieldShell>
  )
}
