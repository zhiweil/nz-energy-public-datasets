//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import { DatasetBase, DatasetFields, DatasetFile, Globals } from "../common";

export enum MeteredDataType {
  EMBEDDED_GENERATION = "Embedded_generation",
  GRID_EXPORT = "Grid_export",
  GRID_EXPORT_TO_TIWAI = "Grid_export_to_Tiwai",
  GRID_IMPORT = "Grid_import",
  HVDC_FLOWS = "HVDC_Flows",
  REACTIVE_POWER = "Reactive_power",
  UNIT_LEVEL_GENERATION_IR = "Unit_level_generation_IR",
}

export default class MeteredDataFiles extends DatasetBase {
  private static readonly url = `${Globals.EmiHost}/Wholesale/Datasets/Metered_data`;

  constructor() {
    super(new DatasetFields("MeteredDataField"));
  }

  async getFileList(type: MeteredDataType): Promise<DatasetFile[]> {
    const errMsg = "`Unrecognized metered data file format";
    let files: DatasetFile[] = [];
    let page = await this.crawler.readPage(`${MeteredDataFiles.url}/${type}`);
    let fileTags = this.crawler.getElementsByTag("tr td.two a", page);

    for (let ft of fileTags) {
      let href = ft.attr("href").split("/");
      if (!href[href.length - 1].endsWith(".csv")) {
        throw new Error(`${errMsg}: ${href}`);
      }
      let fn = href[href.length - 1].trim();
      let fileParts = fn.split("_");
      let forField = Number(fileParts[0]);
      if (isNaN(forField)) {
        throw new Error(`${errMsg}: ${href}`);
      }
      files.push({
        file: fn,
        updatedAt: ft.text(),
        for: forField,
      });
    }

    return files.sort((a, b) => (b.for ?? 0) - (a.for ?? 0));
  }

  async loadFile(type: MeteredDataType, fileName: string): Promise<any[]> {
    let csvs = await this.crawler.loadCsv(
      `${MeteredDataFiles.url}/${type}/${fileName}`
    );
    return csvs;
  }

  async downloadFile(
    type: MeteredDataType,
    fileName: string,
    localPath: string
  ) {
    await this.crawler.downloadFile(
      `${MeteredDataFiles.url}/${type}/${fileName}`,
      `${localPath}/${fileName}`
    );
  }
}
