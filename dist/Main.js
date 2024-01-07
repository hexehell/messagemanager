"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from5, except, desc) => {
  if (from5 && typeof from5 === "object" || typeof from5 === "function") {
    for (let key of __getOwnPropNames(from5))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from5[key], enumerable: !(desc = __getOwnPropDesc(from5, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/cli/classes/CLIProgram.ts
var import_inquirer2 = __toESM(require("inquirer"));
var import_rxjs4 = require("rxjs");

// src/cli/Commands/Messages/classes/SendSimpleMessage.ts
var import_inquirer = __toESM(require("inquirer"));
var SendSimpleMessage = class {
  constructor(back) {
    this.manageOptions = async (options) => {
      var _a, _b, _c;
      const messageCreation = (_b = (_a = this.passInOptions) == null ? void 0 : _a.extraParams) != null ? _b : {};
      const action = options == null ? void 0 : options.action;
      switch (action) {
        case "Preparar Mensaje":
          console.clear();
          await import_inquirer.default.prompt({ message: "titulo del Mensaje", name: "titulo", type: "input" }).then((answer) => {
            messageCreation.titulo = answer.titulo;
          });
          await import_inquirer.default.prompt({ message: "texto del Mensaje", name: "message", type: "input" }).then((answer) => {
            messageCreation.mensaje = answer.message;
          });
          options.extraParams = messageCreation;
          CLIProgram.setNextCommand(this, options);
          break;
        case "Agregar Afiliados u otros telefonos a enviar":
          break;
        case "Seleccionar telefonos Bots":
          break;
        case "Vista previa antes de Enviar":
          console.clear();
          console.log({ ...(_c = this.passInOptions) == null ? void 0 : _c.extraParams });
          CLIProgram.setNextCommand(this, options);
          break;
      }
    };
    this.ListOptions = (options) => ({
      type: "list",
      name: "action",
      message: "Selecciona una opcion",
      choices: [
        "Preparar Mensaje",
        "Agregar Afiliados u otros telefonos a enviar",
        "Seleccionar telefonos Bots",
        "Vista previa antes de Enviar",
        "Enviar",
        "Guardar",
        "atras"
      ]
    });
    this.back = back;
  }
};

// src/database/Schemas/Message/Message.schema.ts
var mongoose = require("mongoose");
var DBMessageSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true },
  ack: { type: Number, required: true },
  name: { type: String, required: true },
  id: { type: String, required: true },
  from: { type: String, default: void 0 },
  to: { type: String, default: void 0 },
  author: { type: String, default: void 0 },
  fromMe: { type: Boolean, required: true },
  fromGroup: { type: Boolean, required: true },
  hasMedia: { type: Boolean, required: true },
  body: { type: String, required: true },
  link: { type: String, default: void 0 }
});
DBMessageSchema.index({ id: 1, timestamp: 1 }, { unique: true });
var MessageModel = mongoose.model("Message", DBMessageSchema);
var Message_schema_default = MessageModel;

// src/database/classes/Messages/abstract/Message.ts
var AbstractMessageData = class {
  constructor() {
  }
};

// src/database/classes/Messages/classes/MessageMongo.ts
var MessageMongo = class extends AbstractMessageData {
  getAffByID(id) {
    throw new Error("Method not implemented.");
  }
  listAllByName() {
    throw new Error("Method not implemented.");
  }
  async create(message) {
    return !!await Message_schema_default.create(message);
  }
  findFirst(name) {
    throw new Error("Method not implemented.");
  }
  update(old, newName) {
    throw new Error("Method not implemented.");
  }
  delete(old) {
    throw new Error("Method not implemented.");
  }
};

// src/Sender/MessageSender.ts
var SenderUtils = class {
  static formatNumber(number) {
    number = number.trim();
    number = /^\d+$/.test(number) ? number : number.replace(/\D/g, "");
    number = number.startsWith("521") && number.length === 13 ? number : number.length === 10 ? "521".concat(number) : "0000000000000";
    number = !!!number.endsWith("@c.us") ? number.concat("@c.us") : number;
    return number;
  }
};
var DB = class {
  constructor(sender) {
    this.sender = sender;
  }
  async saveMessage(message) {
    const affBD = new MessageMongo();
    const messageDB = [message].map(({
      timestamp,
      ack,
      id,
      from: from5,
      to,
      author,
      fromMe,
      hasMedia,
      body
    }) => ({
      timestamp,
      ack,
      id,
      from: from5,
      to,
      author,
      fromMe,
      hasMedia,
      body
    }))[0];
    messageDB.name = await message.getChat().then((chat) => chat.name);
    messageDB.fromGroup = !!message.author;
    affBD.create(messageDB);
  }
};
var Test = class {
  constructor(sender) {
    this.sender = sender;
  }
  async sendTestMessage(number) {
    number = SenderUtils.formatNumber(number);
    const message = await this.sender.client.sendMessage(number, "Prueba").catch((err) => console.log(err));
    if (message) {
      this.sender.DB.saveMessage(message);
    }
  }
  async sendImageTestMessage(number) {
    number = SenderUtils.formatNumber(number);
    const message = await this.sender.client.sendMessage(number, {
      data: "data:image/jpeg;base64,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",
      mimetype: "image/jpeg"
    }).catch((err) => console.log(err));
  }
  async sendImageAndMessageTest(number) {
    await this.sendTestMessage(number);
    await this.sendImageTestMessage(number);
  }
};
var MessageSender = class {
  constructor(client) {
    this.client = client;
    this.tester = new Test(this);
    this.DB = new DB(this);
  }
};

// src/cli/utils/CliUtils.ts
var import_cli_table = __toESM(require("cli-table"));
var import_uuid = require("uuid");
var CLIUtils = class _CLIUtils {
  static async createInput({ name, message, initial }) {
    const { Input } = require("enquirer");
    const prompt = new Input({
      message,
      initial
    });
    return await prompt.run().then((answer) => {
      return { answer, field: name };
    }).catch(console.log);
  }
  static async YesNoDialog({ name, message }) {
    const { Confirm } = require("enquirer");
    const prompt = new Confirm({
      name: "question",
      message
    });
    return await prompt.run().then((answer) => {
      return { answer, field: name };
    }).catch(console.error);
  }
  static async createForm(message, choices) {
    const { Form } = require("enquirer");
    const prompt = new Form({
      name: "something",
      message,
      choices
    });
    return await prompt.run().then((value) => value).catch(console.error);
  }
  static async createDateTimePicker({ name, message }) {
    const inquirer3 = require("inquirer");
    inquirer3.registerPrompt("datetime", require("inquirer-datepicker-prompt"));
    var questions = [
      {
        type: "datetime",
        name: "dt",
        message: message + " (dd/MM/yyyy)",
        format: ["dd", "/", "MM", "/", "yyyy"]
      }
    ];
    return await inquirer3.prompt(questions).then((answer) => {
      return { answer: answer.dt, field: name };
    });
  }
  static async createAutoComplete({ name, autocomplete, message, fieldToShow }) {
    const arrWithID = autocomplete.map((row) => {
      return { show: fieldToShow ? row[fieldToShow] : row, id: (0, import_uuid.v4)() };
    });
    const arrShow = autocomplete.map((row) => fieldToShow ? row[fieldToShow] : row);
    const { AutoComplete } = require("enquirer");
    const prompt = new AutoComplete({
      name: "autocomplete",
      message,
      limit: 10,
      initial: 0,
      choices: Array.from(arrShow.filter((x, i, a) => a.indexOf(x) == i))
    });
    const ans = await prompt.run().then((answer) => answer).catch((error) => console.log(error));
    return { answer: ans, field: name };
  }
  static showVerticalTable(something) {
    console.log(_CLIUtils.createVerticalTable(something).toString());
  }
  static showHorizontalTable(something, colsWidth) {
    const values = something.map((entry) => Object.values(entry)).map((entry) => entry.map((val) => val));
    const headers = something.map((entry) => Object.keys(entry))[0];
    console.log(_CLIUtils.createHorizontalTable(headers, values, colsWidth).toString());
  }
  static createHorizontalTable(headers, body, colsWidth) {
    let tbl;
    if (!!!colsWidth)
      tbl = new import_cli_table.default({ style: { "padding-right": 10 }, head: headers });
    else
      tbl = new import_cli_table.default({ style: { "padding-right": 10 }, head: headers, colWidths: colsWidth });
    body.forEach((arr) => {
      tbl.push(arr);
    });
    return tbl;
  }
  static createVerticalTable(something) {
    const affTbl = new import_cli_table.default({ style: { "padding-right": 10 } });
    Object.entries(something).map((entry) => {
      let row = {};
      if (typeof entry[1] === typeof Date) {
        entry[1] = new Date(entry[1].getDate());
      }
      if (Array.isArray(entry[1])) {
        entry[1] = entry[1].join(" ");
      }
      row[entry[0]] = entry[1];
      affTbl.push(row);
      return 0;
    });
    return affTbl;
  }
};

// src/transformers/PhonesInfo.ts
var fs = __toESM(require("fs-extra"));

// src/database/Schemas/Bot/Bot.Schema.ts
var import_mongoose = __toESM(require("mongoose"));
var botSchema = new import_mongoose.default.Schema({
  id: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  botType: {
    type: String,
    required: true,
    default: "wwjs"
  }
}, { collection: "Bot", timestamps: { createdAt: false, updatedAt: "updatedAt" } });
var BotModel = import_mongoose.default.model("Bot", botSchema);
var Bot_Schema_default = BotModel;

// src/database/classes/bot/abstract/AbstractBot.ts
var AbstractBotData = class {
  constructor() {
  }
};

// src/database/classes/bot/classes/BotMongo.ts
var BotMongo = class extends AbstractBotData {
  async getBotById(id) {
    return [await Bot_Schema_default.findOne({ id }, {
      id: 1,
      phone: 1
    })].map((bot) => ({
      id: bot == null ? void 0 : bot.id,
      phone: bot == null ? void 0 : bot.phone
    }))[0];
  }
  async listAllByPhoneId() {
    return (await Bot_Schema_default.find({}, { id: 1, phone: 1, botType: 1 })).map((botbd) => ({ id: botbd.id, phone: botbd.phone, botType: botbd.botType }));
  }
  async create({ id, phone }) {
    return !!await Bot_Schema_default.create({ id, phone });
  }
  async upsert(bot) {
    const { id, phone, botType = "wwjs" } = bot;
    const filter2 = { phone };
    const update = { id, phone, botType };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    return !!await Bot_Schema_default.findOneAndUpdate(filter2, update, options).exec().catch((err) => console.log(err));
  }
  async delete({ phone }) {
    return !!(await Bot_Schema_default.deleteOne({ phone })).deletedCount;
  }
};

// src/transformers/PhonesInfo.ts
var PhoneTypes = /* @__PURE__ */ ((PhoneTypes3) => {
  PhoneTypes3["wwjs"] = "wwjs";
  PhoneTypes3["venom"] = "venom";
  PhoneTypes3["meta"] = "meta";
  return PhoneTypes3;
})(PhoneTypes || {});
var _PhonesInfo = class _PhonesInfo {
  static getPhonesfrom(phoneType) {
    return _PhonesInfo.ListPhonesTypes().filter((type) => phoneType.toLocaleLowerCase() === type.toLocaleLowerCase()).map((type) => `${process.env.PATHTOPHONES}/${type}`).flat(1).map((pathTo) => fs.readdirSync(pathTo)).flat(1);
  }
  static async getBots(phoneType) {
    const botBD = new BotMongo();
    const savedPhones = await botBD.listAllByPhoneId();
    return savedPhones.filter((bot) => bot.botType === phoneType.toLocaleLowerCase());
  }
  static evaluateTypePath(type, path2) {
    switch (type.toLocaleLowerCase()) {
      case "wwjs":
        return _PhonesInfo.IsWwjsPhone(path2);
    }
    return false;
  }
  static selectAvailablePhonesClients(phones) {
    return phones.length !== 0 ? Array.from(_PhonesInfo.PhonesAvailables.values()).map(({ bot, client }) => ({ phone: bot.phone, client })).filter(({ phone }) => !!phones.find((selected) => phone === selected)).map((phone) => phone.client) : Array.from(_PhonesInfo.PhonesAvailables.values()).map(({ client }) => client);
  }
  static getAllAvailablePhonesForChoosing() {
    return Array.from(_PhonesInfo.PhonesAvailables.keys());
  }
  static getClientByPhone(phone) {
    var _a;
    return (_a = _PhonesInfo.PhonesAvailables.get(phone)) == null ? void 0 : _a.client;
  }
  static getAvailablePhonesByType(type) {
    return Array.from(_PhonesInfo.PhonesAvailables.values()).filter(({ bot }) => bot.botType === type);
  }
  static IsWwjsPhone(path2) {
    return path2.startsWith("session");
  }
};
_PhonesInfo.PhonesAvailables = /* @__PURE__ */ new Map();
_PhonesInfo.ListPhonesTypes = () => {
  return Array.from(Object.keys(PhoneTypes));
};
_PhonesInfo.getAvailablePhoneTypes = () => {
  const listTypes = _PhonesInfo.ListPhonesTypes();
  return fs.readdirSync(process.env.PATHTOPHONES).filter((file) => fs.statSync(`${process.env.PATHTOPHONES}/${file}`).isDirectory()).filter((dir) => !!listTypes.find((type) => type.toLocaleLowerCase() === dir.toLocaleLowerCase())).filter(
    (type) => fs.readdirSync(`${process.env.PATHTOPHONES}/${type}`).filter((dir) => _PhonesInfo.evaluateTypePath(type, dir)).some((x) => x)
  );
};
var PhonesInfo = _PhonesInfo;

