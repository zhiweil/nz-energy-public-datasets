//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import Globals from "../common/globals";
import DatasetBase from "../common/datasetBase";
import NetworkSupplyPointFields from "./networkSupplyPointFields";
import { Field } from "../common/fieldBase";

export class NetworkSupplyPoint {
  [index: string]: string | number;
  /* Field "id" does not exisit in the original dataset, 
    it is unique acorss all Network Supply Points */
  id: string = "";
  flag: string = "";
  nsp: string = "";
  replacedBy: string = "";
  poc: string = "";
  network: string = "";
  embeddedUnderPoc: string = "";
  embeddedUnderNetwork: string = "";
  reconciliationType: string = "";
  xFlow: string = "";
  iFlow: string = "";
  description: string = "";
  nztmEasting: string = "";
  nztmNorthing: string = "";
  networkReportingRegionId: string = "";
  networkReportingRegion: string = "";
  zone: string = "";
  island: string = "";
  startDate: string = "";
  startTp: string = "";
  endDate: string = "";
  endTp: string = "";
  sbIcp: string = "";
  balanceCode: string = "";
  mep: string = "";
  responsible: string = "";
  certExpiry: string = "";
  meteringExemptionExpiry: string = "";
  /**  when the data is retrived from EMI website,
   this does not exist in the origional dataset */
  ts: number = 0;
}

export interface NetworkSupplyPointResponse {
  networkSupplyPoints: NetworkSupplyPoint[];
  href: string;
  updatedAt: string;
  ts: number;
  fields: Field[];
}

export default class NetworkSupplyPoints extends DatasetBase {
  private static nspTableUrl: string = `${Globals.EmiHost}/Wholesale/Datasets/MappingsAndGeospatial/NetworkSupplyPointsTable`;
  private static fileTag = "td.two a";

  constructor() {
    super(new NetworkSupplyPointFields());
  }

  private newNetworkSupplyPoint(row: string[], ts: number): NetworkSupplyPoint {
    let nsp: NetworkSupplyPoint = new NetworkSupplyPoint();
    let fields = new NetworkSupplyPointFields();
    for (const element of fields.Fields) {
      nsp[element.field] = this.extractStringByIndex(row, element.index ?? 0);
    }
    nsp.ts = ts;
    nsp.id = `${nsp.nsp}/${nsp.startDate}/${nsp.startTp}`;

    return nsp;
  }

  async loadFileList(): Promise<string[]> {
    const files: string[] = [];
    const page = await this.crawler.readPage(NetworkSupplyPoints.nspTableUrl);
    const elements = this.crawler.getElementsByTag(
      NetworkSupplyPoints.fileTag,
      page
    );
    for (let i = 0; i < elements.length; i++) {
      let file = elements[i].attr("href");
      let parts = file.split("/");
      files.push(parts[parts.length - 1]);
    }
    return files;
  }

  getFileUrl(filename: string): string {
    return `${NetworkSupplyPoints.nspTableUrl}/${filename}`;
  }

  async downloadFile(file: string, localPath: string): Promise<void> {
    const href = this.getFileUrl(file);
    await this.crawler.downloadFile(href, localPath);
  }

  async loadNetworkSupllyPoints(
    file: string
  ): Promise<NetworkSupplyPointResponse> {
    const href = this.getFileUrl(file);
    const fileParts = file.split("_");
    const updatedAt = fileParts[0];
    let jsonArray = await this.crawler.loadCsv(href);

    // ensure the data structure of the original CSV does not change
    this.checkHeaderRow(jsonArray[0] as string[]);

    // extract rows
    let ts = Date.now();
    let networkSupplyPoints: NetworkSupplyPoint[] = [];
    for (let i = 1; i < jsonArray.length; i++) {
      let nsp = this.newNetworkSupplyPoint(jsonArray[i] as string[], ts);
      if (nsp.id === "//") {
        continue;
      }
      networkSupplyPoints.push(nsp);
    }
    return {
      updatedAt,
      href,
      ts,
      networkSupplyPoints,
      fields: this.fields.Fields,
    };
  }
}
