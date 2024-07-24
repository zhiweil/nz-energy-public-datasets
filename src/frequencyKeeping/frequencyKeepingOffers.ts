//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import { DatasetBase, DatasetFields, DatasetFile, Globals } from "../common";

export enum FrequencyKeepingOfferDatasetType {
  OFFERS = "Offers",
  DISPATCHED_OFFERS = "DispatchedOffers",
}

export default class FrequencyKeepingOffers extends DatasetBase {
  private static readonly url = `${Globals.EmiHost}/Wholesale/Datasets/FrequencyKeeping`;
  private static readonly yearTag = "tbody tr td a";
  private static readonly fileTag = "tbody tr td.two a";

  private getUrl(type: FrequencyKeepingOfferDatasetType): string {
    return `${FrequencyKeepingOffers.url}/${type}/New`;
  }

  private getUrlWithYear(
    type: FrequencyKeepingOfferDatasetType,
    year: number
  ): string {
    return `${FrequencyKeepingOffers.url}/${type}/New/${year}`;
  }

  constructor() {
    super(new DatasetFields("FrequencyKeepingField"));
  }

  async getYearList(type: FrequencyKeepingOfferDatasetType): Promise<number[]> {
    let yearList: number[] = [];
    let p = this.getUrl(type);
    let page = await this.crawler.readPage(p);
    let tags = this.crawler.getElementsByTag(
      FrequencyKeepingOffers.yearTag,
      page
    );
    for (let tag of tags) {
      let y = Number(tag.text());
      if (isNaN(y)) {
        continue;
      }
      yearList.push(y);
    }

    return yearList.sort((a, b) => b - a);
  }

  async getFileListByYear(
    type: FrequencyKeepingOfferDatasetType,
    year: number
  ): Promise<DatasetFile[]> {
    let files: DatasetFile[] = [];
    let p = this.getUrlWithYear(type, year);
    let page = await this.crawler.readPage(p);
    let tags = this.crawler.getElementsByTag(
      FrequencyKeepingOffers.fileTag,
      page
    );
    for (let tag of tags) {
      let href = tag.attr("href");
      if (!href) {
        continue;
      }
      let fileParts = href.split("/");
      let nameParts = fileParts[fileParts.length - 1].split("_");
      let f = Number(nameParts[0]);
      if (isNaN(f)) {
        throw new Error(
          `Invalid file name: ${fileParts[fileParts.length - 1]}`
        );
      }
      files.push({
        file: fileParts[fileParts.length - 1],
        updatedAt: tag.text().trim(),
        for: f,
      });
    }

    return files.sort((a, b) => (b.for ?? 0) - (a.for ?? 0));
  }

  async downloadFile(
    type: FrequencyKeepingOfferDatasetType,
    year: number,
    fileName: string,
    localPath: string
  ): Promise<DatasetFile> {
    let files = await this.getFileListByYear(type, year);
    let file = files.find((f) => f.file == fileName);
    if (!file) {
      throw Error(`Unknown freequency keeping file: ${fileName}`);
    }

    await this.crawler.downloadFile(
      `${this.getUrlWithYear(type, year)}/${fileName}`,
      localPath
    );

    return { file: localPath, updatedAt: "" };
  }
}
