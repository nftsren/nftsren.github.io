const fs = require("fs");
const util = require("util");
const path = require("path");
const BN = require("bn.js");
const rimraf = require("rimraf");

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const rmdir = util.promisify(rimraf);

const EpochData1 = require("../src/hooks/merkle/1.json");
const EpochData2 = require("../src/hooks/merkle/2.json");
const EpochData3 = require("../src/hooks/merkle/3.json");
const EpochData4 = require("../src/hooks/merkle/4.json");
const EpochData5 = require("../src/hooks/merkle/5.json");
const EpochData6 = require("../src/hooks/merkle/6.json");
const EpochData7 = require("../src/hooks/merkle/7.json");
const EpochData8 = require("../src/hooks/merkle/8.json");
const EpochData9 = require("../src/hooks/merkle/9.json");
const EpochData10 = require("../src/hooks/merkle/10.json");
const EpochData11 = require("../src/hooks/merkle/11.json");
const EpochData12 = require("../src/hooks/merkle/12.json");
const EpochData13 = require("../src/hooks/merkle/13.json");
const EpochData14 = require("../src/hooks/merkle/14.json");
const EpochData15 = require("../src/hooks/merkle/15.json");
const EpochData16 = require("../src/hooks/merkle/16.json");
const EpochData17 = require("../src/hooks/merkle/17.json");
const EpochData18 = require("../src/hooks/merkle/18.json");
const EpochData19 = require("../src/hooks/merkle/19.json");

const epochs = [
  EpochData1,
  EpochData2,
  EpochData3,
  EpochData4,
  EpochData5,
  EpochData6,
  EpochData7,
  EpochData8,
  EpochData9,
  EpochData10,
  EpochData11,
  EpochData12,
  EpochData13,
  EpochData14,
  EpochData15,
  EpochData16,
  EpochData17,
  EpochData18,
  EpochData19,
];

const template = (name, epoch, mediaFile, artist) => {
  const metadata = {
    name,
    series: `Epoch ${epoch}`,
    attributes: [
      {
        trait_type: `epoch`,
        value: `${epoch}`,
      },
      {
        trait_type: `tag`,
        value: `NFTs.REN`,
      },
    ],
    image: mediaFile.replace(
      "/images/",
      "ipfs://Qmf1pRGHUX1gtVX6t7b1KsBtSHargyMwATvDH48B63wABa/"
    ),
  };
  if (artist) {
    metadata.artist = artist;
  }
  return metadata;
};

const tokenIdSeparator = 100000000;

const main = async () => {
  await rmdir("./metadata");
  await mkdir("./metadata");

  for (const epoch of epochs) {
    console.log(`Epoch #${epoch.id}`);
    for (let i = 0; i < epoch.nfts.length; i++) {
      const nft = epoch.nfts[i];
      const metadata = template(nft.name, epoch.id, nft.url, epoch.artist);
      const hex = tokenIdSeparator * epoch.id + i + 1;
      const hexBuffer = new BN(hex)
        .toArrayLike(Buffer, "be", 32)
        .toString("hex");
      await mkdir(`./metadata/${hexBuffer}`);
      await writeFile(
        `./metadata/${hexBuffer}/metadata.json`,
        JSON.stringify(metadata, null, "  ")
      );

      console.log(`\tArtwork #${i + 1}: ${hexBuffer}`);
    }
  }
};

main().catch(console.error);
