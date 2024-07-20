//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import Globals from "../privateUtiliites/globals";
import DatasetBase from "../privateUtiliites/datasetBase";
import NetworkSupplyPointFields from "./networkSupplyPointFields";
import { Field } from "../privateUtiliites/fieldBase";

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
  networkRportingRegionId: string = "";
  networkRportingRegion: string = "";
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

  async loadNetworkSupllyPoints(): Promise<NetworkSupplyPointResponse> {
    const page = await this.crawler.readPage(NetworkSupplyPoints.nspTableUrl);
    const elements = this.crawler.getElementsByTag(
      NetworkSupplyPoints.fileTag,
      page
    );

    let latest = this.crawler.getLatestEmiTable(elements);
    let href = `${Globals.EmiHost}${latest.attr("href")}`;
    let updatedAt = latest.text();
    let jsonArray = await this.crawler.downloadCsv(href);

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
