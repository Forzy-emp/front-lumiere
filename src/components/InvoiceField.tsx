import { useId } from 'react';

interface InvoiceFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  type?: 'number' | 'date';
}

export function InvoiceField({ label, value, onChange, required, type = 'number' }: InvoiceFieldProps) {
  const id = useId();
  return <div className="min-w-0">
    <label htmlFor={id} className="ui-label">{label}{required && <span className="text-blue-600 dark:text-blue-400"> *</span>}</label>
    <input id={id} type={type} step={type === 'number' ? 'any' : undefined}
      inputMode={type === 'number' ? 'decimal' : undefined} value={value}
      onChange={event => onChange(event.target.value)} required={required}
      className="ui-input" />
  </div>;
}
