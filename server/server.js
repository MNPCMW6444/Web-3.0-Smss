import express from "express";
import CacheService from "express-api-cache";
import Web3 from "web3";
import Twilio from "twilio";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const DegenBoxABI = require("./DegenBoxABI.json");

const ETH_RPC_URL =
  "https://mainnet.infura.io/v3/a7e39996c734463f97b05564e14b2764";
const web3_eth = new Web3(ETH_RPC_URL);

const MIM_ADDRESS_ETH =
  "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3".toLowerCase();

const DEGEN_BOX_ADDRESS_ETH =
  "0xd96f48665a1410c0cd669a88898eca36b9fc2cce".toLowerCase();

const ETH_CAULDRON = {
  name: "UST",
  address: "0x59e9082e068ddb27fc5ef1690f9a9f22b32e573f".toLowerCase(),
};
const getBorrowableMimsEthereum = async () => {
  let borrowableMims = {
    chain: "Ethereum",
    cauldron: {},
  };

  const DegenBoxContractEthereum = new web3_eth.eth.Contract(
    DegenBoxABI,
    DEGEN_BOX_ADDRESS_ETH
  );

  try {
    const block = await web3_eth.eth.getBlockNumber();
    const { name, address } = ETH_CAULDRON;
    const borrowableMIMs = await DegenBoxContractEthereum.methods
      .balanceOf(MIM_ADDRESS_ETH, address)
      .call(null, block);
    borrowableMims.cauldron = {
      name,
      borrowableMIMs: parseInt(Web3.utils.fromWei(borrowableMIMs)),
    };
    return (
      "is " +
      [
        new Intl.NumberFormat("de-DE").format(
          Web3.utils.fromWei(borrowableMIMs)
        ),
      ]
    );
  } catch (error) {
    console.log("Error on Ethereum fetch : ", error);
  }
};

const app = express();
const cache = CacheService.cache;
const minnininn = 500000;
const minianc = 5500000000;
const accountSid = "ACb56542d282e469142290abbc1c21b238";
const authToken = "5e093feacc8d6afbc6471b70a641fa3d";
const client = new Twilio(accountSid, authToken);

app.set("port", process.env.PORT || 5000);
app
  .get("/", function (request, response) {
    var result = "App is running";
    response.send(result);
  })
  .listen(app.get("port"), async function () {
    console.log("Bot is Running");
    client.messages
      .create({
        body:
          "Bot is running! will check available MIM and ANC Depsit every 30 sconds and will notify if MIM>" +
          minnininn +
          " or Anc Deposit is less than " +
          minianc,
        from: "+14106715603",
        to: "+12312374619",
      })
      .then((message) => console.log(message.sid));
  });

app.get("/getBorrowableMims", cache("5 seconds"), async (req, res) => {
  let sum = 0;
  try {
    const borrwableEth = await getBorrowableMimsEthereum();
    let borrwableEth2 = borrwableEth.substring(2, borrwableEth.length - 1);
    borrwableEth2.split(".").join("");
    let checkedNew = borrwableEth2.split(".").join("");
    checkedNew = checkedNew.split(",").join(".");
    sum = parseFloat(checkedNew);
    console.log(
      "There are " +
        sum +
        " MIMS, so " +
        (sum > minnininn ? "SMS has been sent" : "SMS has NOT been sent")
    );
    if (sum > minnininn) {
      client.messages
        .create({
          body:
            "There are " +
            sum +
            " MIMs!! checking again in 30 seconds and will alert if still >" +
            minnininn,
          from: "+14106715603",
          to: "+12312374619",
        })
        .then((message) => console.log(message.sid));
    }
  } catch (e) {
    console.log("A problem accoured, the folowing error was caught:");
    console.log(e);
  }
  res.json({
    message: sum > minnininn ? "SMS has been sent" : "SMS has NOT been sent",
  });
});

app.get("/anchor/:value", cache("5 seconds"), async (req, res) => {
  let value = req.params.value;
  //console.log("value is "+value);
  let deposited = parseInt(value.split(",").join(""));
  //console.log("deposited is "+deposited);

  //deposited=deposited.substring(0,deposited.indexOf("%"));
  //

  //console.log("deposited is "+deposited);

  if (deposited < minianc)
    //{console.log(3);}

    client.messages
      .create({
        body: "DEPOSIT ON ANCHOR IS " + deposited + " - LESS THAN " + minianc,
        from: "+14106715603",
        to: "+12312374619",
      })
      .then((message) => console.log(message.sid));

  console.log(
    "Anc deposit is " +
      deposited +
      " UST, so " +
      (deposited < minianc ? "SMS has been sent" : "SMS has NOT been sent")
  );

  res.json({
    message:
      deposited < minianc ? "SMS has been sent" : "SMS has NOT been sent",
  });
});
