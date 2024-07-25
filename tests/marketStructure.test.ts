//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import MarketStructure, {
  MarketStructureDatasetType,
} from "../src/marketStructure/marketStructure";

test("EMI market trends files", async () => {
  let ds = new MarketStructure();
  let files = await ds.getTrendsFiles();
  console.log(files);
  expect(files.length).toBe(2);

  let downloadedFile = await ds.downloadFile(
    MarketStructureDatasetType.MARKET_SHARE_TRENDS,
    files[0].file,
    `/tmp/marketStructure/${files[0].file}`
  );
  expect(downloadedFile.file).toBeDefined();
  downloadedFile = await ds.downloadFile(
    MarketStructureDatasetType.MARKET_SHARE_TRENDS,
    files[1].file,
    `/tmp/marketStructure/${files[1].file}`
  );
  expect(downloadedFile.file).toBeDefined();
}, 30000);

test("EMI market distribution price category codes file", async () => {
  let ds = new MarketStructure();
  let file = await ds.getDistributionPriceCategoryCodesFile();
  console.log(file);
  expect(file).toBeTruthy();

  let downloadedFile = await ds.downloadFile(
    MarketStructureDatasetType.DISTRIBUTION_PRICE_CATEGORY_CODES,
    file.file,
    `/tmp/marketStructure/${file.file}`
  );
  expect(downloadedFile.file).toBeDefined();
});

test("EMI market ICP and metering details files", async () => {
  let ds = new MarketStructure();
  let files = await ds.getIcpAndMeteringDetailsFiles();
  console.log(files);
  expect(files.length).toBe(3);

  let downloadedFile = await ds.downloadFile(
    MarketStructureDatasetType.ICP_AND_METERING_DETAILS,
    files[0].file,
    `/tmp/marketStructure/${files[0].file}`
  );
  expect(downloadedFile.file).toBeDefined();

  downloadedFile = await ds.downloadFile(
    MarketStructureDatasetType.ICP_AND_METERING_DETAILS,
    files[1].file,
    `/tmp/marketStructure/${files[1].file}`
  );
  expect(downloadedFile.file).toBeDefined();

  downloadedFile = await ds.downloadFile(
    MarketStructureDatasetType.ICP_AND_METERING_DETAILS,
    files[2].file,
    `/tmp/marketStructure/${files[2].file}`
  );
  expect(downloadedFile.file).toBeDefined();
}, 30000);
