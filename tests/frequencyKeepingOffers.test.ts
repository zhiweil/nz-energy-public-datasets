//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT

import {
  FrequencyKeepingOfferDatasetType,
  FrequencyKeepingOffers,
} from "../src/frequencyKeeping";

// =============================================================================
test("EMI frequency keeping datasets - offers", async () => {
  let ds = new FrequencyKeepingOffers();

  // years
  let years = await ds.getYearList(FrequencyKeepingOfferDatasetType.OFFERS);
  console.log(years);
  expect(years.length).toBeGreaterThan(10);

  // files for a year
  let files = await ds.getFileListByYear(
    FrequencyKeepingOfferDatasetType.OFFERS,
    years[0]
  );
  expect(files.length).toBeGreaterThan(0);
  expect(files.length).toBeLessThanOrEqual(366);
  console.log(`Found ${files.length} files for year ${years[0]}`);
  console.log(files[0]);
  console.log(files[files.length - 1]);

  // download the latest file
  let downloadedFile = await ds.downloadFile(
    FrequencyKeepingOfferDatasetType.OFFERS,
    years[0],
    files[0].file,
    `/tmp/frequencyKeeping/offers/${files[0].file}`
  );

  expect(downloadedFile.file).toBeDefined();
}, 15000);

test("EMI frequency keeping datasets - dispatched offers", async () => {
  let ds = new FrequencyKeepingOffers();

  // years
  let years = await ds.getYearList(
    FrequencyKeepingOfferDatasetType.DISPATCHED_OFFERS
  );
  console.log(years);
  expect(years.length).toBeGreaterThan(10);

  // files for a year
  let files = await ds.getFileListByYear(
    FrequencyKeepingOfferDatasetType.DISPATCHED_OFFERS,
    years[0]
  );
  expect(files.length).toBeGreaterThan(0);
  expect(files.length).toBeLessThanOrEqual(366);
  console.log(`Found ${files.length} files for year ${years[0]}`);
  console.log(files[0]);
  console.log(files[files.length - 1]);

  // download the latest file
  let downloadedFile = await ds.downloadFile(
    FrequencyKeepingOfferDatasetType.DISPATCHED_OFFERS,
    years[0],
    files[0].file,
    `/tmp/frequencyKeeping/dispatchedOffers/${files[0].file}`
  );

  expect(downloadedFile.file).toBeDefined();
}, 15000);
