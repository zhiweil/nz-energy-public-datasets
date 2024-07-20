//==============================================================================
// Copyright Zhiwei Liu. All Rights Reserved.
// (C) Copyright Zhiwei Liu <zhiwei.liu10@gmail.com> 2024
// Node module: @zhiweiliu/nz-energy-public-datasets
// This file is licensed under the MIT License.
// rLicense text available at https://opensource.org/licenses/MIT
// =============================================================================

import { ParticipantFields, Participants } from "../src";

test("Load New Zealand EA Market Partificipants", async () => {
  const participants = new Participants();
  const fields = new ParticipantFields();

  const ps = await participants.loadPartificipants();
  expect(ps.fields.length).toBe(fields.Fields.length);
  expect(ps.participants.length).toBeGreaterThan(0);
  expect(ps.codes.length).toBeGreaterThan(0);

  // ensure all fileds have been populated
  ps.participants.forEach((p) => {
    expect(Object.getOwnPropertyNames(p).length).toBe(fields.Fields.length + 1);

    // name is compulsory
    expect(p.name.trim().length).toBeGreaterThan(0);
  });

  // ensure boolean values are parsed correctly
  let majorParticipants = ps.participants.filter((p) => p.majorParticipant);
  expect(majorParticipants.length).toBeGreaterThan(0);
  let transCustomers = ps.participants.filter((p) => p.transCustomer);
  expect(transCustomers.length).toBeGreaterThan(0);
  let traderInElectricitys = ps.participants.filter(
    (p) => p.traderInElectricity
  );
  expect(traderInElectricitys.length).toBeGreaterThan(0);
  let meps = ps.participants.filter((p) => p.mep);
  expect(meps.length).toBeGreaterThan(0);
  let genAsNongenerators = ps.participants.filter((p) => p.genAsNongenerator);
  expect(genAsNongenerators.length).toBeGreaterThan(0);
  let aths = ps.participants.filter((p) => p.ath);
  expect(aths.length).toBeGreaterThan(0);
  let ancillaryServiceAgents = ps.participants.filter(
    (p) => p.ancillaryServiceAgent
  );
  expect(ancillaryServiceAgents.length).toBeGreaterThan(0);
  let meteringEquipmentOwners = ps.participants.filter(
    (p) => p.meteringEquipmentOwner
  );
  expect(meteringEquipmentOwners.length).toBeGreaterThan(0);
  let loadAggregators = ps.participants.filter((p) => p.loadAggregator);
  expect(loadAggregators.length).toBeGreaterThan(0);
  let purchaseFromCleaningManagers = ps.participants.filter(
    (p) => p.purchaseFromCleaningManager
  );
  expect(purchaseFromCleaningManagers.length).toBeGreaterThan(0);
  let consumerConnectedDirectlyToGrids = ps.participants.filter(
    (p) => p.consumerConnectedDirectlyToGrid
  );
  expect(consumerConnectedDirectlyToGrids.length).toBeGreaterThan(0);
  let transpowers = ps.participants.filter((p) => p.transpower);
  expect(transpowers.length).toBe(0); // non-existent
  let lineOwners = ps.participants.filter((p) => p.lineOwner);
  expect(lineOwners.length).toBeGreaterThan(0);
  let generators = ps.participants.filter((p) => p.generator);
  expect(generators.length).toBeGreaterThan(0);
  let distributors = ps.participants.filter((p) => p.distributor);
  expect(distributors.length).toBeGreaterThan(0);
  let retailers = ps.participants.filter((p) => p.retailer);
  expect(retailers.length).toBeGreaterThan(0);

  // codes - all fields are compulsory
  ps.codes.forEach((c) => {
    expect(c.code).toBeDefined();
    expect(c.name).toBeDefined();
  });

  // display statistic and samples
  console.log(ps.participants[0]);
  console.log(ps.participants[ps.participants.length - 1]);
  console.log(ps.participants[0].codes);
  console.log(ps.participants[ps.participants.length - 1].codes);
  console.log(
    `Found ${ps.participants.length} EA market participants at ${new Date(
      ps.ts
    )}`
  );
});
