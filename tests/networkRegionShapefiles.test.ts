import NetworkRegionShapefiles, {
  NetworkRegionShapeFileType,
} from "../src/networkRegionShapefile/networkRegionShapefiles";

test("Load WGS84 NRR GeoJSON", async () => {
  let ts = Date.now();
  let nrs = new NetworkRegionShapefiles();
  let nrss = await nrs.loadShapefile(
    NetworkRegionShapeFileType.WGS84_GeoJSON_NRR
  );

  // ensure top-level fields are populated correctly
  expect(nrss.ts).toBeGreaterThan(ts);
  expect(nrss.updatedAt.length).toBeGreaterThan(1);
  expect(nrss.networkRegionShapefiles).toBeDefined();

  // ensure the overal record is generated correctly, and the size of
  // JSON is smaller than 400K which is the maximum size of DynamoDB
  let all = nrss.networkRegionShapefiles.filter(
    (n) => n.id == `${NetworkRegionShapeFileType.WGS84_GeoJSON_NRR}/ALL`
  );
  expect(all.length).toBe(1);
  expect(all[0].region == NetworkRegionShapeFileType.WGS84_GeoJSON_NRR);

  // in ALL record, i should contain all the regions
  let allJson = JSON.parse(all[0].json);
  expect(allJson.features.length + 1).toBe(nrss.networkRegionShapefiles.length);

  // ensure each of the regions is populated correctly
  nrss.networkRegionShapefiles.forEach((n) => {
    expect(n.region).toBeDefined();
    expect(n.id).toBeDefined();
    expect(n.ts).toBeGreaterThan(ts);
    expect(n.json.length).toBeLessThan(400000); // 400KB
  });

  // statistics and samples
  console.log(
    `Found ${
      nrss.networkRegionShapefiles.length - 1
    } shapefiles for NZ network providers`
  );
  console.log(
    nrss.networkRegionShapefiles[nrss.networkRegionShapefiles.length - 1]
  );
}, 30000);

test("Load WGS84 Zone GeoJSON", async () => {
  let ts = Date.now();
  let zone = new NetworkRegionShapefiles();
  let zones = await zone.loadShapefile(
    NetworkRegionShapeFileType.WGS84_GeoJSON_Zone
  );

  // ensure top-level fields are populated correctly
  expect(zones.ts).toBeGreaterThan(ts);
  expect(zones.updatedAt.length).toBeGreaterThan(1);
  expect(zones.networkRegionShapefiles).toBeDefined();

  // ensure the overal record is generated correctly, and the size of
  // JSON is smaller than 400K which is the maximum size of DynamoDB
  let all = zones.networkRegionShapefiles.filter(
    (n) => n.id == `${NetworkRegionShapeFileType.WGS84_GeoJSON_Zone}/ALL`
  );
  expect(all.length).toBe(1);
  expect(all[0].region == NetworkRegionShapeFileType.WGS84_GeoJSON_Zone);

  // in ALL record, i should contain all the regions
  let allJson = JSON.parse(all[0].json);
  expect(allJson.features.length + 1).toBe(
    zones.networkRegionShapefiles.length
  );

  // ensure each of the regions is populated correctly
  zones.networkRegionShapefiles.forEach((n) => {
    expect(n.region).toBeDefined();
    expect(n.id).toBeDefined();
    expect(n.ts).toBeGreaterThan(ts);
    expect(n.json.length).toBeLessThan(400000); // 400KB
  });

  // statistics and samples
  console.log(
    `Found ${
      zones.networkRegionShapefiles.length - 1
    } shapefiles for NZ network zones`
  );
  console.log(
    zones.networkRegionShapefiles[zones.networkRegionShapefiles.length - 1]
  );
}, 30000);

test("Load NZTM NRR GeoJSON", async () => {
  let ts = Date.now();
  let nrs = new NetworkRegionShapefiles();
  let nrss = await nrs.loadShapefile(
    NetworkRegionShapeFileType.NZTM_GeoJSON_NRR
  );

  // ensure top-level fields are populated correctly
  expect(nrss.ts).toBeGreaterThan(ts);
  expect(nrss.updatedAt.length).toBeGreaterThan(1);
  expect(nrss.networkRegionShapefiles).toBeDefined();

  // ensure the overal record is generated correctly, and the size of
  // JSON is smaller than 400K which is the maximum size of DynamoDB
  let all = nrss.networkRegionShapefiles.filter(
    (n) => n.id == `${NetworkRegionShapeFileType.NZTM_GeoJSON_NRR}/ALL`
  );
  expect(all.length).toBe(1);
  expect(all[0].region == NetworkRegionShapeFileType.NZTM_GeoJSON_NRR);

  // in ALL record, i should contain all the regions
  let allJson = JSON.parse(all[0].json);
  expect(allJson.features.length + 1).toBe(nrss.networkRegionShapefiles.length);

  // ensure each of the regions is populated correctly
  nrss.networkRegionShapefiles.forEach((n) => {
    expect(n.region).toBeDefined();
    expect(n.id).toBeDefined();
    expect(n.ts).toBeGreaterThan(ts);
    expect(n.json.length).toBeLessThan(400000); // 400KB
  });

  // statistics and samples
  console.log(
    `Found ${nrss.networkRegionShapefiles.length - 1} shapefiles for NZ zones`
  );
  console.log(
    nrss.networkRegionShapefiles[nrss.networkRegionShapefiles.length - 1]
  );
}, 30000);

test("Load NZTM Zone GeoJSON", async () => {
  let ts = Date.now();
  let zone = new NetworkRegionShapefiles();
  let zones = await zone.loadShapefile(
    NetworkRegionShapeFileType.NZTM_GeoJSON_Zone
  );

  // ensure top-level fields are populated correctly
  expect(zones.ts).toBeGreaterThan(ts);
  expect(zones.updatedAt.length).toBeGreaterThan(1);
  expect(zones.networkRegionShapefiles).toBeDefined();

  // ensure the overal record is generated correctly, and the size of
  // JSON is smaller than 400K which is the maximum size of DynamoDB
  let all = zones.networkRegionShapefiles.filter(
    (n) => n.id == `${NetworkRegionShapeFileType.NZTM_GeoJSON_Zone}/ALL`
  );
  expect(all.length).toBe(1);
  expect(all[0].region == NetworkRegionShapeFileType.NZTM_GeoJSON_Zone);

  // in ALL record, i should contain all the regions
  let allJson = JSON.parse(all[0].json);
  expect(allJson.features.length + 1).toBe(
    zones.networkRegionShapefiles.length
  );

  // ensure each of the regions is populated correctly
  zones.networkRegionShapefiles.forEach((n) => {
    expect(n.region).toBeDefined();
    expect(n.id).toBeDefined();
    expect(n.ts).toBeGreaterThan(ts);
    expect(n.json.length).toBeLessThan(400000); // 400KB
  });

  // statistics and samples
  console.log(
    `Found ${
      zones.networkRegionShapefiles.length - 1
    } shapefiles for NZ network zones`
  );
  console.log(
    zones.networkRegionShapefiles[zones.networkRegionShapefiles.length - 1]
  );
}, 30000);
