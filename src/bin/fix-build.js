const fs = require("fs");
const path = require("path");
const basePath = path.join(process.cwd(), "dist/presentation/web/.next/static/chunks");
const files = fs.readdirSync(basePath);
const searchTarget = `new Error(\\"Cannot find module '../../../../.."+o+\\"'\\")`;
const replaceValue = `new Error(\\"Cannot find module '../../../../..\\"+o+\\"'\\")`;
files.forEach((file) => {
  const isJs = file.split(".").reverse()[0] == "js";
  if (isJs) {
    const filePath = path.join(basePath, file);
    let fileContent = fs.readFileSync(filePath).toString();
    if (fileContent.indexOf(searchTarget) > -1) {
      fileContent = fileContent.replace(searchTarget, replaceValue);
      fs.writeFileSync(filePath, fileContent);
    }
  }
});
