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
