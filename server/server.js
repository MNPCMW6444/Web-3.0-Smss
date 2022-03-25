const express = require("express");
const CacheService = require("express-api-cache");
const Web3 = require("web3");
const Twilio = require("twilio");
const Bot = require("./models/botModel");
const DegenBoxABI = require("./DegenBoxABI.json");
const mongoose = require("mongoose");

const cors = require("cors");

mongoose.connect(
  "mongodb+srv://mnpcmw:pQ1elm16zZqsFxyI@cluster0.113gz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to MongoDB");
  }
);

let exp = new Date("2021-02-13T22:01:10.652Z");
console.log(exp);

let otp;

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
let minmimustG;
let minancG;
let lastedge = 15000000;

const app = express();
const cache = CacheService.cache;
let minmimust = 20000;

let minanc = 11000000000;

const accountSid = "ACb56542d282e469142290abbc1c21b238";
const authToken = "5e093feacc8d6afbc6471b70a641fa3d";
const client = new Twilio(accountSid, authToken);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://laughing-murdock-38b76c.netlify.app",
    ],
    credentials: true,
  })
);

app.set("port", process.env.PORT || 5000);
app
  .get("/", function (request, response) {
    var result = "App is running";
    response.send(result);
  })
  .listen(app.get("port"), async function () {
    try {
      await new Promise((r) => setTimeout(r, 15000));
      minmimustG = (await Bot.findOne()).MIMUSTMinimum;
    } catch (e) {
      console.log(e);
    }
    if (minmimustG) minmimust = minmimustG;
    /* console.log("minmimustG is " + minmimustG);
    console.log("minmimust is " + minmimust); */

    try {
      minancG = (await Bot.findOne()).AnchorMinimum;
    } catch (e) {
      console.log(e);
    }
    if (minancG) minanc = minancG;
    /*  console.log("minancG is " + minancG);
    console.log("minanc is " + minanc); */

    console.log("Bot is Running");

    console.log("seningsms");
    client.messages
      .create({
        body:
          "Bot is running! will check available MIM and ANC Depsit every 30 sconds and will notify if MIM>" +
          minmimust +
          " or Anc Deposit is less than " +
          minanc,
        from: "+14106715603",
        to: "+12312374619",
      })
      .then((message) => console.log("done:" + message.sid));
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
        (sum > minmimust ? "SMS has been sent" : "SMS has NOT been sent")
    );
    if (sum > minmimust) {
      client.messages
        .create({
          body:
            "There are " +
            sum +
            " MIMs!! checking again in 30 seconds and will alert if still >" +
            minmimust,
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
    message: sum > minmimust ? "SMS has been sent" : "SMS has NOT been sent",
  });
});

app.get("/getkey", cache("5 seconds"), async (req, res) => {
  if (new Date() - exp > 300000) {
    otp = parseInt(Math.random() * 1000000);
    exp = new Date();
    client.messages
      .create({
        body: "Your OTP is " + otp + ", valid for 5 Minutes",
        from: "+14106715603",
        to: "+12312374619",
      })
      .then((message) => console.log(message.sid));

    console.log("otp is " + otp);

    res.json({
      message: "code sent",
    });
  } else
    res.json({
      message: "code req is too soon",
    });
});

app.get("/getsettings:key", cache("5 seconds"), async (req, res) => {
  const otp2 = req.params.key;

  res.json({
    message:
      otp == otp2 && new Date() - exp < 300000
        ? { MIM: minmimust, ANC: minanc }
        : { MIM: "WRONG or EXPIRED KEY", ANC: "WRONG or EXPIRED KEY" },
  });
});

app.get("/gettime", cache("5 seconds"), async (req, res) => {
  res.json({
    message: exp,
  });
});

app.put("/configanc/:anc", async (req, res) => {
  const anc = req.params.anc;

  if (anc) {
    minanc = anc;
    const bot = await Bot.findOne();
    bot.AnchorMinimum = minanc;
    await bot.save();
    bot.console.log("seningsms");
    client.messages
      .create({
        body: "configed: anc-" + minanc + " mim-" + minmimust,
        from: "+14106715603",
        to: "+12312374619",
      })
      .then((message) => console.log("done:" + message.sid));
  }

  res.json({
    message: "configed: anc-" + minanc + " mim-" + minmimust,
  });
});

app.put("/configmim/:mim", async (req, res) => {
  const mim = req.params.mim;

  if (mim) {
    minmimust = mim;
    const bot = await Bot.findOne();
    bot.MIMUSTMinimum = minmimust;
    await bot.save();
    client.messages
      .create({
        body: "configed: anc-" + minanc + " mim-" + minmimust,
        from: "+14106715603",
        to: "+12312374619",
      })
      .then((message) => console.log("done:" + message.sid));
  }
  res.json({
    message: "configed: anc-" + minanc + " mim-" + minmimust,
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

  if (deposited < minanc)
    //{console.log(3);}

    client.messages
      .create({
        body: "DEPOSIT ON ANCHOR IS " + deposited + " - LESS THAN " + minanc,
        from: "+14106715603",
        to: "+12312374619",
      })
      .then((message) => console.log(message.sid));

  console.log(
    "Anc deposit is " +
      deposited +
      " UST, so " +
      (deposited < minanc ? "SMS has been sent" : "SMS has NOT been sent")
  );

  res.json({
    message: deposited < minanc ? "SMS has been sent" : "SMS has NOT been sent",
  });
});

app.get("/edge/:value", cache("5 seconds"), async (req, res) => {
  let value = req.params.value;
  //console.log("value is "+value);
  let deposited = parseInt(value.split(",").join(""));
  //console.log("deposited is "+deposited
  //console.log("deposited is "+deposited);
  if (deposited > lastedge)
    //{console.log(3);}

    client.messages
      .create({
        body: "edge is now more than 15M, it is:" + deposited,
        from: "+14106715603",
        to: "+12312374619",
      })
      .then((message) => console.log(message.sid));
  console.log(
    "Edge limit is " +
      deposited +
      " so " +
      (deposited > lastedge ? "SMS has been sent" : "SMS has NOT been sent")
  );
  res.json({
    message:
      deposited > lastedge ? "SMS has been sent" : "SMS has NOT been sent",
  });
  lastedge = deposited;
});
