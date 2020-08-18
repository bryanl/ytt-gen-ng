import { Injectable } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Type } from 'yaml/util';
import * as YAML from 'yaml';
import { ParsedCST } from 'yaml/parse-cst';

@Injectable({
  providedIn: 'root',
})
export class ValuesService {
  constructor() {}

  objectValidators(types: string[]): ValidatorFn[] {
    return [Validators.required, this.valueValidator(types)];
  }

  valueValidator(types: string[]): ValidatorFn {
    const typesToString = (): string => {
      return `[${types.join(', ')}]`;
    };
    const typesSting = typesToString();

    return (control: AbstractControl): ValidationErrors | null => {
      let docs: ParsedCST;

      try {
        docs = YAML.parseCST(control.value);
      } catch (e) {
        return validatorErrorFor(ValidatorMessages.ParseError);
      }
      if (docs.length !== 1) {
        return validatorErrorFor(ValidatorMessages.ParseError);
      }

      const doc = docs[0];
      if (doc.contents.length !== 1) {
        return validatorErrorFor(`Unable to parse the value as ${typesSting}.`);
      }

      const content = doc.contents[0];

      switch (content.type) {
        case Type.PLAIN:
          return handlePlain(types, control.value);
        case Type.FLOW_SEQ:
        case Type.SEQ:
          return handleArray(control.value);
        case Type.FLOW_MAP:
        case Type.MAP:
          return handleObject(control.value);
        default:
          return validatorErrorFor(`Unknown type ${content.type}`);
      }
    };
  }
}

const handlePlain = (
  types: string[],
  value: string
): ValidationErrors | null => {
  if (types.includes('string')) {
    return null;
  }

  if (types.includes('integer')) {
    return checkInt(value);
  }

  if (types.includes('number')) {
    return checkFloat(value);
  }

  if (types.includes('boolean')) {
    return checkBoolean(value);
  }
  return validatorErrorFor(ValidatorMessages.UnknownPlain);
};

const handleArray = (value: string): ValidationErrors | null => {
  try {
    const a = YAML.parse(value);
    if (Array.isArray(a)) {
      return null;
    }

    return validatorErrorFor(ValidatorMessages.ExpectedArray);
  } catch (e) {
    return validatorErrorFor(ValidatorMessages.ExpectedArray);
  }
};

const handleObject = (value: string): ValidationErrors | null => {
  try {
    const o = YAML.parse(value);
    if (typeof o === 'object') {
      return null;
    }
    return validatorErrorFor(ValidatorMessages.ExpectedObject);
  } catch (e) {
    return validatorErrorFor(ValidatorMessages.ExpectedObject);
  }
};

const checkInt = (value: string): ValidationErrors => {
  const n = Number(value);

  if (isNaN(n)) {
    return validatorErrorFor(ValidatorMessages.ExpectedInteger);
  } else if (n % 1 !== 0) {
    return validatorErrorFor(ValidatorMessages.ExpectedInteger);
  }

  return null;
};

const checkFloat = (value: string): ValidationErrors => {
  const n = Number(value);

  if (isNaN(n)) {
    return validatorErrorFor(ValidatorMessages.ExpectedFloat);
  }

  return null;
};

const checkBoolean = (value: string): ValidationErrors => {
  if (value === 'true' || value === 'false') {
    return null;
  }

  return validatorErrorFor(ValidatorMessages.ExpectedBoolean);
};

export const validatorErrorFor = (v): ValidationErrors => {
  return { error: v };
};

export enum ValidatorMessages {
  ParseError = 'Unable to parse the value.',
  ExpectedArray = 'Expected value to be an array.',
  ExpectedBoolean = 'Expected value to be a boolean.',
  ExpectedFloat = 'Expected value to be a float.',
  ExpectedInteger = 'Expected value to be an integer.',
  ExpectedObject = 'Expected value to be an object.',
  UnknownPlain = 'Unable to determine plain value type.',
}
