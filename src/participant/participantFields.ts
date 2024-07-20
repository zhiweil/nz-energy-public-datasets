//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import { FieldBase } from "../privateUtiliites/fieldBase";

export default class ParticipantFields extends FieldBase {
  constructor() {
    super();
    this.FieldType = "ParticipantFields";
    this.Fields = [
      {
        field: "name",
        value: "Name",
      },
      {
        field: "majorParticipant",
        value: "Major participant",
      },
      {
        field: "codes",
        value: "Codes",
      },
      {
        field: "nzbn",
        value: "NZBN",
      },
      {
        field: "phone",
        value: "Phone",
      },
      {
        field: "fax",
        value: "Fax",
      },
      {
        field: "email",
        value: "Email",
      },
      {
        field: "website",
        value: "Website",
      },
      {
        field: "postalAddress",
        value: "Postal address",
      },
      {
        field: "physicalAddress",
        value: "Physical address",
      },
      {
        field: "regDate",
        value: "Date of first registration",
      },
      {
        field: "transCustomer",
        value: "Designated transmission customer",
      },
      {
        field: "traderInElectricity",
        value: "Trader in electricity",
      },
      {
        field: "mep",
        value: "Metering equipment provider",
      },
      {
        field: "genAsNongenerator",
        value:
          "Person (other than a generator) who generates electricity fed into a network",
      },
      {
        field: "ath",
        value: "Person who operates an approved test house",
      },
      {
        field: "ancillaryServiceAgent",
        value: "Ancillary service agent",
      },
      {
        field: "meteringEquipmentOwner",
        value: "Metering equipment owner",
      },
      {
        field: "loadAggregator",
        value: "Load aggregator",
      },
      {
        field: "purchaseFromCleaningManager",
        value: "Person who purchases electricity from the clearing manager",
      },
      {
        field: "consumerConnectedDirectlyToGrid",
        value: "Electricity consumer connected directly to the grid",
      },
      {
        field: "transpower",
        value: "Transpower",
      },
      {
        field: "lineOwner",
        value: "Line owner",
      },
      {
        field: "generator",
        value: "Electricity generator",
      },
      {
        field: "distributor",
        value: "Electricity distributor",
      },
      {
        field: "retailer",
        value: "Electricity retailer",
      },
      {
        field: "marketOperationServiceProvider",
        value: "Market operation service provider",
      },
    ];
  }
}
