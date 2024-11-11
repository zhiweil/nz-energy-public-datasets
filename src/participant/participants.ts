//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import DatasetBase from "../common/datasetBase";
import { Field } from "../common/fieldBase";
import Globals from "../common/globals";
import { default as ParticipantFields } from "./participantFields";

export class Participant {
  [index: string]: string | boolean | number | string[] | Function;
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

  constructor(
    data: {
      name?: string;
      majorParticipant?: boolean;
      codes?: string[];
      nzbn?: string;
      phone?: string;
      fax?: string;
      email?: string;
      website?: string;
      postalAddress?: string;
      physicalAddress?: string;
      regDate?: string;
      transCustomer?: boolean;
      traderInElectricity?: boolean;
      mep?: boolean;
      genAsNongenerator?: boolean;
      ath?: boolean;
      ancillaryServiceAgent?: boolean;
      meteringEquipmentOwner?: boolean;
      loadAggregator?: boolean;
      purchaseFromCleaningManager?: boolean;
      consumerConnectedDirectlyToGrid?: boolean;
      transpower?: boolean;
      lineOwner?: boolean;
      generator?: boolean;
      distributor?: boolean;
      retailer?: boolean;
      marketOperationServiceProvider?: boolean;
      ts?: number;
    } = {}
  ) {
    this.name = data.name || "";
    this.majorParticipant = data.majorParticipant || false;
    this.codes = data.codes || [];
    this.nzbn = data.nzbn || "";
    this.phone = data.phone || "";
    this.fax = data.fax || "";
    this.email = data.email || "";
    this.website = data.website || "";
    this.postalAddress = data.postalAddress || "";
    this.physicalAddress = data.physicalAddress || "";
    this.regDate = data.regDate || "";
    this.transCustomer = data.transCustomer || false;
    this.traderInElectricity = data.traderInElectricity || false;
    this.mep = data.mep || false;
    this.genAsNongenerator = data.genAsNongenerator || false;
    this.ath = data.ath || false;
    this.ancillaryServiceAgent = data.ancillaryServiceAgent || false;
    this.meteringEquipmentOwner = data.meteringEquipmentOwner || false;
    this.loadAggregator = data.loadAggregator || false;
    this.purchaseFromCleaningManager =
      data.purchaseFromCleaningManager || false;
    this.consumerConnectedDirectlyToGrid =
      data.consumerConnectedDirectlyToGrid || false;
    this.transpower = data.transpower || false;
    this.lineOwner = data.lineOwner || false;
    this.generator = data.generator || false;
    this.distributor = data.distributor || false;
    this.retailer = data.retailer || false;
    this.marketOperationServiceProvider =
      data.marketOperationServiceProvider || false;
    this.ts = data.ts || 0;
  }

  /**
   *
   * @param other
   * @returns true if two participants are equal, false otherwise.
   * Functions and field "ts" is not compared.
   */
  public equals(other: Participant): boolean {
    if (!(other instanceof Participant)) return false;

    // Compare each property
    for (const key in this) {
      if (
        this.hasOwnProperty(key) &&
        typeof this[key] !== "function" &&
        key != "ts"
      ) {
        const value1 = this[key];
        const value2 = other[key];

        if (Array.isArray(value1) && Array.isArray(value2)) {
          if (
            value1.length !== value2.length ||
            !value1.every((v, i) => v === value2[i])
          ) {
            return false;
          }
        } else if (value1 !== value2) {
          return false;
        }
      }
    }
    return true;
  }
}

export interface CodeToParticipant {
  code: string;
  name: string;
}

export interface ParticipantResponse {
  participants: Participant[];
  codes: CodeToParticipant[];
  fields: Field[];
  ts: number;
}

export default class Participants extends DatasetBase {
  private participantsUrl = `${Globals.EaHost}/download?`;
  private filePath = "participants.xlxs";

  constructor() {
    super(new ParticipantFields());
  }

  private toParticipantArray(participantsJson: any[]): ParticipantResponse {
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

  async loadPartificipants(
    localPath: string = "/tmp"
  ): Promise<ParticipantResponse> {
    let s = await this.crawler.downloadFile(
      this.participantsUrl,
      `${localPath}/${this.filePath}`
    );
    const participantsJson = this.crawler.xlsxToJson(
      `${localPath}/${this.filePath}`
    );
    return this.toParticipantArray(participantsJson);
  }
}