// src/cli/Commands/Messages/classes/TestMessage.ts
var TestMessage = class {
  constructor(back) {
    this.manageOptions = async (options) => {
      const action = options == null ? void 0 : options.action;
      if (action === "atras")
        return CLIProgram.setNextCommand(this.back);
      const typeMessage = await CLIUtils.createAutoComplete({ name: "type", message: "Que tipo de mensaje deseas mandar?", autocomplete: ["texto", "imagen"] });
      const phoneTo = await CLIUtils.createInput({ name: "message", message: "escribie el telefono prueba" });
      const sender = new MessageSender(PhonesInfo.getClientByPhone(options.action));
      switch (typeMessage.answer) {
        case "texto":
          await sender.tester.sendTestMessage(phoneTo.answer);
          console.log("Mensaje de prueba ha sido enviado");
          break;
        case "imagen":
          await sender.tester.sendImageTestMessage(phoneTo.answer);
          console.log("Mensaje de prueba ha sido enviado");
          break;
      }
      return CLIProgram.setNextCommand(this.back);
    };
    this.ListOptions = (options) => ({
      type: "list",
      name: "action",
      message: "Selecciona una opcion",
      choices: Array.prototype.concat(PhonesInfo.getAllAvailablePhonesForChoosing(), ["atras"])
    });
    this.back = back;
  }
};

// src/cli/Commands/Messages/classes/Messages.ts
var Messages = class {
  constructor(back) {
    this.manageOptions = (options) => {
      const action = options == null ? void 0 : options.action;
      switch (action) {
        case "Enviar Mensaje simple":
          const simpleMessage = new SendSimpleMessage(this);
          CLIProgram.setNextCommand(simpleMessage);
          break;
        case "Enviar Mensaje de Prueba":
          const testMessage = new TestMessage(this);
          CLIProgram.setNextCommand(testMessage);
          break;
        case "atras":
          CLIProgram.setNextCommand(this.back);
          break;
      }
    };
    this.ListOptions = (options) => ({
      type: "list",
      name: "action",
      message: "Selecciona una opcion",
      choices: [
        "Enviar Mensaje simple",
        "Enviar Mensaje de Prueba",
        "atras"
      ]
    });
    this.back = back;
  }
};

// src/cli/Commands/Phones/classes/ListPhones.ts
var import_fs = __toESM(require("fs"));
var import_rxjs = require("rxjs");
var ListPhones = class {
  constructor(back) {
    this.manageOptions = (options) => {
      PhonesInfo.getAvailablePhonesByType(options.action).map(({ bot }) => bot.phone).forEach((phone) => console.log(phone));
      CLIProgram.setNextCommand(this.back);
    };
    this.ListOptions = () => {
      const options = Array.prototype.concat(PhonesInfo.ListPhonesTypes(), ["atras"]);
      return {
        type: "list",
        name: "action",
        message: "Selecciona una opcion",
        choices: options
      };
    };
    this.back = back;
  }
  // flow$ = (back?: Observable<any> | undefined) => {
  //     this.printPhones()
  // return    back??of()
  // };
  printPhones() {
    var _a, _b, _c;
    !import_fs.default.existsSync((_a = process.env.PATHTOPHONES) != null ? _a : "") && import_fs.default.mkdirSync((_b = process.env.PATHTOPHONES) != null ? _b : "");
    return (0, import_rxjs.from)(
      import_fs.default.readdirSync((_c = process.env.PATHTOPHONES) != null ? _c : "").filter((file) => import_fs.default.statSync(process.env.PATHTOPHONES + file).isDirectory()).filter((dir) => ["wwjs", "venom"].map((phonesCollection) => phonesCollection.toLocaleLowerCase() === dir).some((res) => res)).map((dir) => {
        const botDir = process.env.PATHTOPHONES + dir;
        return import_fs.default.readdirSync(botDir).map((phoneDir) => `${botDir}/${phoneDir}`);
      })
      //   
      //   .filter(dir=>fs.statSync(process.env.PATHTOPHONES+dir).isDirectory())
      //   .filter(dir=>path.basename(dir).startsWith('session-'))
    );
  }
};

// src/transformers/Wwjs/WwjsCreator.ts
var import_rxjs2 = require("rxjs");
var import_uuid3 = require("uuid");
var import_whatsapp_web2 = require("whatsapp-web.js");

// src/transformers/PhoneCreator.ts
var PhoneCreator = class {
  constructor() {
    this.spiner = void 0;
  }
};

// src/transformers/Wwjs/Wwjs.ts
var import_whatsapp_web = require("whatsapp-web.js");

// src/transformers/Factories/interfaces/Message.factory.ts
var MessageAck = /* @__PURE__ */ ((MessageAck2) => {
  MessageAck2[MessageAck2["ACK_ERROR"] = -1] = "ACK_ERROR";
  MessageAck2[MessageAck2["ACK_PENDING"] = 0] = "ACK_PENDING";
  MessageAck2[MessageAck2["ACK_SERVER"] = 1] = "ACK_SERVER";
  MessageAck2[MessageAck2["ACK_DEVICE"] = 2] = "ACK_DEVICE";
  MessageAck2[MessageAck2["ACK_READ"] = 3] = "ACK_READ";
  MessageAck2[MessageAck2["ACK_PLAYED"] = 4] = "ACK_PLAYED";
  return MessageAck2;
})(MessageAck || {});

// src/transformers/Wwjs/Wwjs.ts
var import_node_events = require("events");
var import_nanospinner = require("nanospinner");
var import_uuid2 = require("uuid");
var import_node_path = __toESM(require("path"));
var import_fs_extra = __toESM(require("fs-extra"));
var ClientWwjs = class extends import_node_events.EventEmitter {
  constructor(wwjsClient, dataPath) {
    super();
    this.wwjsClient = wwjsClient;
    this.dataPath = dataPath;
    this.disconnect = async () => {
      return await this.wwjsClient.destroy().then(() => {
        (0, import_nanospinner.createSpinner)("session closed").success();
      }).catch((err) => {
        console.log((0, import_nanospinner.createSpinner)(err.message).error());
      });
    };
    this.whereIsRunning = () => {
      return this.dataPath;
    };
    this.getPhone = () => {
      return this.wwjsClient.info.wid.user;
    };
    this.clientSaved = () => {
      this.emit("saved" /* saved */, this);
    };
    this.clientReloaded = () => {
      this.emit("reloaded" /* reloaded */, this);
    };
    this.clientSavingError = (err) => {
      this.emit("loadError" /* loadError */, err);
    };
    this.wwjsParsedEvents();
  }
  async sendMessage(chatId, content, caption) {
    if (typeof content === "string")
      return this.sendMessageText(chatId, content);
    else {
      return this.sendMessageImage(chatId, content, caption);
    }
  }
  async sendMessageText(chatId, message) {
    const messageSent = await this.wwjsClient.sendMessage(chatId, message, void 0);
    return new MessageWwjs(messageSent, new ChatWwjs(await messageSent.getChat()));
  }
  async sendMessageImage(chatId, image, caption) {
    let mediaPath = (0, import_uuid2.v4)();
    const [dataInfo, base64] = image.data.split(",");
    const mimetype = dataInfo.replace("data:", "").replace(";base64", "");
    mediaPath = import_node_path.default.join("./media", mediaPath + "." + mimetype.replace("image/", ""));
    import_fs_extra.default.writeFileSync(mediaPath, Buffer.from(base64, "base64"));
    const content = MessageWwjs.fromFilePath(mediaPath);
    const messageSent = await this.wwjsClient.sendMessage(chatId, content, { caption });
    try {
      import_fs_extra.default.unlinkSync(mediaPath);
    } catch (err) {
      console.log(err);
    }
    return new MessageWwjs(messageSent, new ChatWwjs(await messageSent.getChat()));
  }
  async initialize() {
    this.wwjsClient.initialize();
    this.emit("init" /* init */, this);
  }
  wwjsParsedEvents() {
    this.wwjsClient.on("qr" /* qr */, (qr) => this.emit("qr" /* qr */, qr));
    this.wwjsClient.on("ready" /* ready */, () => this.emit("ready" /* ready */, this));
  }
  async getChats() {
    return (await this.wwjsClient.getChats()).map((chat) => {
      return new ChatWwjs(chat);
    });
  }
  // on(event: 'qr', listener: (
  //     qr: string
  //  ) => void): this
  //  on(event: 'ready', listener: () => void): this
};
var ChatWwjs = class {
  constructor(wwjschat) {
    this.wwjschat = wwjschat;
    const {
      isGroup,
      name,
      timestamp,
      id
    } = wwjschat;
    this.isGroup = isGroup;
    this.name = name;
    this.timestamp = timestamp;
    this.id = id.user;
  }
  async fetchMessages(searchOptions) {
    return (await this.wwjschat.fetchMessages(searchOptions)).map((message) => {
      return new MessageWwjs(message, this);
    });
  }
  sendMessage() {
    throw new Error("Method not implemented.");
  }
};
var MessageWwjs = class {
  constructor(message, chat) {
    this.message = message;
    this.chat = chat;
    this.getChat = async () => {
      return this.chat;
    };
    this.ack = message.ack;
    this.author = message.author;
    this.body = message.body;
    this.broadcast = message.broadcast;
    this.isStatus = message.isStatus;
    this.from = message.from;
    this.to = message.to;
    this.fromMe = message.fromMe;
    this.hasMedia = message.hasMedia;
    this.id = message.id.id;
    this.vCards = message.vCards;
    this.timestamp = message.timestamp;
    this.type = message.type;
    this.orderId = message.orderId;
    this.title = message.title;
    this.description = message.description;
  }
  async downloadMedia() {
    return await this.message.downloadMedia().then((media) => {
      var _a, _b, _c, _d;
      const data = (_a = media.data) != null ? _a : void 0;
      const mimetype = (_b = media.mimetype) != null ? _b : void 0;
      const filename = (_c = media.filename) != null ? _c : void 0;
      const filesize = (_d = media.filesize) != null ? _d : void 0;
      return { data, mimetype, filename, filesize };
    });
  }
  getAckString(ack) {
    return Object.entries(MessageAck).filter((state) => state[1] === ack)[0][0];
  }
  static fromFilePath(mediaPath) {
    return import_whatsapp_web.MessageMedia.fromFilePath(mediaPath);
  }
  // delete: (everyone?: boolean | undefined) => Promise<void>;
};

