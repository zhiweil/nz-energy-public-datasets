//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import XLSX from "xlsx";
import Papa from "papaparse";

export default class Crawler {
  async readPage(path: string): Promise<cheerio.CheerioAPI> {
    try {
      const response = await axios.get(path);
      const html = response.data;
      return cheerio.load(html);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getElementsByTag(tag: string, page: cheerio.CheerioAPI): any[] {
    try {
      let elements: any[] = [];
      page(tag).each((_idx, el) => {
        elements.push(page(el));
      });
      return elements;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async downloadXlsx(url: string, outputPath: string): Promise<any> {
    try {
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });

      // Create a write stream to save the file
      const writer = fs.createWriteStream(outputPath);

      // Pipe the response data to the write stream
      response.data.pipe(writer);

      // Return a promise that resolves when the file is fully written
      return new Promise<void>((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  xlsxToJson(filePath: string): any[] {
    const workbook = XLSX.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const participantJsonArray = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]],
      {
        defval: "",
        raw: false,
      }
    );
    return participantJsonArray;
  }

  async downloadCsv(path: string) {
    const response = await axios.get(path);
    const csvString = response.data;
    return Papa.parse(csvString).data;
  }

  getLatestEmiTable(tables: any[]) {
    let latest = null;
    for (let t of tables) {
      if (!latest || Date.parse(latest.text()) < Date.parse(t.text())) {
        latest = t;
      }
    }
    return latest;
  }
}
