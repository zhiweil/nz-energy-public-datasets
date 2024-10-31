//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import ThirdPartyProviders from "../src/thirdPartyProvider/thirdPartyProviders";

test("EA third party provider", async () => {
  const ts = Date.now();

  let tpp = new ThirdPartyProviders();
  const tpps = await tpp.loadThirdPartyProviders();
  console.log(JSON.stringify(tpps, null, 2));
  expect(tpps).toBeTruthy();

  // ensure that we got the identifiers right
  tpps.thirdPartyProviders.forEach((t) => {
    expect(t.identifier.length).toBeLessThan(5);
  });

  // ensure top-leve fields are correct
  expect(tpps.href).toBeTruthy();
  expect(tpps.href.startsWith("https://")).toBeTruthy();
  expect(tpps.ts).toBeGreaterThan(0);
  expect(tpps.ts).toBeGreaterThan(ts);

  // ensure all fields are parsed correctly
  tpps.thirdPartyProviders.forEach((t) => {
    expect(t.identifier).toBeTruthy();
    expect(t.orgnisation).toBeTruthy();
    expect(t.ts).toBeGreaterThan(0);
    expect(t.ts).toBeGreaterThan(ts);
  });
}, 15000);