// src/transformers/Wwjs/WwjsCreator.ts
var import_nanospinner2 = require("nanospinner");
var WwjsCreator = class extends PhoneCreator {
  constructor() {
    super();
    this.BotBD = new BotMongo();
    this.reconnect = async ({ id, phone }) => {
      const savedPath = ``;
      this.clientId = id;
      const strategy = new import_whatsapp_web2.LocalAuth({
        clientId: `${id}`
        // , dataPath: savedPath 
      });
      const client = new import_whatsapp_web2.Client({ authStrategy: strategy });
      const clientTransformed = new ClientWwjs(client, savedPath);
      const qr$ = (0, import_rxjs2.fromEvent)(clientTransformed, "qr");
      const subsqr = qr$.subscribe((qr) => {
        console.log("you shouldnt have done that!");
        clientTransformed.emit("loadError" /* loadError */, "El qr se cargo despues de haber sido salvada la sesion");
        clientTransformed.disconnect().catch((err) => console.log(err));
      });
      this.init$ = (0, import_rxjs2.fromEvent)(clientTransformed, "init" /* init */);
      this.ready$ = (0, import_rxjs2.fromEvent)(clientTransformed, "ready" /* ready */);
      this.reloaded$ = (0, import_rxjs2.fromEvent)(clientTransformed, "reloaded" /* reloaded */);
      this.saveError$ = (0, import_rxjs2.fromEvent)(clientTransformed, "loadError" /* loadError */);
      this.init$.subscribe((client2) => this.initReload(client2));
      this.ready$.subscribe((client2) => this.reloading(client2));
      clientTransformed.initialize();
      const return$ = (0, import_rxjs2.race)(this.reloaded$, this.saveError$);
      return (0, import_rxjs2.firstValueFrom)(return$);
    };
    this.create = (timeoutInSeconds = 90) => {
      const savedPath = ``;
      this.clientId = (0, import_uuid3.v4)();
      const strategy = new import_whatsapp_web2.LocalAuth({
        clientId: this.clientId
        // , dataPath: process.env.UNSAVEDPHONES 
      });
      const client = new import_whatsapp_web2.Client({ authStrategy: strategy });
      const clientTransformed = new ClientWwjs(client, savedPath);
      const qr$ = (0, import_rxjs2.fromEvent)(clientTransformed, "qr" /* qr */);
      this.init$ = (0, import_rxjs2.fromEvent)(clientTransformed, "init" /* init */);
      this.ready$ = (0, import_rxjs2.fromEvent)(clientTransformed, "ready" /* ready */);
      this.saved$ = (0, import_rxjs2.fromEvent)(clientTransformed, "saved" /* saved */);
      this.saveError$ = (0, import_rxjs2.fromEvent)(clientTransformed, "loadError" /* loadError */);
      const savedAndClosed$ = this.saved$.pipe((0, import_rxjs2.concatMap)((client2) => {
        var _a;
        return (0, import_rxjs2.of)(client2 ? (_a = this.spiner) == null ? void 0 : _a.success({ text: "telefono agregado" }) : "");
      }), (0, import_rxjs2.concatMap)(() => (0, import_rxjs2.of)("")));
      const return$ = (0, import_rxjs2.race)(savedAndClosed$, this.saveError$);
      const subsqr = qr$.subscribe((qr) => this.qr(qr));
      this.ready$.subscribe((client2) => this.ready(client2));
      this.init$.subscribe((client2) => this.init(client2));
      this.saved$.subscribe((client2) => this.saved(client2));
      clientTransformed.initialize();
      return (0, import_rxjs2.firstValueFrom)(return$.pipe((0, import_rxjs2.first)()).pipe((0, import_rxjs2.timeout)(timeoutInSeconds * 1e3), (0, import_rxjs2.catchError)((err) => {
        clientTransformed.disconnect().catch();
        return (0, import_rxjs2.of)("");
      })));
    };
    this.qr = (qr) => {
      var _a;
      const qrcode = require("qrcode-terminal");
      (_a = this.spiner) == null ? void 0 : _a.success({ text: "qr Recibido" });
      qrcode.generate(qr, { small: true });
    };
    this.init = (client) => {
      this.spiner = (0, import_nanospinner2.createSpinner)("esperando Qr...").start();
    };
    this.initReload = (client) => {
      this.spiner = (0, import_nanospinner2.createSpinner)("recargando...").start();
    };
    this.ready = (client, create) => {
      (0, import_nanospinner2.createSpinner)(`telefono conectado: ${client.getPhone()}`).success();
      this.spiner = (0, import_nanospinner2.createSpinner)(`Salvando...`).start();
      this.save(client);
      client.clientSaved();
    };
    this.saved = (client) => {
      var _a;
      (_a = this.spiner) == null ? void 0 : _a.success({ text: "Salvado" });
      const phone = client.getPhone();
      this.BotBD.upsert({ id: this.clientId, phone, botType: "wwjs" });
      const phoneAvailableTouple = { bot: { id: this.clientId, phone, botType: "wwjs" }, client };
      PhonesInfo.PhonesAvailables.set(phone, phoneAvailableTouple);
    };
    this.cancelQR = () => {
    };
  }
  save(client) {
    const pathToSave = process.env.PATHTOPHONES + `wwjs/session-${client.getPhone()}`;
    try {
    } catch (err) {
      client == null ? void 0 : client.clientSavingError(typeof err === "string" ? err : err.message);
    }
  }
  reloading(client, create) {
    var _a;
    const phone = client.getPhone();
    (_a = this.spiner) == null ? void 0 : _a.success({ text: `telefono reCargado: ${phone}` });
    const phoneAvailableTouple = { bot: { id: this.clientId, phone, botType: "wwjs" }, client };
    PhonesInfo.PhonesAvailables.set(phone, phoneAvailableTouple);
    client.clientReloaded();
  }
};

// src/cli/Commands/Phones/classes/TurnOnPhone.ts
var TurnOnPhone = class {
  constructor(back) {
    this.manageOptions = async (options) => {
      const action = options == null ? void 0 : options.action;
      switch (action.toLocaleLowerCase()) {
        case "wwjs":
          const savedPhones = await PhonesInfo.getBots(options.action);
          const selectionPhones = Array.prototype.concat(savedPhones.map((bot) => bot.phone), ["atras"]);
          const phoneKeySelected = (await CLIUtils.createAutoComplete({ name: "available", message: "elige un telefono disponible", autocomplete: selectionPhones })).answer.toString();
          if (phoneKeySelected === "atras")
            return CLIProgram.setNextCommand(this.back);
          const phoneClientSelected = savedPhones.filter((bot) => bot.phone === phoneKeySelected)[0];
          const wwjsCreator = new WwjsCreator();
          await wwjsCreator.reconnect(phoneClientSelected);
          CLIProgram.setNextCommand(this.back, options);
          break;
        case "atras":
          CLIProgram.setNextCommand(this.back);
          break;
      }
    };
    this.ListOptions = () => {
      const options = Array.prototype.concat(PhonesInfo.ListPhonesTypes(), ["atras"]);
      return {
        type: "list",
        name: "action",
        message: "Selecciona un tipo de telefono",
        choices: options
      };
    };
    this.back = back;
  }
};

// src/cli/Commands/Phones/classes/AddPhone.ts
var AddPhone = class {
  constructor(back) {
    this.manageOptions = async (options) => {
      switch (options.action) {
        case "wwjs" /* wwjs */:
          const wwjsCreator = new WwjsCreator();
          await wwjsCreator.create().catch((err) => console.log(err));
          return CLIProgram.setNextCommand(this.back);
          break;
        case "atras":
          return CLIProgram.setNextCommand(this.back);
          break;
      }
    };
    this.ListOptions = (options) => ({
      type: "list",
      name: "action",
      message: "Selecciona un tipo de bot",
      choices: Array.prototype.concat(PhonesInfo.ListPhonesTypes(), ["atras"])
    });
    this.back = back;
  }
};

// src/cli/Commands/Phones/classes/CLIPhones.ts
var CLIPhones = class {
  constructor(command) {
    this.manageOptions = (options) => {
      const action = options == null ? void 0 : options.action;
      switch (action) {
        case "Listar telefonos":
          const list = new ListPhones(this);
          CLIProgram.setNextCommand(list);
          break;
        case "Agregar telefono":
          const addPhone = new AddPhone(this);
          CLIProgram.setNextCommand(addPhone);
          break;
        case "Encender telefono":
          const turnOnPhone = new TurnOnPhone(this);
          CLIProgram.setNextCommand(turnOnPhone);
          break;
        case "Encender todos":
          break;
        case "Eliminar telefono":
          break;
        case "Eliminar todos":
          break;
        case "Atras":
          CLIProgram.setNextCommand(this.back);
          break;
      }
    };
    this.ListOptions = () => {
      const optionsList = {
        type: "list",
        name: "action",
        message: "Selecciona una opcion",
        choices: [
          "Listar telefonos",
          "Agregar telefono",
          "Encender telefono",
          "Encender todos",
          "Eliminar telefono",
          "Eliminar todos",
          "Atras"
        ]
      };
      return optionsList;
    };
    this.back = command;
  }
};

// src/database/Schemas/Affiliate/Affiliate.schema.ts
var import_mongoose2 = __toESM(require("mongoose"));
var affiliateSchema = new import_mongoose2.default.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  marital: {
    type: Boolean,
    default: false
  },
  kids: {
    type: Boolean,
    default: false
  },
  birthDate: Date,
  suburb: {
    type: import_mongoose2.default.Schema.Types.ObjectId,
    ref: "Suburb"
  },
  sponsor: {
    type: import_mongoose2.default.Schema.Types.ObjectId,
    ref: "Sponsor"
  },
  relation: {
    type: String,
    required: true,
    default: "AFILIADO",
    enum: ["AFILIADO", "EXTERNO", "SINDICALIZADO"]
  },
  active: {
    type: Boolean,
    default: true
  }
}, { collection: "Affiliates" });
var AffiliateModel = import_mongoose2.default.model("Affiliate", affiliateSchema);
var Affiliate_schema_default = AffiliateModel;

// src/database/Schemas/Sponsor/Sponsor.schema.ts
var import_mongoose3 = __toESM(require("mongoose"));
var sponsorSchema = new import_mongoose3.default.Schema(
  {
    name: {
      type: String,
      unique: true
    }
  },
  {
    versionKey: false,
    collection: "sponsors",
    timestamps: { createdAt: "created_at", updatedAt: false },
    autoCreate: false
  }
);
var SponsorModel = import_mongoose3.default.model("Sponsor", sponsorSchema);
var Sponsor_schema_default = SponsorModel;

// src/database/classes/Affiliates/abstract/Affiliates.ts
var AbstractAffiliateData = class {
  constructor() {
  }
};

// src/database/classes/Affiliates/classes/AfiliateMongo.ts
var import_mongoose5 = __toESM(require("mongoose"));

// src/database/Schemas/Suburb/Suburb.schema.ts
var import_mongoose4 = __toESM(require("mongoose"));
var suburbSchema = new import_mongoose4.default.Schema(
  {
    cp: String,
    colonia: String,
    estado: String,
    municipio: String,
    tipo: String,
    asentamiento: String
  },
  {
    versionKey: false,
    collection: "Suburbs",
    timestamps: { createdAt: false, updatedAt: false },
    autoCreate: false
  }
);
var SuburbModel = import_mongoose4.default.model("Suburb", suburbSchema);
var Suburb_schema_default = SuburbModel;

// src/database/classes/Sponsors/abstract/Sponsor.ts
var AbstractSponsorData = class {
  constructor() {
  }
};

// src/database/classes/Sponsors/classes/SponsorMongo.ts
var SponsorMongo = class extends AbstractSponsorData {
  getAffByID(id) {
    throw new Error("Method not implemented.");
  }
  async listAllByName() {
    return (await Sponsor_schema_default.find({}, { name: 1, _id: 1 })).map(({ _id, name }) => ({ id: _id.toHexString(), name })).map((sponsor) => ({ name: sponsor.name, id: sponsor.id }));
  }
  async create(name) {
    return !!await Sponsor_schema_default.create({ name });
  }
  async findFirst(name) {
    return [await Sponsor_schema_default.findOne({ name }, { name: 1, _id: 1 })].map((sponsor) => ({ id: sponsor == null ? void 0 : sponsor._id.toHexString(), name: sponsor == null ? void 0 : sponsor.name }))[0];
  }
  async update(old, newName) {
    return !!(await Sponsor_schema_default.updateOne({ _id: old.id }, { name: newName })).upsertedCount;
  }
  async delete(old) {
    return !!(await Sponsor_schema_default.deleteOne({ _id: old.id })).deletedCount;
  }
};

// src/database/classes/Affiliates/classes/AfiliateMongo.ts
var AffiliateMongo = class extends AbstractAffiliateData {
  async getAffByID(id) {
    let sponsor = Sponsor_schema_default;
    let suburb = Suburb_schema_default;
    const Aff = await Affiliate_schema_default.findOne({ _id: id }).populate({ path: "sponsor", model: "Sponsor" }).populate({ path: "suburb", model: "Suburb" }).catch((err) => console.log(err));
    return Aff ? {
      name: Aff.name,
      phone: Aff.phone,
      marital: Aff.marital,
      kids: Aff.kids,
      birthDate: Aff.birthDate,
      relation: Aff.relation,
      active: Aff.active,
      sponsor: Aff.sponsor.name,
      suburb: Aff.suburb.colonia,
      id: Aff._id.toHexString()
    } : void 0;
  }
  async listAllByPhoneNameId() {
    return (await Affiliate_schema_default.find({}, { name: 1, phone: 1, _id: 1 })).map(({ _id, name, phone }) => ({ id: _id.toHexString(), name, phone }));
  }
  async listAllByName() {
    return (await Affiliate_schema_default.find({}, { name: 1, _id: 0 })).map((x) => x.name);
  }
  async find({
    name,
    phone,
    marital,
    kids,
    birthDate,
    suburb,
    sponsor,
    relation,
    active
  }) {
    const sponsorFrom = await new SponsorMongo().findFirst(name);
    const suburbFrom = await new SponsorMongo().findFirst(name);
    return (await Affiliate_schema_default.find({
      name,
      phone,
      marital,
      kids,
      birthDate,
      relation,
      active,
      suburb: import_mongoose5.default.Types.ObjectId.createFromHexString(suburbFrom.id),
      sponsor: import_mongoose5.default.Types.ObjectId.createFromHexString(sponsorFrom.id)
    }, {
      _id: 1,
      name: 1,
      phone: 1,
      marital: 1,
      kids: 1,
      birthDate: 1,
      relation: 1,
      active: 1,
      suburb: 1,
      sponsor: 1
    }).populate({ path: "sponsor", model: "Sponsor" }).populate({ path: "suburb", model: "Suburb" })).map((Aff) => ({
      name: Aff.name,
      phone: Aff.phone,
      marital: Aff.marital,
      kids: Aff.kids,
      birthDate: Aff.birthDate,
      relation: Aff.relation,
      active: Aff.active,
      sponsor: Aff.sponsor.name,
      suburb: Aff.suburb.colonia,
      id: Aff._id.toHexString()
    }));
  }
  createWithId(newAff) {
    throw new Error("Method not implemented.");
  }
  async create({
    name,
    phone,
    marital,
    kids,
    birthDate,
    suburb,
    sponsor,
    relation,
    active
  }) {
    const sponsorData = new SponsorMongo();
    const sponsorFrom = await sponsorData.findFirst(name);
    const suburbData = new SponsorMongo();
    const suburbFrom = await suburbData.findFirst(name);
    return !!await Affiliate_schema_default.create({
      name,
      phone,
      marital,
      kids,
      birthDate,
      relation,
      active,
      suburb: import_mongoose5.default.Types.ObjectId.createFromHexString(suburbFrom.id),
      sponsor: import_mongoose5.default.Types.ObjectId.createFromHexString(sponsorFrom.id)
    });
  }
  readAll() {
    return [];
  }
  async update({
    id,
    name,
    phone,
    marital,
    kids,
    birthDate,
    suburb,
    sponsor,
    relation,
    active
  }) {
    const sponsorFrom = await new SponsorMongo().findFirst(name);
    const suburbFrom = await new SponsorMongo().findFirst(name);
    return !!await Affiliate_schema_default.updateOne({ _id: id }, {
      name,
      phone,
      marital,
      kids,
      birthDate,
      relation,
      active,
      suburb: import_mongoose5.default.Types.ObjectId.createFromHexString(suburbFrom.id),
      sponsor: import_mongoose5.default.Types.ObjectId.createFromHexString(sponsorFrom.id)
    });
  }
  async delete(aff) {
    return !!(await Sponsor_schema_default.deleteOne({ _id: aff.id })).deletedCount;
  }
};

