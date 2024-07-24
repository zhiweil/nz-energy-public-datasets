//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import { DatasetBase, DatasetFile, FieldBase, Globals } from "../common";

export enum DispatchAndPricingDatesetType {
  Monthly = "ByMonth",
  Daily = "",
}

export default class DispatchAndPricing extends DatasetBase {
  private static readonly url = `${Globals.EmiHost}/Wholesale/Datasets/DispatchAndPricing/FinalEnergyPrices`;
  private static readonly fileTag = "tbody tr td.two a";
  constructor() {
    super(new FieldBase());
  }

  private getUrl(type: DispatchAndPricingDatesetType): string {
    if (type === DispatchAndPricingDatesetType.Monthly) {
      return `${DispatchAndPricing.url}/${DispatchAndPricingDatesetType.Monthly}`;
    }
    return DispatchAndPricing.url;
  }

  async getDailyFiles(): Promise<DatasetFile[]> {
    let monthlyFiles = await this.getMonthlyFiles();
    let latestMonthlyFileTs = monthlyFiles[0].for;
    let files: DatasetFile[] = [];
    let page = await this.crawler.readPage(
      this.getUrl(DispatchAndPricingDatesetType.Daily)
    );
    let tags = this.crawler.getElementsByTag(DispatchAndPricing.fileTag, page);
    for (let t of tags) {
      let filename = t.attr("href");
      // filtering out irrelevant files
      if (filename?.endsWith(".csv")) {
        let fileParts = filename.split("/");
        let fn = fileParts[fileParts.length - 1];
        let ts = Number(fn.substring(0, 8));
        files.push({
          file: fn,
          updatedAt: t.text(),
          for: ts,
        });
      }
    }

    return files
      .filter((f) => (f.for as number) > (latestMonthlyFileTs as number))
      .sort((a, b) => (b.for as number) - (a.for as number));
  }

  async getMonthlyFiles(): Promise<DatasetFile[]> {
    let files: DatasetFile[] = [];
    let page = await this.crawler.readPage(
      this.getUrl(DispatchAndPricingDatesetType.Monthly)
    );
    let tags = this.crawler.getElementsByTag(DispatchAndPricing.fileTag, page);
    for (let t of tags) {
      let filename = t.attr("href");
      // filtering out irrelevant files
      if (filename?.endsWith(".csv")) {
        let fileParts = filename.split("/");
        let fn = fileParts[fileParts.length - 1];
        let ts = Number(fn.substring(0, 6)) * 100 + 31;
        files.push({
          file: fn,
          updatedAt: t.text(),
          for: ts,
        });
      }
    }

    return files.sort((a, b) => (b.for as number) - (a.for as number));
  }

  async downloadFile(
    type: DispatchAndPricingDatesetType,
    fileName: string,
    localPath: string
  ): Promise<DatasetFile> {
    let files;
    if (type == DispatchAndPricingDatesetType.Daily) {
      files = await this.getDailyFiles();
    } else {
      files = await this.getMonthlyFiles();
    }
    let file = files.find((f) => f.file == fileName);
    if (!file) {
      throw Error(`Unknown dispatch and pricing dataset file: ${fileName}`);
    }

    await this.crawler.downloadFile(
      `${this.getUrl(type)}/${fileName}`,
      localPath
    );

    return { file: localPath, updatedAt: "" };
  }
}
