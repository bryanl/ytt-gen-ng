import { TestBed } from '@angular/core/testing';

import {
  validatorErrorFor,
  ValidatorMessages,
  ValuesService,
} from './values.service';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

describe('ValuesService', () => {
  let service: ValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('valueValidator', () => {
    interface Test {
      name: string;
      args: {
        types: string[];
        control: AbstractControl;
      };
      want: ValidationErrors | null;
    }

    const tests: Test[] = [
      {
        name: 'types include string and value is a string',
        args: { types: ['string'], control: new FormControl('value') },
        want: null,
      },
      {
        name: 'types does not includes string and value is a string',
        args: { types: [], control: new FormControl('value') },
        want: validatorErrorFor(ValidatorMessages.UnknownPlain),
      },
      {
        name: 'types includes integer and value is an integer',
        args: { types: ['integer'], control: new FormControl('9') },
        want: null,
      },
      {
        name: 'types includes number and value is a float',
        args: { types: ['number'], control: new FormControl('9.0') },
        want: null,
      },
      {
        name: 'types includes boolean and value is a boolean',
        args: { types: ['boolean'], control: new FormControl('true') },
        want: null,
      },
      {
        name: 'types includes boolean and value is not a boolean',
        args: { types: ['boolean'], control: new FormControl('9') },
        want: validatorErrorFor(ValidatorMessages.ExpectedBoolean),
      },
      {
        name: 'types includes array and value is an inline array',
        args: { types: ['array'], control: new FormControl('[1,2,3,4]') },
        want: null,
      },
      {
        name: 'types includes array and value is an array',
        args: { types: ['array'], control: new FormControl('- 1') },
        want: null,
      },
      {
        name: 'types includes object and value is an inline object',
        args: { types: ['object'], control: new FormControl('{foo: "bar"}') },
        want: null,
      },
      {
        name: 'types includes object and value is an object',
        args: { types: ['object'], control: new FormControl('foo: "bar"') },
        want: null,
      },
    ];

    tests.forEach((tt) => {
      it(tt.name, () => {
        expect(service.valueValidator(tt.args.types)(tt.args.control)).toEqual(
          tt.want
        );
      });
    });
  });
});