// src/cli/Commands/Affiliates/classes/Search.ts
var import_nanospinner3 = require("nanospinner");
var SearchAffiliate = class {
  constructor(back, selectedCommand) {
    this.selectedCommand = selectedCommand;
    this.manageOptions = async (options) => {
      const action = options == null ? void 0 : options.action;
      switch (action) {
        case "Por Nombre":
          return await this.searchByName();
          break;
        case "Por Telefono":
          return await this.searchByPhone();
          break;
        case "atras":
          return CLIProgram.setNextCommand(this.back);
          break;
      }
    };
    this.searchByName = async () => {
      const dbAffiliates = new AffiliateMongo();
      const spinner = (0, import_nanospinner3.createSpinner)("Cargando...").start();
      const listAff = await dbAffiliates.listAllByPhoneNameId();
      const displayAff = listAff.map((x) => x.name);
      spinner.stop();
      const displaySelected = (await CLIUtils.createAutoComplete({ name: "name", autocomplete: displayAff, message: "Selecciona el nombre" })).answer.toString();
      let selected = listAff.filter((x) => x.name === displaySelected)[0];
      if (displayAff.filter((x) => x.toLocaleLowerCase() === displaySelected.toLocaleLowerCase()).length) {
        console.log("existen multiples opciones para este nombre. Especifique");
        selected = await this.promptList(listAff.filter((x) => x.name === displaySelected));
      }
      return CLIProgram.setNextCommand(this.selectedCommand, { extraParams: selected });
    };
    this.searchByPhone = async () => {
      const dbAffiliates = new AffiliateMongo();
      const spinner = (0, import_nanospinner3.createSpinner)("Cargando...").start();
      const listAff = await await dbAffiliates.listAllByPhoneNameId();
      const displayAff = listAff.map((x) => x.phone);
      spinner.stop();
      const displaySelected = (await CLIUtils.createAutoComplete({ name: "phone", autocomplete: displayAff, message: "Selecciona el telefono" })).answer.toString();
      let selected = listAff.filter((x) => x.name === displaySelected)[0];
      if (displayAff.filter((x) => x.toLocaleLowerCase() === displaySelected.toLocaleLowerCase()).length) {
        console.log("existen multiples opciones para este telefono. Especifique");
        selected = await this.promptList(listAff.filter((x) => x.phone === displaySelected));
      }
      return CLIProgram.setNextCommand(this.selectedCommand, { extraParams: selected });
    };
    this.ListOptions = () => {
      const optionsList = [{
        type: "list",
        name: "action",
        message: "Como desea buscar?",
        choices: [
          "Por Nombre",
          "Por Telefono",
          "atras"
        ]
      }];
      return optionsList;
    };
    this.back = back;
    if (!!!selectedCommand)
      this.selectedCommand = this.back;
  }
  async promptList(arr) {
    const choices = arr.map((x) => `${x.id} - ${x.name} ${x.phone} `);
    const { Select } = require("enquirer");
    const prompt = new Select({
      name: "aff",
      message: "Seleccionar",
      choices
    });
    let selected = await prompt.run().then((answer) => answer.split("-")[0].trim()).catch(console.error);
    return arr.filter((x) => x.id === selected)[0];
  }
};

// src/cli/Commands/Affiliates/classes/ShowAffiliate.ts
var Table2 = require("cli-table");
var ShowAffiliate = class {
  constructor(command) {
    this.prompt = false;
    this.manageOptions = async (options) => {
      var _a;
      const dbAffiliate = new AffiliateMongo();
      const AffSelected = await dbAffiliate.getAffByID((_a = this.passInOptions) == null ? void 0 : _a.extraParams.id);
      CLIUtils.showVerticalTable(AffSelected);
      CLIProgram.setNextCommand(this.back);
    };
    this.ListOptions = () => {
      const optionsList = {};
      return optionsList;
    };
    this.back = command;
  }
};

// src/database/classes/Suburb/abstract/Suburb.ts
var AbstractSuburbData = class {
  constructor() {
  }
};

// src/database/classes/Suburb/classes/SuburbMongo.ts
var SuburbMongo = class extends AbstractSuburbData {
  async getSuburbByID(id) {
    return [await Suburb_schema_default.findOne({ _id: id }, {
      cp: 1,
      colonia: 1,
      estado: 1,
      municipio: 1,
      tipo: 1,
      asentamiento: 1,
      _id: 1
    })].map((suburb) => ({
      cp: suburb == null ? void 0 : suburb.cp,
      colonia: suburb == null ? void 0 : suburb.colonia,
      estado: suburb == null ? void 0 : suburb.estado,
      municipio: suburb == null ? void 0 : suburb.municipio,
      tipo: suburb == null ? void 0 : suburb.tipo,
      asentamiento: suburb == null ? void 0 : suburb.asentamiento,
      id: suburb == null ? void 0 : suburb._id
    }))[0];
  }
  async findFirst(colonia) {
    return [await Suburb_schema_default.findOne({ colonia }, {
      cp: 1,
      colonia: 1,
      estado: 1,
      municipio: 1,
      tipo: 1,
      asentamiento: 1,
      _id: 1
    })].map((suburb) => ({
      cp: suburb == null ? void 0 : suburb.cp,
      colonia: suburb == null ? void 0 : suburb.colonia,
      estado: suburb == null ? void 0 : suburb.estado,
      municipio: suburb == null ? void 0 : suburb.municipio,
      tipo: suburb == null ? void 0 : suburb.tipo,
      asentamiento: suburb == null ? void 0 : suburb.asentamiento,
      id: suburb == null ? void 0 : suburb._id
    }))[0];
  }
  async listAllByName() {
    return (await Suburb_schema_default.find({}, {
      cp: 1,
      colonia: 1,
      estado: 1,
      municipio: 1,
      tipo: 1,
      asentamiento: 1,
      _id: 1
    })).map((suburb) => ({
      cp: suburb == null ? void 0 : suburb.cp,
      colonia: suburb == null ? void 0 : suburb.colonia,
      estado: suburb == null ? void 0 : suburb.estado,
      municipio: suburb == null ? void 0 : suburb.municipio,
      tipo: suburb == null ? void 0 : suburb.tipo,
      asentamiento: suburb == null ? void 0 : suburb.asentamiento,
      id: suburb == null ? void 0 : suburb._id
    }));
  }
  async create({
    cp,
    colonia,
    estado,
    municipio,
    tipo,
    asentamiento
  }) {
    return !!await Suburb_schema_default.create({
      cp,
      colonia,
      estado,
      municipio,
      tipo,
      asentamiento
    });
  }
  async update({
    id,
    cp,
    colonia,
    estado,
    municipio,
    tipo,
    asentamiento
  }) {
    return !!await Suburb_schema_default.updateOne({ _id: id }, {
      cp,
      colonia,
      estado,
      municipio,
      tipo,
      asentamiento
    });
  }
  async delete(old) {
    return !!(await Suburb_schema_default.deleteOne({ _id: old.id })).deletedCount;
  }
};

// src/cli/utils/CLIFormBuilder.ts
var CLIFormBuilder = class {
  constructor(choices) {
    this.choices = choices;
  }
  async prompt() {
    const res = [];
    for (let i = 0; i < this.choices.length; i++) {
      const choice = this.choices[i];
      if ("yesnoQuestion" in choice) {
        res.push(await CLIUtils.YesNoDialog(choice));
      } else if ("autocomplete" in choice) {
        res.push(await CLIUtils.createAutoComplete(choice));
      } else if ("date" in choice) {
        res.push(await CLIUtils.createDateTimePicker(choice));
      } else {
        res.push(await CLIUtils.createInput(choice));
      }
    }
    return res;
  }
};

// src/cli/Commands/Affiliates/classes/CreateAffiliate.ts
var import_nanospinner4 = require("nanospinner");
var Table3 = require("cli-table");
var CreateAffiliate = class {
  constructor(command) {
    this.prompt = false;
    this.manageOptions = async (options) => {
      const dbAffiliate = new AffiliateMongo();
      const dbSponsors = new SponsorMongo();
      const dbSuburbs = new SuburbMongo();
      const sponsors = await dbSponsors.listAllByName();
      const suburbs = await dbSuburbs.listAllByName();
      const choices = /* @__PURE__ */ new Map();
      choices.set("name", { name: "name", message: "Escribe el nombre del Afiliado", initial: "" });
      choices.set("phone", { name: "phone", message: "Escribe el telefono del Afiliado", initial: "" });
      choices.set("marital", { name: "marital", message: "Esta casado/a?", initial: "", yesnoQuestion: true });
      choices.set("kids", { name: "kids", message: "tiene hijos?", initial: "", yesnoQuestion: true });
      choices.set("birthDate", { name: "birthDate", message: "Escribe la fecha de nacimiento", initial: "", date: true });
      choices.set("suburb", { name: "suburb", message: "En que colonia vive?", initial: "", autocomplete: suburbs, fieldToShow: "colonia" });
      choices.set("sponsor", { name: "sponsor", message: "Quien es el responsable?", initial: "", autocomplete: sponsors, fieldToShow: "name" });
      choices.set("relation", { name: "relation", message: "Que relacion se tiene?", initial: "", autocomplete: ["AFILIADO", "EXTERNO", "SINDICALIZADO"] });
      const affForm = new CLIFormBuilder(Array.from(choices.values()));
      const newAffiliate = (await affForm.prompt()).map(({ answer, field }) => {
        const row = new Object();
        row[field] = answer;
        return row;
      }).reduce((result, element, index) => {
        result = { ...result, ...element };
        return result;
      }, {});
      CLIUtils.showVerticalTable(newAffiliate);
      await CLIUtils.YesNoDialog({ name: "create", message: "Se creara un Affiliado. Deseas guardarlo?" }).then(async (answer) => {
        if (!!answer.answer) {
          await dbAffiliate.create(newAffiliate).catch((err) => console.log(err));
          (0, import_nanospinner4.createSpinner)("Affiliado Guardado").success();
        }
      });
      CLIProgram.setNextCommand(this.back);
    };
    this.ListOptions = () => {
      const optionsList = {};
      return optionsList;
    };
    this.back = command;
  }
  createAutocompleteEnquirer(arr) {
    return;
  }
};

// src/cli/Commands/Affiliates/classes/AffiliatesMenu.ts
var AffiliatesMenu = class {
  constructor(command) {
    this.manageOptions = (options) => {
      const action = options == null ? void 0 : options.action;
      switch (action) {
        case "Listar":
          break;
        case "Buscar":
          const showAff = new ShowAffiliate(this);
          const search = new SearchAffiliate(this, showAff);
          return CLIProgram.setNextCommand(search);
          break;
        case "Crear":
          const createAff = new CreateAffiliate(this);
          return CLIProgram.setNextCommand(createAff);
          break;
        case "Modificar":
          break;
        case "Eliminar":
          break;
        case "Eliminar todos":
          break;
        case "atras":
          return CLIProgram.setNextCommand(this.back);
          break;
      }
      return CLIProgram.setNextCommand(this.back);
    };
    this.ListOptions = () => {
      const optionsList = {
        type: "list",
        name: "action",
        message: "Selecciona una opcion",
        choices: [
          "Listar",
          "Buscar",
          "Crear",
          "Modificar",
          "Eliminar",
          "Eliminar todos",
          "atras"
        ]
      };
      return optionsList;
    };
    this.back = command;
  }
};

// src/FileDialogs/abstract/Dialog.ts
var AbstractDialog = class {
};

