import { get } from "cheerio/lib/api/traversing";
import DatasetBase from "../privateUtiliites/datasetBase";
import { FieldBase } from "../privateUtiliites/fieldBase";
import Globals from "../privateUtiliites/globals";

export enum NetworkRegionShapeFileType {
  WGS84_GeoJSON_NRR = "WGS84_GeoJSON_NRR",
  WGS84_GeoJSON_Zone = "WGS84_GeoJSON_Zone",
  NZTM_GeoJSON_NRR = "NZTM_GeoJSON_NRR",
  NZTM_GeoJSON_Zone = "NZTM_GeoJSON_Zone",
}

export enum ProjectionType {
  WGS84 = "WGS84",
  NZTM = "NZTM",
}

export class NetworkRegionShapefileFields extends FieldBase {
  constructor() {
    super();
    this.FieldType = "NetworkRegionShapeFile";
    this.Fields = [
      {
        field: "region",
        value: "Region",
      },
      {
        field: "id",
        value: "ID",
      },
      {
        field: "json",
        value: "JSON",
      },
    ];
  }
}

export interface NetworkRegionShapefile {
  [index: string]: string | number;
  region: string;
  id: string;
  json: string;
  ts: number;
}

export interface NetworkRegionShapeFileMetadata {
  nrrUpdatedAt: string;
  zoneUpdatedAt: string;
}

export interface NetworkRegionShapeFileResponse {
  networkRegionShapefiles: NetworkRegionShapefile[];
  updatedAt: string;
  href: string;
  ts: number;
}

export default class NetworkRegionShapefiles extends DatasetBase {
  private static readonly projectionTypePlaceholder = "PROJECTION_TYPE";
  private static readonly fileHref = `${Globals.EmiHost}/Wholesale/Datasets/MappingsAndGeospatial/NetworkRegionShapefiles/${this.projectionTypePlaceholder}/GeoJSON`;
  private static readonly tagPath = "tbody tr td";

  constructor() {
    super(new NetworkRegionShapefileFields());
  }

  private getFilePath(ft: NetworkRegionShapeFileType): string {
    return NetworkRegionShapefiles.fileHref.replace(
      NetworkRegionShapefiles.projectionTypePlaceholder,
      this.getProjectType(ft)
    );
  }

  private getUpdatedAt(
    metadata: NetworkRegionShapeFileMetadata,
    ft: NetworkRegionShapeFileType
  ): string {
    switch (ft) {
      case NetworkRegionShapeFileType.NZTM_GeoJSON_NRR:
      case NetworkRegionShapeFileType.WGS84_GeoJSON_NRR:
        return metadata.nrrUpdatedAt;
      case NetworkRegionShapeFileType.NZTM_GeoJSON_Zone:
      case NetworkRegionShapeFileType.WGS84_GeoJSON_Zone:
        return metadata.zoneUpdatedAt;
      default:
        throw Error(`Unknown file type: ${ft}`);
    }
  }

  private getProjectType(fileType: NetworkRegionShapeFileType) {
    if (`${fileType}`.startsWith("WGS84_GeoJSON")) {
      return ProjectionType.WGS84;
    }
    return ProjectionType.NZTM;
  }

  async loadShapefileMetadata(
    ft: NetworkRegionShapeFileType
  ): Promise<NetworkRegionShapeFileMetadata> {
    let f = this.getFilePath(ft);
    const page = await this.crawler.readPage(f);
    const records = this.crawler.getElementsByTag(
      NetworkRegionShapefiles.tagPath,
      page
    );
    let nrrUpdatedAt = "",
      zoneUpdatedAt = "";
    for (let i = 0; i < records.length; i++) {
      if (
        records[i].text().trim() ===
          `${NetworkRegionShapeFileType.WGS84_GeoJSON_NRR}.zip` ||
        records[i].text().trim() ===
          `${NetworkRegionShapeFileType.NZTM_GeoJSON_NRR}.zip`
      ) {
        nrrUpdatedAt = records[i + 1].text().trim();
      } else if (
        records[i].text().trim() ===
          `${NetworkRegionShapeFileType.WGS84_GeoJSON_Zone}.zip` ||
        records[i].text().trim() ===
          `${NetworkRegionShapeFileType.NZTM_GeoJSON_Zone}.zip`
      ) {
        zoneUpdatedAt = records[i + 1].text().trim();
      }
    }
    return { nrrUpdatedAt, zoneUpdatedAt };
  }

  async loadShapefile(
    fileType: NetworkRegionShapeFileType,
    localPath: string
  ): Promise<NetworkRegionShapeFileResponse> {
    let metaDdata = await this.loadShapefileMetadata(fileType);
    if (
      metaDdata.nrrUpdatedAt.length == 0 ||
      metaDdata.zoneUpdatedAt.length == 0
    ) {
      throw new Error("The network region shapefile page has changed.");
    }

    const path = this.getFilePath(fileType);
    const downloadPath = `${localPath}/${fileType}/zip`;
    const extractPath = `${localPath}/${fileType}/json`;
    await this.crawler.downloadAndUnzipFile(
      `${path}/${fileType}.zip`,
      downloadPath,
      extractPath
    );

    let shapefile = this.crawler.readJsonFile(
      `${extractPath}/${fileType}.JSON`
    );

    let ts = Date.now();
    let featureIds: string[] = [];
    let features: NetworkRegionShapefile[] = [];
    for (let f of shapefile.features) {
      featureIds.push(`${f.properties.Region}`);
      features.push({
        region: f.properties.Region,
        id: `${fileType}/${f.properties.Region}`,
        json: JSON.stringify(f),
        ts,
      });
    }
    let toplevel = {
      type: shapefile.type,
      crs: shapefile.crs,
      features: featureIds,
    };

    // the overall collection is created as an object but with all the features removed
    // the the size of the record is too big and would be redundant as they have been
    // persisted in each EDB/zone.
    let all: NetworkRegionShapefile = {
      region: `${fileType}`,
      id: `${fileType}/ALL`,
      json: JSON.stringify(toplevel),
      ts,
    };
    features.push(all);

    return {
      updatedAt: this.getUpdatedAt(metaDdata, fileType),
      networkRegionShapefiles: features,
      href: `${path}/${fileType}.zip`,
      ts,
    };
  }
}
