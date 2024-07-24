//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import { DatasetBase, DatasetFields, DatasetFile, Globals } from "../common";
import assert from "assert";

export enum GenerationDatasetType {
  GENERATION_OUTPUT_BY_PLANT = "Generation_MD",
  GENERATION_FLEET_PROPOSED = "Proposed",
  GENERATION_FLEET_EXISTING = "Existing",
  GENERATION_FLEET_EXISTING_DISPATCHED = "Existing_Dispatched",
}

export default class GenerationDatasets extends DatasetBase {
  private static readonly existingFileName =
    "20151030_ExistingGenerationPlant.xls";
  private static readonly existingDispatchedFileName =
    "20230601_DispatchedGenerationPlant.csv";
  private static readonly tagPath = "tr td.two a";

  constructor() {
    super(new DatasetFields("GenerationField"));
  }

  getDatasetUrl(type: GenerationDatasetType): string {
    switch (type) {
      case GenerationDatasetType.GENERATION_OUTPUT_BY_PLANT:
        return `${Globals.EmiHost}/Wholesale/Datasets/Generation/${type}`;
      case GenerationDatasetType.GENERATION_FLEET_EXISTING:
      case GenerationDatasetType.GENERATION_FLEET_EXISTING_DISPATCHED:
        return `${Globals.EmiHost}/Wholesale/Datasets/Generation/GenerationFleet/Existing`;
      case GenerationDatasetType.GENERATION_FLEET_PROPOSED:
        return `${Globals.EmiHost}/Wholesale/Datasets/Generation/GenerationFleet/Proposed`;
      default:
        throw new Error(`Unhandled dataset type: ${type}`);
    }
  }

  async getGenerationFileList(
    type: GenerationDatasetType
  ): Promise<DatasetFile[]> {
    let page = await this.crawler.readPage(this.getDatasetUrl(type));
    let tags = this.crawler.getElementsByTag(GenerationDatasets.tagPath, page);
    let files: DatasetFile[] = [];
    for (let t of tags) {
      let href = t.attr("href");
      if (!href) {
        continue;
      }
      let fileParts = href.trim().split("/");
      let fileName = fileParts[fileParts.length - 1];
      if (!(fileName.endsWith(".csv") || fileName.endsWith(".xls"))) {
        continue;
      }
      files.push({
        file: fileName,
        updatedAt: t.text(),
      });
    }

    return files.sort(
      (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
    );
  }

  async downloadGenerationOuputFile(
    fileName: string,
    localPath: string
  ): Promise<void> {
    let files = await this.getGenerationFileList(
      GenerationDatasetType.GENERATION_OUTPUT_BY_PLANT
    );
    let file = files.find((f) => f.file == fileName);
    if (!file) {
      throw Error(`Unknown generation output by plant file: ${fileName}`);
    }

    await this.crawler.downloadFile(
      `${this.getDatasetUrl(
        GenerationDatasetType.GENERATION_OUTPUT_BY_PLANT
      )}/${fileName}`,
      localPath
    );
  }

  async downloadGenerationProposedFile(
    fileName: string,
    localPath: string
  ): Promise<void> {
    let files = await this.getGenerationFileList(
      GenerationDatasetType.GENERATION_FLEET_PROPOSED
    );
    let file = files.find((f) => f.file == fileName);
    if (!file) {
      throw Error(
        `Unknown proposed generation investiment pipeline file: ${fileName}`
      );
    }
    await this.crawler.downloadFile(
      `${this.getDatasetUrl(
        GenerationDatasetType.GENERATION_FLEET_PROPOSED
      )}/${fileName}`,
      localPath.replace(/%20/g, "")
    );
  }

  async downloadGenerationFleetFile(
    type: GenerationDatasetType,
    localPath: string
  ): Promise<DatasetFile> {
    assert(
      type === GenerationDatasetType.GENERATION_FLEET_EXISTING_DISPATCHED ||
        type === GenerationDatasetType.GENERATION_FLEET_EXISTING,
      `Invalid dataset type: ${type}`
    );
    let files = await this.getGenerationFileList(type);
    if (
      files.length != 2 ||
      !files.find((f) => f.file == GenerationDatasets.existingFileName) ||
      !files.find(
        (f) => f.file == GenerationDatasets.existingDispatchedFileName
      )
    ) {
      throw Error("Generation fleet files have changed");
    }
    let fileName =
      type == GenerationDatasetType.GENERATION_FLEET_EXISTING
        ? GenerationDatasets.existingFileName
        : GenerationDatasets.existingDispatchedFileName;
    await this.crawler.downloadFile(
      `${this.getDatasetUrl(type)}/${fileName}`,
      `${localPath}/${fileName}`
    );

    return { file: fileName, updatedAt: "" };
  }
}
