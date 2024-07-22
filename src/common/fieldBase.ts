//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

export interface Field {
  field: string;
  value: string;
  index?: number;
}

export class FieldBase {
  Fields: Field[];
  FieldType: string;

  constructor() {
    this.Fields = [];
    this.FieldType = "FieldBase";
  }

  public valueByField(field: string): string {
    const f = this.Fields.find((f) => f.field === field);
    if (f) {
      return f.value;
    } else {
      throw new Error(`${this.FieldType}_FIELD_NOT_FOUND: ${field}`);
    }
  }

  public fieldByValue(value: string) {
    const f = this.Fields.find((f) => f.value === value);
    if (f) {
      return f.field;
    } else {
      throw new Error(`${this.FieldType}_VALUE_NOT_FOUND: ${value}`);
    }
  }
}
