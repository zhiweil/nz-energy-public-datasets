//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import { GenerationDatasets, GenerationDatasetType } from "../src";

test("Generation datasets - generation output by plant", async () => {
  let gd = new GenerationDatasets();
  let files = await gd.getGenerationFileList(
    GenerationDatasetType.GENERATION_OUTPUT_BY_PLANT
  );
  expect(files.length).toBeGreaterThan(300);
  // download the latest file
  await gd.downloadGenerationOuputFile(
    files[0].file,
    `/tmp/generation/${files[0].file}`
  );

  // ensure all files are populated corrrectly
  files.forEach((f) => {
    expect(f.file.endsWith(".csv")).toBeTruthy();
    expect(f.updatedAt).toBeDefined();
  });

  // statistics and samples
  console.log(files[0]);
  console.log(files[files.length - 1]);
  console.log(`Found ${files.length} generation output by plant files.`);
}, 15000);

test("Generation datasets - proposed generation investiment pipeline", async () => {
  let gd = new GenerationDatasets();
  let files = await gd.getGenerationFileList(
    GenerationDatasetType.GENERATION_FLEET_PROPOSED
  );
  expect(files.length).toBeGreaterThan(0);
  // download the latest file
  await gd.downloadGenerationProposedFile(
    files[0].file,
    `/tmp/generation/${files[0].file}`
  );

  // ensure all files are populated correctly
  files.forEach((f) => {
    expect(f.file.endsWith(".csv")).toBeTruthy();
    expect(f.updatedAt).toBeDefined();
  });

  // statistics and samples
  console.log(files[0]);
  console.log(files[files.length - 1]);
  console.log(
    `Found ${files.length} proposed generation investment pipeline files.`
  );
}, 15000);

test("Generation datasets - generation fleet - existing", async () => {
  let gd = new GenerationDatasets();
  let files = await gd.getGenerationFileList(
    GenerationDatasetType.GENERATION_FLEET_EXISTING
  );
  expect(files.length).toBe(2);
  // download the latest file
  let df = await gd.downloadGenerationFleetFile(
    GenerationDatasetType.GENERATION_FLEET_EXISTING,
    `/tmp/generation`
  );

  // ensure all files are populated correctly
  files.forEach((f) => {
    expect(f.file.endsWith(".xls") || f.file.endsWith(".csv")).toBeTruthy();
    expect(f.updatedAt).toBeDefined();
  });

  // statistics and samples
  console.log(files[0]);
  console.log(files[files.length - 1]);
  console.log(`Found ${files.length} existing generation plant files.`);

  // load xls as csv
  let csv = await gd.crawler.xlsxToCsv(`/tmp/generation/${df.file}`);
  expect(csv.length).toBeGreaterThan(1);
  console.log(csv[0]);
  console.log(csv[1]);
  console.log(csv[csv.length - 1]);
}, 15000);

test("Generation datasets - generation fleet - dispatched", async () => {
  let gd = new GenerationDatasets();
  let files = await gd.getGenerationFileList(
    GenerationDatasetType.GENERATION_FLEET_EXISTING_DISPATCHED
  );
  expect(files.length).toBe(2);
  // download the latest file
  let df = await gd.downloadGenerationFleetFile(
    GenerationDatasetType.GENERATION_FLEET_EXISTING_DISPATCHED,
    `/tmp/generation`
  );

  // ensure all files are populated correctly
  files.forEach((f) => {
    expect(f.file.endsWith(".xls") || f.file.endsWith(".csv")).toBeTruthy();
    expect(f.updatedAt).toBeDefined();
  });

  // statistics and samples
  console.log(files[0]);
  console.log(files[files.length - 1]);
  console.log(`Found ${files.length} proposed generation plant files.`);

  // load as csv
  let csv = await gd.crawler.readCsvFile(`/tmp/generation/${df.file}`);
  expect(csv.length).toBeGreaterThan(1);
  console.log(csv[0]);
  console.log(csv[1]);
  console.log(csv[csv.length - 1]);
}, 15000);
