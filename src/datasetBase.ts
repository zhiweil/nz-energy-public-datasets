import Crawler from "./crawler";
import { Field, FieldBase } from "./fieldBase";

export default class DatasetBase {
  crawler: Crawler;
  fields: FieldBase;

  constructor(fields: FieldBase) {
    this.crawler = new Crawler();
    this.fields = fields;
  }

  checkHeaderRow(header: string[]) {
    if (header.length != this.fields.Fields.length) {
      throw new Error("Header row length is not equal to field count");
    }
    for (let i = 0; i < header.length; i++) {
      if (this.fields.Fields[i].value != header[i]) {
        throw new Error(
          `Header at index ${i} does not match: "${this.fields.Fields[i].value}" and "${header[i]}"`
        );
      }
    }
    return true;
  }

  extractString(pJson: any, field: string): string {
    return (pJson[this.fields.valueByField(field)] ?? "") as string;
  }

  extractStringArray(pJson: any, field: string): string[] {
    let str = this.extractString(pJson, field).trim();
    let arr: string[] = [];
    if (str.length > 0) {
      arr = str.split(",").map((c) => c.trim());
    }
    return arr;
  }

  extractStringByIndex(pJson: string[], index: number): string {
    return (pJson[index] ?? "") as string;
  }

  extractBoolean(pJson: any, field: string): boolean {
    return (
      (
        (pJson[this.fields.valueByField(field)] ?? "") as string
      ).toUpperCase() === "X"
    );
  }
}
