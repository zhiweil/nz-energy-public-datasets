//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import DatasetBase from "../privateUtiliites/datasetBase";
import { Field } from "../privateUtiliites/fieldBase";
import Globals from "../privateUtiliites/globals";
import { default as ParticipantFields } from "./participantFields";

export class Participant {
  [index: string]: string | boolean | number | string[];
  name: string = "";
  majorParticipant: boolean = false;
  codes: string[] = [];
  nzbn: string = "";
  phone: string = "";
  fax: string = "";
  email: string = "";
  website: string = "";
  postalAddress: string = "";
  physicalAddress: string = "";
  regDate: string = "";
  transCustomer: boolean = false;
  traderInElectricity: boolean = false;
  mep: boolean = false;
  genAsNongenerator: boolean = false;
  ath: boolean = false;
  ancillaryServiceAgent: boolean = false;
  meteringEquipmentOwner: boolean = false;
  loadAggregator: boolean = false;
  purchaseFromCleaningManager: boolean = false;
  consumerConnectedDirectlyToGrid: boolean = false;
  transpower: boolean = false;
  lineOwner: boolean = false;
  generator: boolean = false;
  distributor: boolean = false;
  retailer: boolean = false;
  marketOperationServiceProvider: boolean = false;
  ts: number = 0;
}

export interface CodeToParticipant {
  code: string;
  name: string;
}

export interface ParticipantReponse {
  participants: Participant[];
  codes: CodeToParticipant[];
  fields: Field[];
  ts: number;
}

export default class Participants extends DatasetBase {
  private participantsUrl = `${Globals.EmiHost}/download?`;
  private filePath = "/tmp/participants.xlxs";

  constructor() {
    super(new ParticipantFields());
  }

  private toParticipantArray(participantsJson: any[]): ParticipantReponse {
    let raw: Participant[] = [];
    let codeToParticipant: CodeToParticipant[] = [];
    let ts = Date.now();

    participantsJson.forEach((pj) => {
      let p: Participant = new Participant();
      this.fields.Fields.forEach((f) => {
        if (typeof p[f.field] == "string") {
          p[f.field] = this.extractString(pj, f.field);
        } else if (typeof p[f.field] == "boolean") {
          p[f.field] = this.extractBoolean(pj, f.field);
        } else if (Array.isArray(p[f.field])) {
          p[f.field] = this.extractStringArray(pj, f.field);
        }
      });
      p.ts = ts;
      raw.push(p);

      // gathering code -> participant records
      for (const element of p.codes) {
        let ec = codeToParticipant.find(
          (ctp) => ctp.code === element && ctp.name === pj.name
        );
        if (!ec) {
          codeToParticipant.push({ code: element, name: p.name });
        }
      }
    });

    return {
      participants: raw,
      codes: codeToParticipant,
      fields: this.fields.Fields,
      ts,
    };
  }

  async loadPartificipants(): Promise<ParticipantReponse> {
    await this.crawler.downloadXlsx(this.participantsUrl, this.filePath);
    const participantsJson = this.crawler.xlsxToJson(this.filePath);
    return this.toParticipantArray(participantsJson);
  }
}
