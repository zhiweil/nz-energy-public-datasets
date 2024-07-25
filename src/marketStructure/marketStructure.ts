//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT

import { DatasetBase, DatasetFields, DatasetFile, Globals } from "../common";

// =============================================================================
export enum MarketStructureDatasetType {
  MARKET_SHARE_TRENDS = "MarketShareTrends",
  DISTRIBUTION_PRICE_CATEGORY_CODES = "DistributionPriceCategoryCodes",
  ICP_AND_METERING_DETAILS = "ICPandMeteringDetails",
}

export enum MarketStructureDatasetFilenames {
  NetworkReportingRegion = "MarketShareTrendsByNetworkReportingRegion.csv",
  RootNSP = "MarketShareTrendsByRootNSP.csv",
  NSP = "DistributionPriceCategoryCodesByNSP.csv",
  MepAndTrader = "MarketShareByMEPandTrader.csv",
  Level1Anzsic = "MeterCategoryByLevel1ANZSIC.csv",
  MeteringConfiguration = "MeteringConfigurationsInclDistributionPriceCatCode.csv",
}

export default class MarketStructure extends DatasetBase {
  private static readonly url = `${Globals.EmiHost}/Retail/Datasets/MarketStructure`;
  private static readonly fileTag = "tbody tr td.two a";
  constructor() {
    super(new DatasetFields("MarketStructureField"));
  }

  private getUrl(type: MarketStructureDatasetType): string {
    if (type == MarketStructureDatasetType.MARKET_SHARE_TRENDS) {
      return MarketStructure.url;
    }
    return `${MarketStructure.url}/${type}`;
  }

  async getTrendsFiles(): Promise<DatasetFile[]> {
    let files: DatasetFile[] = [];
    let page = await this.crawler.readPage(
      this.getUrl(MarketStructureDatasetType.MARKET_SHARE_TRENDS)
    );
    let tags = this.crawler.getElementsByTag(MarketStructure.fileTag, page);
    for (let tag of tags) {
      let href = tag.attr("href");
      if (href && href.endsWith(".csv")) {
        let pathParts = href.trim().split("/");
        let name = pathParts[pathParts.length - 1].trim();
        let nameParts = name.split("_");
        let f = Number(nameParts[0]);
        if (
          isNaN(f) ||
          (!name.endsWith(
            MarketStructureDatasetFilenames.NetworkReportingRegion
          ) &&
            !name.endsWith(MarketStructureDatasetFilenames.RootNSP))
        ) {
          throw new Error("Market structure trends files have changed");
        }
        files.push({
          file: name,
          updatedAt: tag.text(),
          for: f as number,
        });
      }
    }

    // there are exactly two trends files
    if (files.length != 2) {
      throw new Error(
        "New market structure trends files were added or removed"
      );
    }

    return files;
  }

  async getDistributionPriceCategoryCodesFile(): Promise<DatasetFile> {
    let files: DatasetFile[] = [];
    let page = await this.crawler.readPage(
      this.getUrl(MarketStructureDatasetType.DISTRIBUTION_PRICE_CATEGORY_CODES)
    );
    let tags = this.crawler.getElementsByTag(MarketStructure.fileTag, page);
    for (let tag of tags) {
      let href = tag.attr("href");
      if (href && href.endsWith(".csv")) {
        let pathParts = href.trim().split("/");
        let name = pathParts[pathParts.length - 1].trim();
        let nameParts = name.split("_");
        let f = Number(nameParts[0]);
        if (isNaN(f) || !name.endsWith(MarketStructureDatasetFilenames.NSP)) {
          throw new Error(
            "Market structure distribution price category codes file has changed"
          );
        }
        files.push({
          file: name,
          updatedAt: tag.text(),
          for: f as number,
        });
      }
    }

    // there are exactly two trends files
    if (files.length != 1) {
      throw new Error(
        "New market structure distribution price category codes file was added or removed"
      );
    }

    return files[0];
  }

  async getIcpAndMeteringDetailsFiles(): Promise<DatasetFile[]> {
    const byMepAndTrader = "MarketShareByMEPandTrader";
    const byLevel1Anzsic = "MeterCategoryByLevel1ANZSIC";
    const meteringConfiguration =
      "MeteringConfigurationsInclDistributionPriceCatCode";
    let files: DatasetFile[] = [];
    let page = await this.crawler.readPage(
      this.getUrl(MarketStructureDatasetType.ICP_AND_METERING_DETAILS)
    );
    let tags = this.crawler.getElementsByTag(MarketStructure.fileTag, page);
    for (let tag of tags) {
      let href = tag.attr("href");
      if (href && href.endsWith(".csv")) {
        let pathParts = href.trim().split("/");
        let name = pathParts[pathParts.length - 1].trim();
        let nameParts = name.split("_");
        let f = Number(nameParts[0]);
        if (
          isNaN(f) ||
          !(
            name.endsWith(MarketStructureDatasetFilenames.MepAndTrader) ||
            name.endsWith(MarketStructureDatasetFilenames.Level1Anzsic) ||
            name.endsWith(MarketStructureDatasetFilenames.MeteringConfiguration)
          )
        ) {
          throw new Error(
            "Market structure ICP and metering details files have changed"
          );
        }
        files.push({
          file: name,
          updatedAt: tag.text(),
          for: f as number,
        });
      }
    }

    // there are exactly three trends files
    if (files.length != 3) {
      throw new Error(
        "New market structure ICP and metering details files files were added or removed"
      );
    }

    return files;
  }

  async downloadFile(
    type: MarketStructureDatasetType,
    fileName: string,
    localPath: string
  ): Promise<DatasetFile> {
    let files: DatasetFile[] = [];
    if (type == MarketStructureDatasetType.MARKET_SHARE_TRENDS) {
      files = await this.getTrendsFiles();
    } else if (
      type == MarketStructureDatasetType.DISTRIBUTION_PRICE_CATEGORY_CODES
    ) {
      files = [await this.getDistributionPriceCategoryCodesFile()];
    } else if (type == MarketStructureDatasetType.ICP_AND_METERING_DETAILS) {
      files = await this.getIcpAndMeteringDetailsFiles();
    } else {
      throw new Error(`Unhandled dataset type: ${type}`);
    }

    let file = files.find((f) => f.file == fileName);
    if (!file) {
      throw Error(`Unknown retail market structure dataset file: ${fileName}`);
    }

    await this.crawler.downloadFile(
      `${this.getUrl(type)}/${fileName}`,
      localPath
    );

    return { file: localPath, updatedAt: "" };
  }
}
