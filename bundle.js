const fs = require("fs");
const UglifyJS = require("uglify-js");

const cliArr = process.argv.slice(2);

function showHelp() {
  console.log(`
    Description:

    Bundle is a script that concatenates multiple JavaScript source files into a single file.

    Usage:

    bundle <options> [list of JavaScript files]

    Options:

    --minify : Removes all unnecessary characters from JavaScript source code.
    --out    : Specifies the path of the output bundled file. Default is 'output.js'.
    --help   : Show this help message.
  `);
}

let outputFile = "output.js";
let minify = false;
let fileListArr = [];

for (let i = 0; i < cliArr.length; i++) {
  switch (cliArr[i]) {
    case "--minify":
      minify = true;
      break;
    case "--out":
      outputFile = cliArr[i + 1];
      i++;
      break;
    case "--help":
      showHelp();
      break;
    default:
      fileListArr.push(cliArr[i]);
      break;
  }
}

let bundle = "";
fileListArr.forEach((file) => {
  if (fs.existsSync(file)) {
    const code = fs.readFileSync(file, "utf-8");
    bundle += code + "\n";
  } 
  else {
    console.error(`File not found - ${file}`);
    return;
  }
});

if (minify) {
  const minified = UglifyJS.minify(bundle);
  if (minified.error) {
    console.error("Error ", minified.error);
    return;
  }
  bundle = minified.code;
}

fs.writeFileSync(outputFile, bundle);
console.log(`Bundled file written to ${outputFile}`);