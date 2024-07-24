//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import DispatchAndPricing, {
  DispatchAndPricingDatesetType,
} from "../src/dispatchAndPricing/dispatchAndPricing";

test("EMI dispatch and pricing datasets - daily", async () => {
  let ds = new DispatchAndPricing();

  // load list of filenames that are not yet found in monthly dataset
  let files = await ds.getDailyFiles();
  expect(files.length).toBeGreaterThan(0);
  console.log(files[0]);
  console.log(files[files.length - 1]);
  console.log(`Found ${files.length} dispatch and pricing daily files`);

  // download the latest file
  let lf = await ds.downloadFile(
    DispatchAndPricingDatesetType.Daily,
    files[0].file,
    `/tmp/dispatchAndPricing/daily/${files[0].file}`
  );
  expect(lf.file).toBe(`/tmp/dispatchAndPricing/daily/${files[0].file}`);
}, 15000);

test("EMI dispatch and pricing datasets - daily", async () => {
  let ds = new DispatchAndPricing();

  // monthly files
  let files = await ds.getMonthlyFiles();
  expect(files.length).toBeGreaterThan(0);
  console.log(files[0]);
  console.log(files[files.length - 1]);
  console.log(`Found ${files.length} dispatch and pricing monthly files`);

  // download the latest file
  let lf = await ds.downloadFile(
    DispatchAndPricingDatesetType.Monthly,
    files[0].file,
    `/tmp/dispatchAndPricing/monthly/${files[0].file}`
  );
  expect(lf.file).toBe(`/tmp/dispatchAndPricing/monthly/${files[0].file}`);
}, 15000);