// src/FileDialogs/classes/DialogNFD.ts
var DialogNFD = class extends AbstractDialog {
  async showSingleOpenDialog() {
    const dialog = require("node-file-dialog");
    const config = { type: "open-file" /* open_file */ };
    return dialog(config).then((file) => file.length > 0 ? file[0] : "").catch((err) => "");
  }
  async showMultipleOpenDialog() {
    const dialog = require("node-file-dialog");
    const config = { type: "open-files" /* open_files */ };
    return dialog(config).then((files) => files).catch((err) => []);
  }
  async showSaveDialog() {
    const dialog = require("node-file-dialog");
    const config = { type: "save-file" /* save_file */ };
    return dialog(config).then((files) => files).catch((err) => "");
  }
  async showDirectoryDialog() {
    const dialog = require("node-file-dialog");
    const config = { type: "directory" /* directory */ };
    return dialog(config).then((dir) => dir.length > 0 ? dir[0] : "").catch((err) => "");
  }
};

// src/CampaignCreator/classes/CampaignManager.ts
var fs4 = __toESM(require("fs"));

// src/CampaignCreator/classes/CampaignCreator.ts
var import_exceljs = require("exceljs");

// src/CampaignCreator/classes/utils/utils.ts
var replaceAll = (change, pattern, replacement) => {
  let different = change;
  do {
    different = change;
    for (let patterPart of Array.from(pattern))
      change = change.replace(pattern, replacement);
  } while (change !== different);
  return change;
};
var ImageSize = (base64) => {
  return Buffer.from(base64, "base64").byteLength;
};
var translateSizeIntoString = (size) => {
  if (size < 1e3)
    return `${size} Bytes`;
  else if (size < 1e3 * 1e3)
    return `${size / 1e3} KB`;
  else if (size < 1e3 * 1e3 * 1e3)
    return `${size / 1e3 * 1e3} MB`;
  else
    return ` ${size / 1e3 * 1e3 * 1e3} GB`;
};

// src/CampaignCreator/classes/utils/Table.ts
var import_uuid4 = require("uuid");
var Cell = class {
  constructor(value) {
    this.value = value;
    this.id = (0, import_uuid4.v4)();
  }
};
var Column = class _Column {
  constructor(table) {
    this.table = table;
    this.id = (0, import_uuid4.v4)();
    this.name = void 0;
  }
  static newColumn(name, parent) {
    const column = new _Column(parent);
    column.name = name;
    return column;
  }
};
var Row = class _Row {
  constructor(table) {
    this.table = table;
    this.id = (0, import_uuid4.v4)();
    this.Cells = /* @__PURE__ */ new Map();
    this.index = -1;
  }
  setFullRow(row) {
    for (let value of row)
      this.set(value);
  }
  setNewCell(key, newCell) {
    this.Cells.set(key, newCell);
  }
  set(value) {
    const newCell = new Cell(value);
    this.Cells.set({ id: newCell.id, name: this.table.getColumnNameByOrder(this.Cells.size), order: this.Cells.size }, newCell);
  }
  setRowToTheRight(value, position) {
    if (this.Cells.size <= position) {
      this.set(value);
      return true;
    }
    return false;
  }
  setRowsOnPosition(value, position) {
    return this.setRowToTheRight(value, position) || this.setRowInBetween(value, position);
  }
  setRowInBetween(value, position) {
    if (this.Cells.size > position) {
      const kvFirstPart = Array.from(this.Cells.entries()).slice(0, position);
      const kvSecondPart = Array.from(this.Cells.entries()).slice(position, this.Cells.size).map(([key, value2]) => {
        key.order++;
        return [key, value2];
      });
      this.Cells.clear();
      for (let [key, value2] of kvFirstPart) {
        this.Cells.set(key, value2);
      }
      this.set(value);
      for (let [key, value2] of kvSecondPart) {
        this.Cells.set(key, value2);
      }
      return true;
    }
    return false;
  }
  replaceByName(column, value) {
    const newCell = new Cell(value);
    const cellTobeReplaced = Array.from(this.Cells.keys()).find((cell) => {
      return cell.name === column;
    });
    if (!!cellTobeReplaced) {
      this.setNewCell({ id: newCell.id, name: column, order: cellTobeReplaced.order }, newCell);
      this.Cells.delete(cellTobeReplaced);
    }
  }
  get(column) {
    var _a;
    return (_a = this.getCellByNumber(column)) != null ? _a : this.getCellByString(column);
  }
  getCellByNumber(column) {
    if (typeof column === "number") {
      const index = column;
      return Array.from(this.Cells.entries())[index];
    }
  }
  getCellByString(columnName) {
    if (typeof columnName === "string") {
      columnName = columnName;
      const selectedCell = Array.from(this.Cells.keys()).find((column) => {
        return column.name == columnName;
      });
      return this.Cells.get(selectedCell);
    }
  }
  static newRow(row, parent) {
    const newRow = new _Row(parent);
    newRow.setFullRow(row);
    return newRow;
  }
  toLog() {
    let toLog = "";
    this.Cells.forEach((cell) => {
      toLog += `${cell.value}  `;
    });
    console.log(toLog);
  }
};
var Table4 = class _Table {
  constructor() {
    // columns:Column[]
    this.firstRowColumns = false;
    this.columns = /* @__PURE__ */ new Map();
    this.rows = /* @__PURE__ */ new Map();
  }
  get HeadersBeenSet() {
    return this.columns.size > 1;
  }
  addColumn(name, defaultFill = void 0) {
    const newColumn = Column.newColumn(name, this);
    this.columns.set({
      id: newColumn.id,
      name,
      order: this.columns.size
    }, newColumn);
    this.verticalPopulateRows(defaultFill, this.columns.size);
  }
  addColumnToRigth(name, defaultFill = void 0) {
    this.addColumnWhenLoaded(name, this.columns.size, defaultFill);
  }
  addColumnInBetween(name, position, defaultFill = void 0) {
    const newColumn = Column.newColumn(name, this);
    this.setColummnsOnPosition(newColumn, position);
    this.addRowsInBetween(position, defaultFill);
  }
  getColumnNameByOrder(order) {
    let orderSelected = Array.from(this.columns.keys()).find((indexValue) => indexValue.order === order);
    return !!orderSelected ? orderSelected.name : void 0;
  }
  getColumnOrderByName(name) {
    let orderSelected = Array.from(this.columns.keys()).find((indexValue) => indexValue.name === name);
    return !!orderSelected ? orderSelected.order : -1;
  }
  setValueOn(row, col, value) {
    Array.from(this.rows).filter((rowValue) => row === rowValue[0].order).map((rowValue) => Array.from(rowValue[1].Cells))[0].filter((cellValue) => cellValue[0].order === col).map((cellValue) => cellValue[1])[0].value = value;
  }
  fillRow(row) {
    const diff = this.columns.size - row.length;
    if (diff > 0) {
      row = Array.prototype.concat(row, new Array(diff).fill(""));
    }
    this.addRow(row);
  }
  addRow(row) {
    if (this.columns.size < 1)
      return false;
    return this.addHeaderRow(row) || this.addExactRow(row);
  }
  addHeaderRow(row, override = false) {
    if (override || !this.HeadersBeenSet) {
      this.addColumnFirstRow(row);
      return true;
    }
    return false;
  }
  addColumnFirstRow(row) {
    for (let column of row)
      this.addColumn(column.toString());
  }
  addExactRow(row) {
    if (row.length == this.columns.size) {
      const newRow = Row.newRow(row, this);
      newRow.index = this.rows.size;
      this.rows.set({ id: newRow.id, name: newRow.id, order: this.rows.size }, newRow);
      return true;
    }
    return false;
  }
  addRowsInBetween(position, defaultFill = void 0) {
    this.verticalPopulateRows(defaultFill, position);
  }
  verticalPopulateRows(defaultFill, order) {
    if (this.rows.size < 1)
      return true;
    this.rows.forEach((row) => {
      row.setRowsOnPosition(defaultFill, order);
    });
  }
  addColumnWhenLoaded(name, pos, defaultFill) {
    const newColumn = Column.newColumn(name, this);
    if (this.columns.size < pos)
      this.addColumn(name);
  }
  setColumnToLeft(column, position) {
    if (this.columns.size <= position) {
      this.columns.set({
        id: column.id,
        name: column.name,
        order: position
      }, column);
      return true;
    }
    return false;
  }
  setColummnsOnPosition(column, position) {
    return this.setColumnToLeft(column, position) || this.setColumnInBetween(column, position);
  }
  setColumnInBetween(column, position) {
    if (this.columns.size > position) {
      const kvFirstPart = Array.from(this.columns.entries()).slice(0, position);
      const kvSecondPart = Array.from(this.columns.entries()).slice(position, this.columns.size).map(([key, value]) => {
        key.order++;
        return [key, value];
      });
      this.columns.clear();
      for (let [key, value] of kvFirstPart) {
        this.columns.set(key, value);
      }
      this.columns.set({
        id: column.id,
        name: column.name,
        order: position
      }, column);
      for (let [key, value] of kvSecondPart) {
        this.columns.set(key, value);
      }
      return true;
    }
    return false;
  }
  static fromScratch(columns) {
    const newTable = new _Table();
    columns ? newTable.addColumnFirstRow(columns) : void 0;
    return newTable;
  }
  static fromMatrixArray(table, firstRowColumns) {
    const newTable = new _Table();
    newTable.firstRowColumns = firstRowColumns;
  }
  toLog() {
    let tologHeaders = "";
    Array.from(this.columns.values()).forEach((columnName) => {
      tologHeaders += `${columnName.name}  `;
    });
    console.log(tologHeaders);
    Array.from(this.rows.values()).forEach((rowvalue) => {
      rowvalue.toLog();
    });
  }
};

