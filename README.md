# New Zealand Energy Public Datasets

The utilities load public datasets from the New Zealand energy market. These datasets are hosted on websites such as the Electricity Authority, Electricity Market Information, and Transpower.

The NPM package of the utilities is [here](https://www.npmjs.com/package/@zhiweiliu/nz-energy-public-datasets).

```bash
npm i @zhiweiliu/nz-energy-public-datasets
```

## 1. Electricity Authority Participants

The information is hosted on New Zealand [EA Website Register Page](https://register.ea.govt.nz).

To load the list of EA participants:

```javascript
import {
  Participants,
  ParticipantResponse,
} from "@zhiweiliu/nz-energy-public-datasets";

/**
 * The loadParticipants() method can accept an optional local folder parameter, which
 * specifies the directory to temporarily store downloaded information before processing.
 * By default, this folder is set to "/tmp".
 **/
const participants = new Participants();
const ps: ParticipantResponse = await participants.loadPartificipants(
  "/to/local/folder"
);
```

## 2. Electricity Authority Third Party Providers

The information is hosted on the "Third-party providers" tab of New Zealand [EA Website Identifiers Page](https://register.ea.govt.nz/identifiers).

To load the list of EA third-party providers:

```javascript
import ThirdPartyProviders from "@zhiweiliu/nz-energy-public-datasets";

const tpps = new ThirdPartyProviders();
const providers: ThirdPartyProviderResponse =
  await tpps.loadThirdPartyProviders();
```

## 3. Network Supply Points (NSP)

The information is hosted on the [Electricity Market Information website](https://www.emi.ea.govt.nz/Wholesale/Datasets/MappingsAndGeospatial/NetworkSupplyPointsTable).

To load a list of files:

```javascript
let nsps = new NetworkSupplyPoints();
let files = await nsps.loadFileList();
```

To download a specific NSP file:

```javascript
let nsps = new NetworkSupplyPoints();
let files = await nsps.loadFileList();
const localPath = "/tmp/networkSupplyPoint";
// download the latest NSP file
await nsps.downloadFile(files[0], `${localPath}/${files[0]}`);

// TODO: copy to the location you would like to store the file

// delete downloaded file from the temporary folder
await nsps.crawler.deleteFolderRecursively(`${localPath}/${files[0]}`);
```

To load NSP data into a collection of objects:

```javascript
let nsps = new NetworkSupplyPoints();
let files = await nsps.loadFileList();
let nspsResp = await nsps.loadNetworkSupllyPoints(files[0]);
```

# Network Reporting Regions and Zones

The information is hosted on the [Electricity Market Information website](https://www.emi.ea.govt.nz/Wholesale/Datasets/MappingsAndGeospatial/NetworkRegionShapefiles).

To load a list of network reporting regions and zones file to a local directory:

```json
  let nrs = new NetworkRegionShapefiles();
  let nrss = await nrs.loadShapefile(
    NetworkRegionShapeFileType.NZTM_GeoJSON_NRR,
    "/tmp"
  );
```
