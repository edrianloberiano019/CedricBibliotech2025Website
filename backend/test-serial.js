const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const port = new SerialPort({
  path: "COM3", // Confirm this is still correct
  baudRate: 115200,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.on("open", () => {
  console.log("✅ Serial port open");
});

parser.on("data", (data) => {
  console.log("📦 Incoming data:", JSON.stringify(data));
});