// src/CampaignCreator/classes/CampaignCreator.ts
var CampaignCreator = class {
  constructor(campaignConfiguration = {
    SHEETCONTACTS: "CONTACTS",
    SHEETCONF: "CONF",
    SHEETIMAGES: "IMAGES",
    FROMFIELD: "FROM",
    TOFIELD: "TO",
    MESSAGEFIELD: "MESSAGE",
    IMAGEMESSAGEFIELD: "IMAGE",
    IMAGEFIELD: "IMAGE",
    IMAGENAME: "NAME",
    LATENCYFIELD: "LATENCY",
    UNITFIELD: "UNIT",
    MODELATENCYFIELD: "MODE",
    STARTDATEFIELD: "STARTDATE",
    STARTTIMEFIELD: "STARTTIME",
    ENDDATEFIELD: "ENDDATE",
    ENDTIMEFIELD: "ENDTIME",
    CAMPAIGNNAME: "CAMPAIGNNAME"
  }) {
    this.campaignConfiguration = campaignConfiguration;
  }
  async createCampaing(buffer) {
    const workbook = new import_exceljs.Workbook();
    await workbook.xlsx.load(buffer);
    const tblContacts = await this.getTableJustText(workbook.getWorksheet(this.campaignConfiguration.SHEETCONTACTS));
    const tblImages = await this.getTableWithImages(workbook.getWorksheet(this.campaignConfiguration.SHEETIMAGES));
    const tblConf = await this.getTableJustText(workbook.getWorksheet(this.campaignConfiguration.SHEETCONF));
    const contacts = !!tblContacts ? await this.createContacts(tblContacts) : void 0;
    const images = !!tblImages ? await this.createImages(tblImages) : void 0;
    const conf = !!tblConf ? (await this.createConfiguration(tblConf))[0] : void 0;
    if ((contacts == null ? void 0 : contacts.length) > 100)
      conf.executionRamp = 40;
    return {
      configuration: conf,
      contacts,
      createDate: /* @__PURE__ */ new Date(),
      images,
      state: "created" /* CREATED */
    };
  }
  validateContacts(contacts) {
    return !!!contacts.find(({ from: from5, to, message }) => !(!!from5 && !!to && !!message));
  }
  validateImages(images) {
    images.map(({ name, image, ext }) => !(!!name && image && ext));
  }
  async createConfiguration(confTable) {
    return Array.from(confTable.rows.values()).map((row) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
      let [latencyInstruction, unit, mode, startDate, startTime, endDate, endTime, campaignName, executionRamp] = [
        (_b = (_a = row.getCellByString(this.campaignConfiguration.LATENCYFIELD)) == null ? void 0 : _a.value) != null ? _b : "",
        (_d = (_c = row.getCellByString(this.campaignConfiguration.UNITFIELD)) == null ? void 0 : _c.value) != null ? _d : "",
        (_f = (_e = row.getCellByString(this.campaignConfiguration.MODELATENCYFIELD)) == null ? void 0 : _e.value) != null ? _f : "",
        (_h = (_g = row.getCellByString(this.campaignConfiguration.STARTDATEFIELD)) == null ? void 0 : _g.value) != null ? _h : "",
        (_j = (_i = row.getCellByString(this.campaignConfiguration.STARTTIMEFIELD)) == null ? void 0 : _i.value) != null ? _j : "",
        (_l = (_k = row.getCellByString(this.campaignConfiguration.ENDDATEFIELD)) == null ? void 0 : _k.value) != null ? _l : "",
        (_n = (_m = row.getCellByString(this.campaignConfiguration.ENDTIMEFIELD)) == null ? void 0 : _m.value) != null ? _n : "",
        (_p = (_o = row.getCellByString(this.campaignConfiguration.CAMPAIGNNAME)) == null ? void 0 : _o.value) != null ? _p : "",
        (_r = (_q = row.getCellByString(this.campaignConfiguration.RAMPFIELD)) == null ? void 0 : _q.value) != null ? _r : ""
      ];
      const configuration = {
        behaviour: {
          latency: this.getLatencyPeriods(latencyInstruction),
          mode: this.getSendMode(mode),
          unit: this.getTimeUnit(unit)
        },
        startDate: this.getDateFromString(startDate, startTime),
        endDate: this.getDateFromString(endDate, endTime),
        campaignName,
        executionRamp: (_s = parseInt(executionRamp)) != null ? _s : 5
      };
      return configuration;
    });
  }
  async createContacts(contactTable) {
    return Array.from(contactTable.rows.values()).map((row) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      let [from5, to, image, message] = [
        (_b = (_a = row.getCellByString(this.campaignConfiguration.FROMFIELD)) == null ? void 0 : _a.value) != null ? _b : "",
        (_d = (_c = row.getCellByString(this.campaignConfiguration.TOFIELD)) == null ? void 0 : _c.value) != null ? _d : "",
        (_f = (_e = row.getCellByString(this.campaignConfiguration.IMAGEMESSAGEFIELD)) == null ? void 0 : _e.value) != null ? _f : "",
        (_h = (_g = row.getCellByString(this.campaignConfiguration.MESSAGEFIELD)) == null ? void 0 : _g.value) != null ? _h : ""
      ];
      const contact = {
        from: from5,
        to,
        imagefield: image,
        message,
        status: "created" /* CREATED */
      };
      contact.messageMap = Array.from(row.Cells.entries()).filter(([, cell]) => ![from5, to, image, message].includes(cell.value)).map(([index, cell]) => {
        return {
          key: index.name,
          value: cell.value
        };
      });
      return contact;
    });
  }
  async createImages(imagesTbl) {
    return Array.from(imagesTbl.rows.values()).map((row) => {
      var _a, _b, _c, _d;
      let [
        name,
        image,
        ext
      ] = [
        (_b = (_a = row.getCellByString(this.campaignConfiguration.IMAGENAME)) == null ? void 0 : _a.value) != null ? _b : "",
        (_d = (_c = row.getCellByString(this.campaignConfiguration.IMAGEFIELD)) == null ? void 0 : _c.value) != null ? _d : "",
        row.getCellByString("EXT").value
      ];
      return {
        ext,
        image,
        name
      };
    });
  }
  getDateFromString(date, time) {
    const [day, month, year, hour, minute, second] = replaceAll(replaceAll(date, "-", " "), "/", " ").split(/ /).concat(time.split(/:/)).map((part) => parseInt(part));
    let newDate = new Date(
      year,
      month - 1,
      day,
      hour != null ? hour : 0,
      minute != null ? minute : 0,
      second != null ? second : 0
    );
    return newDate;
  }
  getLatencyPeriods(latency) {
    return latency.replace("-", " ").replace(";", " ").split(/ /).map((period) => parseInt(period.trim()));
  }
  getTimeUnit(unit) {
    switch (unit.toLocaleLowerCase()) {
      case "seconds":
      case "second":
      case "segundos":
      case "segundo":
        return "second" /* second */;
        break;
      case "minute":
      case "minutes":
      case "minuto":
      case "minutos":
        return "minute" /* minute */;
        break;
      case "hour":
      case "hours":
      case "hora":
      case "horas":
        return "hour" /* hour */;
        break;
      case "day":
      case "days":
      case "dia":
      case "dia":
        return "day" /* day */;
        break;
      default:
        return void 0;
    }
  }
  getSendMode(mode) {
    switch (mode.toLocaleLowerCase()) {
      case "random":
      case "aleatorio":
        return "random" /* random */;
        break;
      case "consecutive":
      case "consecutivo":
        return "consecutive" /* consecutive */;
        break;
      case "nowait":
      case "sinespera":
        return "nowait" /* nowait */;
        break;
    }
  }
  async addHeaders(table, sheet) {
    var _a;
    const columns = [];
    const promise = [];
    (_a = sheet.getRows(1, 1)) == null ? void 0 : _a.map((row) => {
      row.eachCell({ includeEmpty: true }, (cell, index) => {
        promise.push(new Promise((resolve) => {
          columns.push(cell.value ? cell.value.toString() : "");
          resolve(1);
        }));
      });
    });
    await Promise.all(promise);
    if (!table.HeadersBeenSet)
      columns.push("EXT");
    table.addHeaderRow(columns);
  }
  async addTextCells(table, sheet) {
    var _a;
    if (sheet.rowCount < 2)
      return;
    (_a = sheet.getRows(2, sheet.rowCount - 1)) == null ? void 0 : _a.map((row) => {
      const cells = [];
      row.eachCell({ includeEmpty: true }, (cell, index) => {
        cells.push(cell.value ? cell.value.toString() : "");
      });
      table.fillRow(cells);
    });
  }
  async addImageCells(table, sheet) {
    const images = sheet.getImages();
    const imagesRanges = images.map(({ range, imageId }) => ({ id: imageId, col: range.tl.nativeCol, row: range.tl.nativeRow }));
    imagesRanges.forEach(({ id, col, row }) => {
      const { buffer, extension } = sheet.workbook.model.media.filter((media, index) => index === parseInt(id)).pop();
      const imgBase64 = Buffer.from(buffer).toString("base64");
      table.setValueOn(row - 1, col, imgBase64);
      table.setValueOn(row - 1, col + 1, extension);
    });
  }
  async getTableWithImages(sheet) {
    const table = Table4.fromScratch();
    await this.addHeaders(table, sheet);
    await this.addTextCells(table, sheet);
    await this.addImageCells(table, sheet);
    return table != null ? table : void 0;
  }
  async getTableJustText(Sheet) {
    const table = Table4.fromScratch();
    let rows = Sheet.getRows(1, Sheet.rowCount);
    for (let row of rows) {
      let cellValues = row.model ? row.model.cells.map((cell) => {
        var _a;
        return (_a = cell.value) == null ? void 0 : _a.toString();
      }) : void 0;
      if (cellValues.length < 1)
        continue;
      if (!table.HeadersBeenSet) {
        table.addHeaderRow(cellValues);
        continue;
      }
      if (!table.addRow(
        cellValues
      )) {
        cellValues = [];
        const insertCells = [];
        row.eachCell({ includeEmpty: true }, (cell, index) => {
          insertCells.push(
            new Promise((resolve) => {
              cellValues.push(cell.value ? cell.value.toString() : void 0);
              resolve(1);
            })
          );
        });
        await Promise.all(insertCells);
      } else
        continue;
      if (!table.addRow(cellValues))
        continue;
    }
    return table.rows.size > 0 ? table : void 0;
  }
};

