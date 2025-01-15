//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import ThirdPartyProviders from "../src/thirdPartyProvider/thirdPartyProviders";
import { ThirdPartyProvider } from "../src/thirdPartyProvider/thirdPartyProviders";
test("EA third party provider", async () => {
  const ts = Date.now();

  let tpp = new ThirdPartyProviders();
  const tpps = await tpp.loadThirdPartyProviders();
  expect(tpps).toBeTruthy();
  console.log("Found third party providers: ", tpps.thirdPartyProviders.length);

  // ensure that we got the identifiers right
  tpps.thirdPartyProviders.forEach((t) => {
    expect(t.identifier.length).toBeLessThan(15);
  });

  // check duplicate
  const tppSet = new Set<string>();
  tpps.thirdPartyProviders.forEach((t) => {
    tppSet.add(t.organisation);
  });
  console.log("Found unique third party providers: ", tppSet.size);
  for (let t of tppSet) {
    let ts = tpps.thirdPartyProviders.filter((tpp) => tpp.organisation === t);
    if (ts.length > 1) {
      console.log(
        "Duplicate third party provider: ",
        JSON.stringify(ts, null, 2)
      );
    }
    expect(ts.length).toBe(1);
  }

  // ensure top-leve fields are correct
  expect(tpps.href).toBeTruthy();
  expect(tpps.href.startsWith("https://")).toBeTruthy();
  expect(tpps.ts).toBeGreaterThan(0);
  expect(tpps.ts).toBeGreaterThan(ts);

  // ensure all fields are parsed correctly
  tpps.thirdPartyProviders.forEach((t) => {
    expect(t.identifier).toBeTruthy();
    expect(t.organisation).toBeTruthy();
    expect(t.ts).toBeGreaterThan(0);
    expect(t.ts).toBeGreaterThan(ts);
  });
}, 15000);

test("Method equals()", async () => {
  const ts = Date.now();

  let tpp = new ThirdPartyProviders();
  const tpps = await tpp.loadThirdPartyProviders();
  console.log(JSON.stringify(tpps, null, 2));
  expect(tpps).toBeTruthy();

  const tpp1 = tpps.thirdPartyProviders[0];
  console.log(JSON.stringify(tpp1, null, 2));

  const tpp2 = new ThirdPartyProvider(JSON.parse(JSON.stringify(tpp1)));
  console.log(JSON.stringify(tpp2, null, 2));
  expect(tpp1.equals(tpp2)).toBeTruthy();

  tpp2.ts = tpp2.ts + 1;
  expect(tpp1.equals(tpp2)).toBeTruthy();

  tpp2.identifier = "FAKE";
  expect(tpp1.equals(tpp2)).toBeFalsy();

  tpp1.identifier = "FAKE";
  expect(tpp1.equals(tpp2)).toBeTruthy();
}, 15000);
