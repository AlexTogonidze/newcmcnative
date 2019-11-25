import React, { useState } from 'react';

export interface UseFormResult {
  isValid: boolean
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>
  isSubmited: boolean
  setIsSubmited: React.Dispatch<React.SetStateAction<boolean>>
}

export function useForm(): UseFormResult {
  var [isValid, setIsValid] = useState(false);
  var [isSubmited, setIsSubmited] = useState(false);
  return {
    isValid,
    setIsValid,
    isSubmited,
    setIsSubmited
  };
}

declare type OnChangeHandler<T> = (value: T) => void;

export interface UseFieldResult<T> {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  errorText: string;
  setErrorText: React.Dispatch<React.SetStateAction<string>>;
  onChange: OnChangeHandler<T>;
}
export function useField<T>(defaultValue: T): UseFieldResult<T> {
  var [value, setValue] = useState(defaultValue);
  var [errorText, setErrorText] = useState('');
  function handleChange(value: T) {
    setValue(value);
  }
  return {
    value,
    setValue,
    errorText,
    setErrorText,
    onChange: handleChange
  };
}

export function validateRequiredField(field: UseFieldResult<any>, errorText: string) {
  if (typeof (field.value) == "string" && field.value && field.value.trim() == "") {
    field.setErrorText(errorText);
    return false;
  }

  if (field.value) {
    field.setErrorText('');
    return true;
  }

  field.setErrorText(errorText);
  return false;
}

const URL_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const BETWEEN_6_24_CHARS = /^(?:.{6,24}|)$/i;

export function validateUrl(field: UseFieldResult<string>, errorText: string) {
  if (URL_REGEX.test(field.value)) {
    field.setErrorText('');
    return true;
  }

  field.setErrorText(errorText);
  return false;
}

export function validateEmail(field: UseFieldResult<string>, errorText: string) {
  if (EMAIL_REGEX.test(field.value)) {
    field.setErrorText('');
    return true;
  }

  field.setErrorText(errorText);
  return false;
}

export function validatePassword(field: UseFieldResult<string>, errorText: string) {
  if (BETWEEN_6_24_CHARS.test(field.value)) {
    field.setErrorText('');
    return true;
  }

  field.setErrorText(errorText);
  return false;
}

export function makeSureSeparatedDateIsNotInFuture(virtualField: UseFieldResult<any>, value: Date, errorText: string) {
  if (value && (value > new Date())) {
    virtualField.setErrorText(errorText);
    return false;
  }
  virtualField.setErrorText('');
  return true;
}

export function validateSeparatedDate(virtualField: UseFieldResult<any>,
  year: number | null,
  month: number | null,
  day: number | null,
  errorText: string
) {
  if (!(year && month && day)) {
    virtualField.setErrorText(errorText);
    return false;
  }

  virtualField.setErrorText('');
  return true;
}

export function validateSeparatedYear(virtualField: UseFieldResult<any>,
  year: number | null,
  errorText: string
) {
  if (!(year)) {
    virtualField.setErrorText(errorText);
    return false;
  }

  virtualField.setErrorText('');
  return true;
}

export function validateDateInterval(virtualField: UseFieldResult<any>,
  from: Date,
  to: Date,
  errorText: string
) {
  if (from > to) {
    virtualField.setErrorText(errorText);
    return false;
  }

  virtualField.setErrorText('');
  return true;
}