// src/CampaignCreator/classes/CampaignScheduler.ts
var import_events = require("events");
var import_rxjs3 = require("rxjs");
var import_uuid5 = require("uuid");
var import_async_mutex = require("async-mutex");
var SchedulerEventsEmitter = class {
  constructor(scheduler) {
    this.scheduler = scheduler;
  }
  start() {
    this.scheduler.emit("started" /* started */);
  }
  prepare() {
    this.scheduler.emit("prepare" /* prepare */);
  }
  ready() {
    this.scheduler.emit("ready" /* ready */);
  }
  pause() {
    this.scheduler.emit("paused" /* paused */);
  }
  dispatch() {
    this.scheduler.emit("dispatch" /* dispatch */);
  }
  message(message) {
    this.scheduler.emit("message" /* message */, message);
  }
  messageEnd(message) {
    this.scheduler.emit("messageEnd" /* messageEnd */, message);
  }
  messageError(message) {
    this.scheduler.emit("messageError" /* messageError */, message);
  }
  finish() {
    this.scheduler.emit("finished" /* finished */);
  }
  overdue() {
    this.scheduler.emit("overdue" /* overdue */);
  }
};
var SchedulerParams = class {
  constructor() {
    this.messagesScheduled = [];
    this.messagesDispatched = /* @__PURE__ */ new Map();
    this.messagesEnded = [];
    this.messagesError = [];
    this.messagesEndedSempahore = new import_async_mutex.Semaphore(1);
    this.messagesScheduledSempahore = new import_async_mutex.Semaphore(1);
    this.messagesDispatchedSempahore = new import_async_mutex.Semaphore(1);
    this.messagesErrorSempahore = new import_async_mutex.Semaphore(1);
    this.stop = false;
    this.debug = false;
  }
};
var Message2 = class {
  constructor(properties) {
    this.properties = properties;
    this.id = (0, import_uuid5.v4)();
    this.subscription = null;
    this.state = "scheduled" /* scheduled */;
  }
  get endDate() {
    return this.properties.scheduler.campaign.configuration.endDate;
  }
  setState(messageState) {
    this.state = messageState;
  }
  run() {
    this.setState("onWait" /* onWait */);
    const overdue = () => {
      return Math.abs(new Date((/* @__PURE__ */ new Date()).getTime() + 6e4).getTime() - this.endDate.getTime()) / (1e3 * 60) >= 1;
    };
    this.subscription = (0, import_rxjs3.timer)(this.properties.startDate).pipe((0, import_rxjs3.tap)(() => overdue() ? this.properties.scheduler.events.overdue() : void 0)).pipe(
      (0, import_rxjs3.tap)(() => this.setState("running" /* running */)),
      (0, import_rxjs3.tap)(() => {
        this.properties.scheduler.events.message(this);
      }),
      (0, import_rxjs3.switchMap)(
        () => {
          return (0, import_rxjs3.from)(
            this.properties.callbacks.sendMessageAction(this.properties.contact)
          );
        }
      ),
      (0, import_rxjs3.catchError)((err, caught) => {
        this.setState("error" /* error */);
        return err;
      })
    ).subscribe({
      error: () => {
        this.properties.scheduler.events.messageError(this);
      },
      complete: () => {
        this.setState("finished" /* finished */);
        this.properties.scheduler.events.messageEnd(this);
      }
    });
    return this.subscription;
  }
};
var SchedulerActions = class {
  constructor(scheduler) {
    this.scheduler = scheduler;
    this.indexLatency = 0;
  }
  get params() {
    return this.scheduler.params;
  }
  get campaing() {
    return this.scheduler.campaign;
  }
  get configuration() {
    return this.scheduler.campaign.configuration;
  }
  async waitMe(awaitTime) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, awaitTime);
    });
  }
  calculateNextDate(currentDate) {
    let timeToAdd = 0;
    if (this.configuration.behaviour.mode === "random" /* random */)
      this.indexLatency = Math.trunc(Math.random() * this.configuration.behaviour.latency.length);
    const currLatency = this.configuration.behaviour.latency[this.indexLatency];
    return new Date(this.addTime(currentDate, currLatency, this.configuration.behaviour.unit));
  }
  addTime(currentDate, timeAdded, unit) {
    switch (unit) {
      case "day" /* day */:
        return currentDate.getTime() + timeAdded * 60 * 60 * 1e3 * 24;
      case "hour" /* hour */:
        return currentDate.getTime() + timeAdded * 60 * 60 * 1e3;
      case "minute" /* minute */:
        return currentDate.getTime() + timeAdded * 60 * 1e3;
      case "second" /* second */:
        return currentDate.getTime() + timeAdded * 1e3;
    }
  }
  nextDate() {
    if (!!!this.currentDate) {
      this.currentDate = this.scheduler.campaign.configuration.startDate;
    } else
      this.currentDate = this.calculateNextDate(this.currentDate);
    return this.currentDate;
  }
  prepare(schedulerCallbacks) {
    this.scheduler.params.messagesScheduled = this.scheduler.campaign.contacts.map((contact, index) => {
      return new Message2({
        contact,
        callbacks: schedulerCallbacks,
        startDate: this.nextDate(),
        scheduler: this.scheduler,
        index
      });
    });
    this.scheduler.events.prepare();
    if (this.scheduler.params.messagesScheduled.length >= 1) {
      this.scheduler.events.ready();
      return true;
    }
    return false;
  }
  async dispatch() {
    this.scheduler.events.start();
    const awaitTime = this.calcExecutionRamp();
    let message = await this.scheduler.actions.popMessageScheduled();
    while (!!message && !this.params.stop) {
      message.run();
      !!message && await this.scheduler.actions.pushIntoMessageDispatched(message);
      message = await this.scheduler.actions.popMessageScheduled();
      await this.waitMe(awaitTime);
    }
    this.scheduler.events.dispatch();
  }
  calcExecutionRamp() {
    var _a, _b;
    return 1e3 * ((_b = (_a = this.scheduler.options) == null ? void 0 : _a.executionRamp) != null ? _b : 0) / this.params.messagesScheduled.length;
  }
  stop() {
    this.params.stop = true;
  }
  async pushIntoMessageScheduled(message) {
    await this.params.messagesScheduledSempahore.runExclusive(() => {
      this.params.messagesScheduled.push(message);
    });
  }
  async pushIntoMessageDispatched(message) {
    await this.params.messagesDispatchedSempahore.runExclusive(() => {
      this.params.messagesDispatched.set(message.id, message);
    });
  }
  async pushIntoMessageEndedArray(message) {
    await this.params.messagesEndedSempahore.runExclusive(() => {
      this.params.messagesEnded.push(message);
    });
  }
  async pushIntoMessageError(message) {
    await this.params.messagesErrorSempahore.runExclusive(() => {
      this.params.messagesError.push(message);
    });
  }
  async popMessageScheduled() {
    return await this.params.messagesScheduledSempahore.runExclusive(() => {
      return this.params.messagesScheduled.pop();
    });
  }
  async deleteMessageDispatched(message) {
    return await this.params.messagesDispatchedSempahore.runExclusive(() => {
      return !!this.params.messagesDispatched.delete(message.id);
    });
  }
  async popMessageEndedArray() {
    return await this.params.messagesEndedSempahore.runExclusive(() => {
      return this.params.messagesEnded.pop();
    });
  }
  async scheduleMessage(messageProperties) {
    await this.scheduler.actions.pushIntoMessageScheduled(
      new Message2(messageProperties)
    );
    if (this.scheduler.params.messagesScheduled.length == 1) {
      this.scheduler.events.ready();
    }
  }
  async monitorFinished() {
    const finish$ = new import_rxjs3.Subject();
    const interval$ = (0, import_rxjs3.interval)(1e3);
    this.IsFinished$().pipe(
      // switchMap(() => IsFinished$),
      (0, import_rxjs3.map)(
        (finished) => {
          if (finished) {
            this.scheduler.events.finish();
            finish$.next("finish");
          }
        }
      ),
      (0, import_rxjs3.delay)(100),
      (0, import_rxjs3.repeat)(),
      (0, import_rxjs3.tap)(() => {
        this.params.debug && console.log(`checked ${/* @__PURE__ */ new Date()}`);
      })
    ).pipe((0, import_rxjs3.takeUntil)(finish$)).subscribe();
  }
  IsFinished$() {
    return new import_rxjs3.Observable((subscribe) => {
      this.params.messagesErrorSempahore.runExclusive(() => {
        this.params.messagesEndedSempahore.runExclusive(() => {
          if (this.params.messagesScheduled.length < 1 && this.params.messagesDispatched.size < 1) {
            subscribe.next(!!!this.params.messagesEnded.find((message) => message.state !== "finished" /* finished */) || !!!this.params.messagesEnded.find((message) => message.state !== "error" /* error */));
            subscribe.complete();
          }
          subscribe.next(false);
          subscribe.complete();
        });
      });
    });
  }
  verbose(debug = true) {
    this.params.debug = debug;
  }
  getResume() {
    return this.params.resume;
  }
};
var CampaignScheduler = class extends import_events.EventEmitter {
  constructor(campaign, options) {
    super();
    this.campaign = campaign;
    this.options = options;
    this.actions = new SchedulerActions(this);
    this.events = new SchedulerEventsEmitter(this);
    this.params = new SchedulerParams();
    this.initEvents();
  }
  init() {
    this.initOptions();
    this.initEvents();
  }
  initOptions() {
    const defaultOptions = {
      runOnReady: false,
      executionRamp: this.campaign.configuration.executionRamp
    };
    if (!!!this.options)
      this.options = defaultOptions;
    if (!!!this.options.executionRamp)
      this.options.executionRamp = defaultOptions.executionRamp;
  }
  initEvents() {
    this.on("message" /* message */, (message) => {
      this.params.debug && console.log("message" /* message */, message.properties.startDate, message.id);
    });
    this.on("messageEnd" /* messageEnd */, async (message) => {
      this.params.debug && console.log("messageEnd" /* messageEnd */, message.properties.startDate, message.id);
      await this.actions.pushIntoMessageEndedArray(message);
      await this.actions.deleteMessageDispatched(message);
    });
    this.on("messageError" /* messageError */, async (message) => {
      this.params.debug && console.log("messageError" /* messageError */, message.properties.startDate, message.id);
      await this.actions.pushIntoMessageError(message);
      await this.actions.deleteMessageDispatched(message);
    });
    this.on("prepare" /* prepare */, () => {
      this.params.debug && console.log("prepare" /* prepare */);
    });
    this.on("ready" /* ready */, async () => {
      var _a;
      this.params.debug && console.log("ready" /* ready */);
      ((_a = this.options) == null ? void 0 : _a.runOnReady) && await this.actions.dispatch();
    });
    this.on("started" /* started */, () => {
      this.params.debug && console.log("started" /* started */);
      this.actions.monitorFinished();
    });
    this.on("dispatch" /* dispatch */, () => {
      this.params.debug && console.log("dispatch" /* dispatch */);
    });
    this.on("finished" /* finished */, () => {
      this.params.debug && console.log("finished" /* finished */);
    });
    this.on("overdue" /* overdue */, () => {
      this.params.debug && console.log("overdue" /* overdue */);
    });
    this.resumeEvents();
  }
  resumeEvents() {
    let prepare = 0;
    let started = 0;
    let ready = 0;
    let dispatch = 0;
    let message = 0;
    let messageEnd = 0;
    let messageError = 0;
    let finished = 0;
    let overdue = 0;
    const prepare$ = (0, import_rxjs3.fromEvent)(this, "prepare" /* prepare */);
    const started$ = (0, import_rxjs3.fromEvent)(this, "started" /* started */);
    const ready$ = (0, import_rxjs3.fromEvent)(this, "ready" /* ready */);
    const dispatch$ = (0, import_rxjs3.fromEvent)(this, "dispatch" /* dispatch */);
    const message$ = (0, import_rxjs3.fromEvent)(this, "message" /* message */);
    const messageEnd$ = (0, import_rxjs3.fromEvent)(this, "messageEnd" /* messageEnd */);
    const messageError$ = (0, import_rxjs3.fromEvent)(this, "messageError" /* messageError */);
    const finished$ = (0, import_rxjs3.fromEvent)(this, "finished" /* finished */).pipe((0, import_rxjs3.scan)((counter, evt) => counter + 1, 0), (0, import_rxjs3.tap)((counter) => {
      finished = counter;
    }));
    const overdue$ = (0, import_rxjs3.fromEvent)(this, "overdue" /* overdue */);
    const resumeWatcher = (0, import_rxjs3.merge)(
      prepare$.pipe((0, import_rxjs3.scan)((counter, evt) => counter + 1, 0), (0, import_rxjs3.tap)((counter) => {
        prepare = counter;
      })),
      started$.pipe((0, import_rxjs3.scan)((counter, evt) => counter + 1, 0), (0, import_rxjs3.tap)((counter) => {
        started = counter;
      })),
      ready$.pipe((0, import_rxjs3.scan)((counter, evt) => counter + 1, 0), (0, import_rxjs3.tap)((counter) => {
        ready = counter;
      })),
      dispatch$.pipe((0, import_rxjs3.scan)((counter, evt) => counter + 1, 0), (0, import_rxjs3.tap)((counter) => {
        dispatch = counter;
      })),
      message$.pipe((0, import_rxjs3.scan)((counter, evt) => counter + 1, 0), (0, import_rxjs3.tap)((counter) => {
        message = counter;
      })),
      messageEnd$.pipe((0, import_rxjs3.scan)((counter, evt) => counter + 1, 0), (0, import_rxjs3.tap)((counter) => {
        messageEnd = counter;
      })),
      messageError$.pipe((0, import_rxjs3.scan)((counter, evt) => counter + 1, 0), (0, import_rxjs3.tap)((counter) => {
        messageError = counter;
      })),
      finished$,
      overdue$.pipe((0, import_rxjs3.scan)((counter, evt) => counter + 1, 0), (0, import_rxjs3.tap)((counter) => {
        overdue = counter;
      }))
    ).pipe((0, import_rxjs3.takeUntil)(finished$)).subscribe(
      {
        complete: () => {
          this.params.resume = {
            started,
            ready,
            dispatch,
            message,
            messageEnd,
            messageError,
            finished,
            overdue
          };
        }
      }
    );
  }
  startProcess(schedulerEventCallbacks) {
    var _a, _b, _c;
    const eventCallBacks = (_c = (_b = (_a = this.options) == null ? void 0 : _a.schedulerEventCallbacks) != null ? _b : schedulerEventCallbacks) != null ? _c : void 0;
    if (eventCallBacks)
      return this.actions.prepare(eventCallBacks);
    throw "Scheduller should have a Manager";
  }
};

// src/CampaignCreator/classes/CampaignManager.ts
var SchedulerEventsManager = class {
  constructor(params) {
    this.params = params;
    this.sendMessageAction = async (contactMessage) => {
      const messageEventsController = new MessageController(contactMessage, this.params);
      await messageEventsController.sendMessage();
    };
    this.sendMessageError = async (err, contactMessage) => {
      const { from: from5, imagefield, message, messageMap, status, to } = contactMessage;
      console.log(`${from5} ${to} ${message} --- Error:${typeof err === "string" ? err : err.message}`);
    };
    this.sendMessageEnd = async (contactMessage) => {
      const { from: from5, imagefield, message, messageMap, status, to } = contactMessage;
      console.log(`${from5} ${to} ${message} --- Mensaje Enviado`);
    };
  }
};
var MessageController = class {
  constructor(contact, params) {
    this.contact = contact;
    this.params = params;
    this.message = "";
    this.message = contact.message;
    this.prepareMessage();
  }
  prepareMessage() {
    this.contact.messageMap.reduce(({ key, value }) => {
      this.message = this.message.replace(`[${key}]`, value);
      return { key, value };
    });
  }
  getMessage() {
    return this.message;
  }
  getImage() {
    const imageCampaign = this.params.campaign.images.filter((image) => image.name == this.contact.imagefield);
    return {
      data: !!imageCampaign ? imageCampaign[0].image : "",
      mimetype: this.getImageExt()
    };
  }
  getImageExt() {
    const imageCampaign = this.params.campaign.images.filter((image) => image.name == this.contact.imagefield);
    return !!imageCampaign ? imageCampaign[0].ext : "";
  }
  async sendMessage() {
    const { from: from5, imagefield, to } = this.contact;
    if (!!this.params.client) {
      !!imagefield ? this.sendImage() : this.sendText();
    } else
      throw `Bot no encontrado ${from5} ${to} ${this.getMessage()}`;
  }
  async sendImage() {
    var _a;
    const { to } = this.contact;
    return this.saveOnDb(await ((_a = this.params.client) == null ? void 0 : _a.sendMessage(to, this.getImage(), this.getMessage())));
  }
  async sendText() {
    var _a;
    const { to } = this.contact;
    (_a = this.params.client) == null ? void 0 : _a.sendMessage(to, this.getMessage());
  }
  async saveOnDb(message) {
    const messageDB = [message].map(({
      timestamp,
      ack,
      id,
      from: from5,
      to,
      author,
      fromMe,
      hasMedia,
      body
    }) => ({
      timestamp,
      ack,
      id,
      from: from5,
      to,
      author,
      fromMe,
      hasMedia,
      body
    }))[0];
    messageDB.name = await message.getChat().then((chat) => chat.name);
    messageDB.fromGroup = !!message.author;
    return await this.params.messageData.create(messageDB);
  }
};
var CampaignManager = class {
  constructor() {
  }
  async createCampaingFromFile(excelPath) {
    const creator = new CampaignCreator();
    const campaign = await creator.createCampaing(fs4.readFileSync(excelPath)).catch((err) => console.log(err));
    if (!!!campaign)
      return false;
    const schedule = this.scheduleCampaing(campaign, PhonesInfo.selectAvailablePhonesClients([]));
    return !!schedule && CampaignsInfo.loadCampaing(campaign) && CampaignsInfo.loadSchedule(schedule);
  }
  selectClient(clients) {
    return clients[Math.floor(Math.random() * clients.length)];
  }
  scheduleCampaing(campaign, clients) {
    const schedulerManager = new SchedulerEventsManager({ campaign, messageData: new MessageMongo(), client: this.selectClient(clients) });
    const scheduler = new CampaignScheduler(campaign, { runOnReady: false, schedulerEventCallbacks: schedulerManager });
    return scheduler;
  }
};

