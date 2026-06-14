import React, { useState } from 'react';
import css from './SearchBox.module.css'

interface SearchBoxProps {
  onChange: (val: string) => void;
  defaultValue?: string;
}

export default function SearchBox({ onChange, defaultValue = '' }: SearchBoxProps) {
  const [localValue, setLocalValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val); 
    onChange(val);   
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes..."
      value={localValue}
      onChange={handleChange}
    />
  );
}

