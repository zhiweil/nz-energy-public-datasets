//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import { NetworkSupplyPointFields } from "../src";
import NetworkSupplyPoints from "../src/nsp/networkSuppliyPoints";

test("New Zealand EA Network Supply Points", async () => {
  let ts = Date.now();
  let nsps = new NetworkSupplyPoints();
  let files = await nsps.loadFileList();
  let nspsResp = await nsps.loadNetworkSupllyPoints(files[0]);

  // check the top-level fields in the response
  expect(nspsResp).toBeTruthy();
  expect(nspsResp.href).toBeDefined();
  expect(nspsResp.ts).toBeGreaterThan(ts);
  expect(nspsResp.updatedAt).toBeDefined();
  expect(nspsResp.networkSupplyPoints).toBeDefined();
  expect(nspsResp.networkSupplyPoints.length).toBeGreaterThan(0);

  // ensure empty lines in original dataset are removed.
  let emptys = nspsResp.networkSupplyPoints.filter((es) => es.id == "//");
  if (emptys.length > 0) {
    console.log(emptys);
  }
  expect(emptys.length).toBe(0);

  // check each item in the respose to ensure that they have all the properties
  let fields = new NetworkSupplyPointFields();
  nspsResp.networkSupplyPoints.forEach((nsp) => {
    // ensure the number of properties of each NSP is the same as that of those
    // defined in NetworkSupplyPoints.Fields plus 2, fields "id" and "ts".
    expect(Object.keys(nsp).length).toBe(fields.Fields.length + 2);

    // each of the fields defined in the object
    fields.Fields.forEach((field) => {
      expect(nsp[field.field]).toBeDefined();
    });

    // ensure the id is unique
    let objectsWithId = nspsResp.networkSupplyPoints.filter(
      (nr) => nr.id === nsp.id
    );
    if (objectsWithId.length > 1) {
      console.log(JSON.stringify(objectsWithId, null, 2));
    }
    expect(objectsWithId.length).toBe(1);
  });

  console.log(nspsResp.networkSupplyPoints[0]);
  console.log(
    nspsResp.networkSupplyPoints[nspsResp.networkSupplyPoints.length - 1]
  );
  console.log(
    `Found ${nspsResp.networkSupplyPoints.length} network supply points in dataset ${nspsResp.href}`
  );
}, 30000);

test("New Zealand EA Network Supply Points File Download", async () => {
  let nsps = new NetworkSupplyPoints();
  let files = await nsps.loadFileList();
  const localPath = "/tmp/networkSupplyPoint";
  await nsps.downloadFile(files[0], `${localPath}/${files[0]}`);
  await nsps.crawler.deleteFolderRecursively(`${localPath}/${files[0]}`);
}, 30000);
