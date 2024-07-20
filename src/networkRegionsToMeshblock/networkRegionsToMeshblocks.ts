//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import DatasetBase from "../privateUtiliites/datasetBase";
import { FieldBase, Field } from "../privateUtiliites/fieldBase";
import Globals from "../privateUtiliites/globals";

export class NetworkRegionsToMeshblockFields extends FieldBase {
  constructor() {
    super();
    this.FieldType = "NetworkRegionsToMeshblockField";
    this.Fields = [
      {
        field: "region",
        value: "Region ID",
        index: 0,
      },
      {
        field: "networkReporingRegion",
        value: "Network reporting region",
        index: 1,
      },
      {
        field: "rootNsp",
        value: "Root NSP",
        index: 2,
      },
      {
        field: "meshblockId",
        value: "2013 Meshblock ID",
        index: 3,
      },
    ];
  }
}

export class NetworkRegionsToMeshblock {
  [index: string]: string | number;
  id: string = "";
  region: number = 0;
  networkReporingRegion: string = "";
  rootNsp: string = "";
  meshblockId: number = 0;
  ts: number = 0;
}

export interface NetworkRegionsToMeshblockResponse {
  networkRegionsToMeshblocks: NetworkRegionsToMeshblock[];
  updatedAt: string;
  href: string;
  ts: number;
  fields: Field[];
}

export default class NetworkRegionsToMeshblocks extends DatasetBase {
  private static readonly url = `${Globals.EmiHost}/Wholesale/Datasets/MappingsAndGeospatial/NetworkRegionsToMeshblocks`;
  private static readonly tagClass = "td.two a";

  constructor() {
    super(new NetworkRegionsToMeshblockFields());
  }

  newNetworkRegionsToMeshblock(
    row: string[],
    ts: number
  ): NetworkRegionsToMeshblock {
    let nrtm = new NetworkRegionsToMeshblock();
    this.fields.Fields.forEach((f) => {
      if (typeof nrtm[f.field] == "string") {
        nrtm[f.field] = this.extractStringByIndex(row, f.index as number);
      } else if (typeof nrtm[f.field] == "number") {
        nrtm[f.field] = this.extractNumberByIndex(row, f.index as number);
      }
    });
    nrtm.id = `${nrtm.region}/${nrtm.meshblockId}`;
    nrtm.ts = ts;
    return nrtm;
  }

  async loadMeshblocks(): Promise<NetworkRegionsToMeshblockResponse> {
    const page = await this.crawler.readPage(NetworkRegionsToMeshblocks.url);
    const elements = this.crawler.getElementsByTag(
      NetworkRegionsToMeshblocks.tagClass,
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
    let nrtms: NetworkRegionsToMeshblock[] = [];
    for (let i = 1; i < jsonArray.length; i++) {
      let nrtm = this.newNetworkRegionsToMeshblock(
        jsonArray[i] as string[],
        ts
      );
      if (nrtm.id === "0/0") {
        continue;
      }
      nrtms.push(nrtm);
    }
    return {
      updatedAt,
      href,
      ts,
      networkRegionsToMeshblocks: nrtms,
      fields: this.fields.Fields,
    };
  }
}
