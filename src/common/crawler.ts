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
import * as unzipper from "unzipper";
import * as path from "path";
import * as zlib from "zlib";

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

  async loadCsv(path: string) {
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

  async downloadAndUnzipFile(
    url: string,
    downloadPath: string,
    extractPath: string
  ): Promise<void> {
    try {
      // Download the file
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });

      // Ensure the download directory exists
      fs.mkdirSync(path.dirname(downloadPath), { recursive: true });

      // Create a write stream to save the downloaded file
      const writer = fs.createWriteStream(downloadPath);

      // Pipe the response data to the write stream
      response.data.pipe(writer);

      // Return a promise that resolves when the file is fully written
      await new Promise<void>((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // Ensure the extract directory exists
      fs.mkdirSync(extractPath, { recursive: true });

      // Unzip the downloaded file
      await fs
        .createReadStream(downloadPath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .promise();
    } catch (error) {
      console.error("Error downloading or unzipping file:", error);
    }
  }

  readJsonFile(filePath: string): any {
    const absolutePath = path.resolve(filePath);
    const fileContents = fs.readFileSync(absolutePath, "utf-8");
    return JSON.parse(fileContents);
  }

  readCsvFile(filePath: string): any {
    const absolutePath = path.resolve(filePath);
    const fileContents = fs.readFileSync(absolutePath, "utf-8");
    return Papa.parse(fileContents).data;
  }

  // Function to download a file
  async downloadFile(url: string, outputPath: string): Promise<void> {
    // Ensure the download directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const writer = fs.createWriteStream(outputPath);
    const response = await axios.get(url, {
      responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }

  // Function to decompress a .csv.gz file
  async decompressCsvGzFile(
    gzFilePath: string,
    outputFilePath: string
  ): Promise<void> {
    const absoluteGzFilePath = path.resolve(gzFilePath);
    const absoluteOutputFilePath = path.resolve(outputFilePath);

    const readStream = fs.createReadStream(absoluteGzFilePath);
    const writeStream = fs.createWriteStream(absoluteOutputFilePath);
    const gunzip = zlib.createGunzip();

    readStream.pipe(gunzip).pipe(writeStream);
  }

  deleteFolderRecursively(folderPath: string): void {
    const absoluteFolderPath = path.resolve(folderPath);

    // Check if the folder exists
    if (fs.existsSync(absoluteFolderPath)) {
      // Delete the folder and its contents recursively
      fs.rmSync(absoluteFolderPath, { recursive: true, force: true });
      console.log(`Folder deleted: ${absoluteFolderPath}`);
    } else {
      console.log(`Folder not found: ${absoluteFolderPath}`);
    }
  }
}
