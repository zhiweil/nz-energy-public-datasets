import { MeteredDataFiles, MeteredDataType } from "../src";

test("EMI metered data", async () => {
  let md = new MeteredDataFiles();
  for (let v of Object.values(MeteredDataType)) {
    let k = v as MeteredDataType;
    let files = await md.getFileList(k);
    let csv = await md.loadFile(k, files[0].file);
    await md.downloadFile(k, files[0].file, "/tmp/meteredData");

    expect(files.length).toBeGreaterThan(0);
    files.forEach((f) => {
      expect(f.file).toMatch(/\.csv$/);
      expect(f.updatedAt.length).toBeGreaterThan(0);
      expect(f.for).toBeGreaterThan(199000);
    });

    // statistics and samples
    console.log(
      `Loaded ${csv.length} lines of CSV for file type ${k}. header is: ${csv[0]}`
    );
    console.log(`Found ${files.length} metered data files for type ${k}`);
    console.log(files[0]);
    console.log(files[files.length - 1]);
  }
}, 180000);
