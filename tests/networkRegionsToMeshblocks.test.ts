//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import { default as NetworkRegionsToMeshblocks } from "../src/networkRegionsToMeshblock/networkRegionsToMeshblocks";

test("EMI Network regions to Meshblocks", async () => {
  let ts = Date.now();
  let nrtm = new NetworkRegionsToMeshblocks();
  let nrtms = await nrtm.loadMeshblocks();

  // ensure top-level fields are populated
  expect(nrtms).toHaveProperty("ts");
  expect(nrtms).toHaveProperty("href");
  expect(nrtms).toHaveProperty("updatedAt");
  expect(nrtms).toHaveProperty("networkRegionsToMeshblocks");
  expect(nrtms).toHaveProperty("fields");
  expect(nrtms.ts).toBeGreaterThan(ts);
  expect(nrtms.fields.length).toBe(nrtm.fields.Fields.length);

  //ensure each record is populated correctly
  nrtms.networkRegionsToMeshblocks.forEach((n) => {
    expect(n.id.length).toBeGreaterThan(2);
    expect(n.meshblockId).toBeGreaterThan(0);
    expect(n.networkReporingRegion.length).toBeGreaterThan(3);
    expect(n.rootNsp.length).toBeGreaterThan(3);
    expect(n.ts).toBeGreaterThan(ts);
  });

  // output statistic and samples
  console.log(nrtms.networkRegionsToMeshblocks[0]);
  console.log(
    nrtms.networkRegionsToMeshblocks[
      nrtms.networkRegionsToMeshblocks.length - 1
    ]
  );
  console.log(
    `Found ${nrtms.networkRegionsToMeshblocks.length} regions to meshblocks records in EMI dataset ${nrtms.href}`
  );
}, 15000);
