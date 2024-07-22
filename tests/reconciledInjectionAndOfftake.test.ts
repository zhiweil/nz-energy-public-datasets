import ReconciledInjectionsAndOfftakes from "../src/reconciledInjectionAndOfftake/reconciledInjectionsAndofftakes";

test("EMI reconciliation data", async () => {
  let recon = new ReconciledInjectionsAndOfftakes();
  let years = await recon.getMeataDataForYears();
  let files = await recon.getFilesForYear(years[0]);
  await recon.loadFile(years[0], files[0].file, "/tmp/reconciled");
  let csv = recon.crawler.readCsvFile(
    `/tmp/reconciled/${years[0]}/${files[0].file.substring(
      0,
      files[0].file.length - 3
    )}`
  );
  console.log(csv[0]);
  console.log(csv[1]);
}, 300000);
