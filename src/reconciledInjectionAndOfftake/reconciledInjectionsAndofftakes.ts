import DatasetBase from "../common/datasetBase";
import { FieldBase } from "../common/fieldBase";
import Globals from "../common/globals";

export class ReconciledInjectionsAndOfftakesFields extends FieldBase {
  constructor() {
    super();
    this.FieldType = "";
    this.Fields = [
      {
        field: "file",
        value: "file",
      },
      {
        field: "updatedAt",
        value: "updatedAt",
      },
    ];
  }
}

export interface ReconciledInjectionsAndOfftakesFile {
  file: string;
  updatedAt: string;
}

export default class ReconciledInjectionsAndOfftakes extends DatasetBase {
  private static readonly yearPlaceholder = "[YEAR]";
  private static readonly url = `${Globals.EmiHost}/Wholesale/Datasets/Volumes/Reconciliation`;
  private static readonly yearUrl = `${Globals.EmiHost}/Wholesale/Datasets/Volumes/Reconciliation/${ReconciledInjectionsAndOfftakes.yearPlaceholder}`;

  constructor() {
    super(new ReconciledInjectionsAndOfftakesFields());
  }

  private getUrlWithYear(y: number): string {
    return ReconciledInjectionsAndOfftakes.yearUrl.replace(
      ReconciledInjectionsAndOfftakes.yearPlaceholder,
      `${y}`
    );
  }

  async getMeataDataForYears(): Promise<number[]> {
    let page = await this.crawler.readPage(ReconciledInjectionsAndOfftakes.url);
    let yearTags = this.crawler.getElementsByTag("tr td a", page);
    return yearTags
      .filter((yt) => !isNaN(yt.text()))
      .map((yt) => Number(yt.text()))
      .sort((a, b) => b - a);
  }

  async getFilesForYear(
    year: number
  ): Promise<ReconciledInjectionsAndOfftakesFile[]> {
    let files: ReconciledInjectionsAndOfftakesFile[] = [];
    let page = await this.crawler.readPage(this.getUrlWithYear(year));
    let fileTags = this.crawler.getElementsByTag("tr td a", page);

    for (let i = 0; i < fileTags.length; i += 3) {
      let fn = fileTags[i].text().trim();
      if (fn.endsWith(".csv.gz")) {
        files.push({
          file: fileTags[i].text().trim(),
          updatedAt: fileTags[i + 1].text().trim(),
        });
      }
    }

    return files;
  }

  async loadFile(year: number, file: string, localPath: string) {
    let fileUrl = this.getUrlWithYear(year);
    await this.crawler.downloadFile(
      `${fileUrl}/${file}`,
      `${localPath}/${year}/${file}`
    );
    await this.crawler.decompressCsvGzFile(
      `${localPath}/${year}/${file}`,
      `${localPath}/${year}/${file.substring(0, file.length - 3)}`
    );
  }
}
