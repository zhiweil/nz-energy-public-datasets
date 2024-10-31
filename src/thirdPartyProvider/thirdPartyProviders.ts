//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import DatasetBase from "../common/datasetBase";
import { FieldBase } from "../common/fieldBase";
import Globals from "../common/globals";

export class ThirdPartyProviderField extends FieldBase {
  constructor() {
    super();
    this.FieldType = "ThirdPartyProviderField";
    this.Fields = [
      {
        field: "organisation",
        value: "Organisation",
      },
      {
        field: "identifier",
        value: "Identifier",
      },
    ];
  }
}

export class ThirdPartyProvider {
  orgnisation: string = "";
  identifier: string = "";
  ts: number = 0;
}

export interface ThirdPartyProviderResponse {
  thirdPartyProviders: ThirdPartyProvider[];
  href: string;
  ts: number;
}

export default class ThirdPartyProviders extends DatasetBase {
  private url = `${Globals.EaHost}/identifiers`;
  private tabClass = "tbody.js-nonparticipant-ThreeP";
  private rowClass = `${this.tabClass} tr td`;

  constructor() {
    super(new ThirdPartyProviderField());
  }

  async loadThirdPartyProviders(): Promise<ThirdPartyProviderResponse> {
    let page = await this.crawler.readPage(this.url);
    let tabs = this.crawler.getElementsByTag(this.tabClass, page);
    let tpps: ThirdPartyProvider[] = [];
    if (tabs.length != 1) {
      throw Error(
        "The third party registration page of EA registry has changed"
      );
    }
    let rows = this.crawler.getElementsByTag(this.rowClass, page);
    let ts = Date.now();
    for (let i = 0; i < rows.length; i += 2) {
      const org = rows[i].text().trim();
      const id = rows[i + 1].text().trim();
      if (org.length == 0 || id.length == 0) {
        continue;
      }
      tpps.push({
        orgnisation: org,
        identifier: id,
        ts,
      });
    }
    return { thirdPartyProviders: tpps, ts, href: this.url };
  }
}