// src/CampaignCreator/classes/CampaingsInfo.ts
var _CampaignsInfo = class _CampaignsInfo {
  static get Manager() {
    if (!!!_CampaignsInfo._Manager)
      _CampaignsInfo._Manager = new CampaignManager();
    return _CampaignsInfo._Manager;
  }
  static loadSchedule(schedule) {
    return !!_CampaignsInfo.CampaignsController.set(schedule.campaign.configuration.campaignName, schedule);
  }
  static loadCampaing(campaign) {
    return !!_CampaignsInfo.Campaings.set(`${campaign.createDate.getTime()}-${campaign.configuration.campaignName}`, campaign);
  }
  static contactPhones({ contacts }) {
    const recieverPhones = contacts.map((contact) => contact.to).filter((phone, index, arr) => arr.indexOf(phone) === index);
    CLIUtils.showVerticalTable({
      Remitentes: recieverPhones
    });
  }
  static contactBots({ contacts }) {
    const botPhones = contacts.map((contact) => contact.from).filter((phone, index, arr) => arr.indexOf(phone) === index);
    const recieverPhones = contacts.map((contact) => contact.to);
    CLIUtils.showVerticalTable({
      bots: botPhones
    });
  }
  static confResume({ configuration }) {
    const { behaviour, campaignName, startDate, endDate } = configuration;
    const { latency, mode, unit } = behaviour;
    const parsedConf = { campaignName, latency, mode, unit, startDate, endDate };
    CLIUtils.showHorizontalTable([parsedConf]);
  }
  static imageResume({ images }) {
    const sizeParsed = images.map(({ ext, image, name }) => ({ name, ext, size: translateSizeIntoString(ImageSize(image)) }));
    CLIUtils.showHorizontalTable(sizeParsed);
  }
  static contactResume({ contacts }) {
    const numberOfMessages = contacts.length;
    const botPhones = contacts.map((contact) => contact.from).filter((phone, index, arr) => arr.indexOf(phone) === index);
    const recieverPhones = contacts.map((contact) => contact.to).filter((phone, index, arr) => arr.indexOf(phone) === index);
    CLIUtils.showVerticalTable({
      Cantidad: numberOfMessages,
      bots: botPhones,
      Remitentes: recieverPhones
    });
  }
  static getLoadedCampaign(selection) {
    var _a;
    return (_a = Array.from(this.Campaings.entries()).find((entry) => {
      var _a2, _b, _c;
      const [name, campaing] = entry;
      return selection === `${name} => id: ${(_a2 = campaing.id) != null ? _a2 : "sin salvar"} || status: ${campaing.state} ||  mensajes enviados: ${(_b = campaing.contacts.filter((message) => message.status === "completed" /* COMPLETED */).length) != null ? _b : 0}/${campaing.contacts.length} || mensajes error envio: ${(_c = campaing.contacts.filter((message) => message.status === "error" /* ERROR */).length) != null ? _c : 0}`;
    })) == null ? void 0 : _a[1];
  }
  static listLoadedCampaings() {
    return Array.from(this.Campaings.entries()).map((entry) => {
      var _a, _b, _c;
      const [name, campaing] = entry;
      return `${name} => id: ${(_a = campaing.id) != null ? _a : "sin salvar"} || status: ${campaing.state} ||  mensajes enviados: ${(_b = campaing.contacts.filter((message) => message.status === "completed" /* COMPLETED */).length) != null ? _b : 0}/${campaing.contacts.length} || mensajes error envio: ${(_c = campaing.contacts.filter((message) => message.status === "error" /* ERROR */).length) != null ? _c : 0}`;
    });
  }
};
_CampaignsInfo.Campaings = /* @__PURE__ */ new Map();
_CampaignsInfo.CampaignsController = /* @__PURE__ */ new Map();
var CampaignsInfo = _CampaignsInfo;

// src/cli/Commands/Campaigns/AddCampaing.ts
var AddCampaign = class {
  constructor(back) {
    this.prompt = false;
    this.manageOptions = async (options) => {
      const action = options == null ? void 0 : options.action;
      const res = await CLIUtils.createAutoComplete({ name: "add", message: "Crear Campa\xF1a", autocomplete: ["Subir Excel", "atras"] });
      await this.runSelection(res.answer).catch((err) => console.log(err));
      return CLIProgram.setNextCommand(this.back);
    };
    this.ListOptions = (options) => ({
      type: "list",
      name: "action",
      message: "Selecciona una opcion",
      choices: [
        // 'Crear Campaña',
        // 'Visualizar',
        // 'atras'
      ]
    });
    this.back = back;
  }
  async runSelection(selection) {
    if (selection === "Subir Excel") {
      const fileSelected = await this.showUploadDialog();
      await this.processFile(fileSelected);
    }
  }
  async processFile(fileSelected) {
    if (fileSelected !== "")
      await CampaignsInfo.Manager.createCampaingFromFile(fileSelected).then(() => console.log("Campa\xF1a creada"));
  }
  async showUploadDialog() {
    const openDialog = new DialogNFD();
    return await openDialog.showSingleOpenDialog();
  }
};

// src/cli/Commands/Campaigns/CampaignParts.ts
var CampaginParts = class {
  // prompt?: boolean | undefined = false;
  constructor(back) {
    this.manageOptions = async (options) => {
      const action = options == null ? void 0 : options.action;
      switch (action) {
        case "Contactos":
          let resContacts = await CLIUtils.createAutoComplete({ name: "contact", autocomplete: ["Resumen", "Telefonos", "Contactos", "Mensajes", "atras"] });
          if (resContacts.answer === "atras")
            return CLIProgram.setNextCommand(this);
          this.contactsManageOptions(resContacts);
          return CLIProgram.setNextCommand(this);
          break;
        case "Imagenes":
          let resImages = await CLIUtils.createAutoComplete({ name: "add", autocomplete: ["Resumen", "atras"] });
          if (resImages.answer === "atras")
            return CLIProgram.setNextCommand(this);
          this.imagesManageOptions(resImages);
          return CLIProgram.setNextCommand(this);
          break;
        case "Configuracion":
          let resConf = await CLIUtils.createAutoComplete({ name: "add", autocomplete: ["Resumen", "atras"] });
          if (resConf.answer === "atras")
            return CLIProgram.setNextCommand(this);
          this.confManageOptions(resConf);
          return CLIProgram.setNextCommand(this);
          break;
      }
      return CLIProgram.setNextCommand(this.back);
    };
    this.ListOptions = (options) => ({
      type: "list",
      name: "action",
      message: "Selecciona una opcion",
      choices: [
        "Contactos",
        "Imagenes",
        "Configuracion",
        "atras"
      ]
    });
    this.back = back;
  }
  confManageOptions(res) {
    switch (res.answer) {
      case "Resumen":
        CampaignsInfo.confResume(this.passInOptions.extraParams);
        break;
    }
  }
  imagesManageOptions(res) {
    switch (res.answer) {
      case "Resumen":
        CampaignsInfo.imageResume(this.passInOptions.extraParams);
        break;
    }
  }
  contactsManageOptions(res) {
    switch (res.answer) {
      case "Resumen":
        CampaignsInfo.contactResume(this.passInOptions.extraParams);
        break;
      case "Telefonos":
        CampaignsInfo.contactBots(this.passInOptions.extraParams);
        break;
      case "Contactos":
        CampaignsInfo.contactPhones(this.passInOptions.extraParams);
        break;
      case "Mensajes":
        CampaignsInfo.contactPhones(this.passInOptions.extraParams);
        break;
    }
  }
};

// src/cli/Commands/Campaigns/LoadedCampaigns.ts
var LoadedCampaigns = class {
  constructor(back) {
    this.prompt = false;
    this.manageOptions = async (options) => {
      const action = options == null ? void 0 : options.action;
      const selectCampaing = await CLIUtils.createAutoComplete({ name: "campaign", message: "Selecciona Campa\xF1a", autocomplete: Array.prototype.concat(CampaignsInfo.listLoadedCampaings(), "atras") });
      if (selectCampaing.answer === "atras")
        return CLIProgram.setNextCommand(this.back);
      const campaignSelected = CampaignsInfo.getLoadedCampaign(selectCampaing.answer);
      const actionWithCampaign = await CLIUtils.createAutoComplete({
        name: "action",
        message: `Que deseas hacer con la campa\xF1a: 
        ${campaignSelected.createDate.getTime()}-${campaignSelected.configuration.campaignName}`,
        autocomplete: ["Salvar", "Ver Detalles", "atras"]
      });
      switch (actionWithCampaign.answer) {
        case "Salvar":
          break;
        case "Ver Detalles":
          const campaginParts = new CampaginParts(this);
          campaginParts.passInOptions = { action: "campaign", extraParams: campaignSelected };
          return CLIProgram.setNextCommand(campaginParts);
          break;
        case "atras":
          return CLIProgram.setNextCommand(this.back);
          break;
      }
      return CLIProgram.setNextCommand(this.back);
    };
    this.ListOptions = (options) => ({
      type: "list",
      name: "action",
      message: "Selecciona una opcion",
      choices: [
        // 'Crear Campaña',
        // 'Visualizar',
        // 'atras'
      ]
    });
    this.back = back;
  }
};

// src/cli/Commands/Campaigns/VisualizeCampaign.ts
var VisualizeCampaign = class {
  constructor(back) {
    this.manageOptions = (options) => {
      const action = options == null ? void 0 : options.action;
      switch (action) {
        case "Ver Campa\xF1as Cargadas":
          const loadedCampaigns = new LoadedCampaigns(this);
          return CLIProgram.setNextCommand(loadedCampaigns);
          break;
        case "Ver Campa\xF1as Salvadas":
          break;
        case "atras":
          return CLIProgram.setNextCommand(this.back);
          break;
          return CLIProgram.setNextCommand(this.back);
      }
    };
    this.ListOptions = (options) => ({
      type: "list",
      name: "action",
      message: "Selecciona una opcion",
      choices: [
        "Ver Campa\xF1as Cargadas",
        "Ver Campa\xF1as Salvadas",
        "atras"
      ]
    });
    this.back = back;
  }
};

// src/cli/Commands/Campaigns/Campaigns.ts
var CampaignCLI = class {
  constructor(back) {
    this.manageOptions = (options) => {
      const action = options == null ? void 0 : options.action;
      switch (action) {
        case "Crear Campa\xF1a":
          const addCampaign = new AddCampaign(this);
          return CLIProgram.setNextCommand(addCampaign);
          break;
        case "Visualizar":
          const vizualize = new VisualizeCampaign(this);
          return CLIProgram.setNextCommand(vizualize);
          break;
        case "atras":
          return CLIProgram.setNextCommand(this.back);
          break;
          return CLIProgram.setNextCommand(this.back);
      }
    };
    this.ListOptions = (options) => ({
      type: "list",
      name: "action",
      message: "Selecciona una opcion",
      choices: [
        "Crear Campa\xF1a",
        "Visualizar",
        "atras"
      ]
    });
    this.back = back;
  }
};

// src/cli/classes/CLIProgram.ts
var _CLIProgram = class _CLIProgram {
  constructor() {
    this.manageOptions = (options) => {
      const action = options == null ? void 0 : options.action;
      switch (action) {
        case "Telefonos":
          const phones = new CLIPhones(this);
          return _CLIProgram.setNextCommand(phones);
          break;
        case "Afiliados":
          const affMenu = new AffiliatesMenu(this);
          return _CLIProgram.setNextCommand(affMenu);
          break;
        case "Campa\xF1as":
          const campaignMenu = new CampaignCLI(this);
          return _CLIProgram.setNextCommand(campaignMenu);
          break;
        case "Mensajes":
          const messages = new Messages(this);
          _CLIProgram.setNextCommand(messages);
          break;
        case "Salir":
          process.exit(0);
          break;
      }
      return _CLIProgram.setNextCommand(this);
    };
    _CLIProgram.baseCommand = this;
  }
  static setNextCommand(command, options) {
    command.passInOptions = options != null ? options : command.passInOptions;
    _CLIProgram.nextCommand = command;
    let prompt = true;
    if (typeof command.prompt !== "undefined")
      prompt = command.prompt;
    _CLIProgram.showMenu(_CLIProgram.nextCommand.ListOptions(options), prompt);
  }
  static backToBegining() {
    _CLIProgram.setNextCommand(_CLIProgram.baseCommand);
  }
  ListOptions() {
    return {
      type: "list",
      name: "action",
      message: "Selecciona una opcion",
      choices: ["Telefonos", "Afiliados", "Campa\xF1as", "Mensajes", "Salir"]
    };
  }
};
_CLIProgram.menuNext = new import_rxjs4.Subject();
_CLIProgram.showMenu = (options, prompt) => {
  if (!!!prompt)
    return _CLIProgram.menuNext.next({});
  import_inquirer2.default.prompt(options).then((respuestas) => {
    _CLIProgram.menuNext.next(respuestas);
  });
};
var CLIProgram = _CLIProgram;

// src/Main.ts
var import_mongoose6 = __toESM(require("mongoose"));
var init_moongoose = async () => {
  return await import_mongoose6.default.connect(process.env.MONGOCONNECTIONSTRING).then(() => {
    console.log("Conexi\xF3n exitosa a la base de datos");
  }).catch((error) => {
    console.error("Error de conexi\xF3n a la base de datos:", error);
  });
};
var main = async () => {
  await init_moongoose();
  console.clear();
  const cli = new CLIProgram();
  CLIProgram.setNextCommand(cli);
  CLIProgram.menuNext.subscribe({
    next: async (options) => await CLIProgram.nextCommand.manageOptions(options),
    complete: () => console.log("complete")
  });
};
main();
