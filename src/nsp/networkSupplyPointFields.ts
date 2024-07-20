import { FieldBase } from "../fieldBase";

export default class NetworkSupplyPointFields extends FieldBase {
  constructor() {
    super();
    this.FieldType = "NetworkSupplyPointFields";
    this.Fields = [
      {
        field: "flag",
        value: "Current flag",
        index: 0,
      },
      {
        field: "nsp",
        value: "NSP",
        index: 1,
      },
      {
        field: "replacedBy",
        value: "NSP replaced by",
        index: 2,
      },
      {
        field: "poc",
        value: "POC code",
        index: 3,
      },
      {
        field: "network",
        value: "Network participant",
        index: 4,
      },
      {
        field: "embeddedUnderPoc",
        value: "Embedded under POC code",
        index: 5,
      },
      {
        field: "embeddedUnderNetwork",
        value: "Embedded under network participant",
        index: 6,
      },
      {
        field: "reconciliationType",
        value: "Reconciliation type",
        index: 7,
      },
      {
        field: "xFlow",
        value: "X flow",
        index: 8,
      },
      {
        field: "iFlow",
        value: "I flow",
        index: 9,
      },
      {
        field: "description",
        value: "Description",
        index: 10,
      },
      {
        field: "nztmEasting",
        value: "NZTM easting",
        index: 11,
      },
      {
        field: "nztmNorthing",
        value: "NZTM northing",
        index: 12,
      },
      {
        field: "networkRportingRegionId",
        value: "Network reporting region ID",
        index: 13,
      },
      {
        field: "networkRportingRegion",
        value: "Network reporting region",
        index: 14,
      },
      {
        field: "zone",
        value: "Zone",
        index: 15,
      },
      {
        field: "island",
        value: "Island",
        index: 16,
      },
      {
        field: "startDate",
        value: "Start date",
        index: 17,
      },
      {
        field: "startTp",
        value: "Start TP",
        index: 18,
      },
      {
        field: "endDate",
        value: "End date",
        index: 19,
      },
      {
        field: "endTp",
        value: "End TP",
        index: 20,
      },
      {
        field: "sbIcp",
        value: "SB ICP",
        index: 21,
      },
      {
        field: "balanceCode",
        value: "Balancing code",
        index: 22,
      },
      {
        field: "mep",
        value: "MEP",
        index: 23,
      },
      {
        field: "responsible",
        value: "Responsible participant",
        index: 24,
      },
      {
        field: "certExpiry",
        value: "Certification expiry",
        index: 25,
      },
      {
        field: "meteringExemptionExpiry",
        value: "Metering information exemption expiry date",
        index: 26,
      },
    ];
  }
}
