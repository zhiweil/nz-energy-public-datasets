# New Zealand Energy Public Datasets

The utilities load public datasets from the New Zealand energy market. These datasets are hosted on websites such as the Electricity Authority, Electricity Market Information, and Transpower.

The NPM package of the utilities is [here](https://www.npmjs.com/package/@zhiweiliu/nz-energy-public-datasets).

```bash
npm i @zhiweiliu/nz-energy-public-datasets
```

## 1. Electricity Authority Participants

The information is hosted on New Zealand [EA Register Page](https://register.ea.govt.nz).

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
