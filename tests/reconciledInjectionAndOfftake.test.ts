//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import ReconciledInjectionsAndOfftakes from "../src/reconciledInjectionAndOfftake/reconciledInjectionsAndofftakes";

test("EMI reconciliation data", async () => {
  let recon = new ReconciledInjectionsAndOfftakes();
  let years = await recon.getMeataDataForYears();
  console.log(years);
  let files = await recon.getFilesForYear(years[0]);
  console.log(files);
  await recon.loadFile(years[0], files[0].file, "/tmp/reconciled");
  let csv = recon.crawler.readCsvFile(
    `/tmp/reconciled/${years[0]}/${files[0].file.substring(
      0,
      files[0].file.length - 3
    )}`
  );

  // // top-level fields
  // expect(recon.fields.Fields).toBeDefined();
  // expect(years.length).toBeGreaterThan(8);
  // expect(files.length).toBeGreaterThan(3);

  // // files are populated correctly
  // files.forEach((f) => {
  //   expect(f.file.endsWith(".csv.gz"));
  //   expect(f.updatedAt).toBeDefined();
  // });

  // // statistics and samples
  // console.log(csv[0]);
  // console.log(csv[1]);
}, 300000);
