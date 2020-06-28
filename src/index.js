
const fs = require('fs');
const translate = require('translate');
const Encoding = require('encoding-japanese');
const mkdirp = require('mkdirp');
require('dotenv').config();
translate.from = 'ko';
translate.engine = 'google';
translate.key = process.env.GOOGLE_CLOUD_KEY;
const FILE_PATH = './input/snakes-utf8.tsv';
const OUTPUT_FOLDER = './output';
const OUTPUT_PATH = OUTPUT_FOLDER + '/snakes.txt';
const MAX_RESULTS = 5; //-1 for all results

const fileBuffer = fs.readFileSync(FILE_PATH);
console.log(Encoding.detect(fileBuffer));

mkdirp(OUTPUT_FOLDER).then(made => {
  if (made) {
    console.log(`OUTPUT_FOLDER CREATED: ${made}`);
  }
});

fs.readFile(FILE_PATH, 'utf8', async function (err, contents) {

    var lines = contents.split("\n");
    var data = lines.map((line, i) => {
        var lineData = line.split("\t");
        return {
            key: lineData[0],
            text: (lineData[1]),
            index: i
        }
    });
    const outputData = [];
    let outputStr = "";
    const t = async data => {
        try {
            let res = await translate(data.text, {to: 'en'});
            return({
                ...data,
                translation: res
            });
        } catch (e) {
            throw e;
        }
    };

    const tSeries = async data => {
        for (var i = 0; i < data.length; i++) {
            try {
                let res = await t(data[i]);
                console.log(res);
                outputData.push(res);
                outputStr += res.translation + "\n";
            } catch (e) {
                console.log("Failed to convert language data (see error below) ", data[i]);
                throw e
            }
        }
    };

    try {
        await tSeries(data.slice(0, MAX_RESULTS >= 0? MAX_RESULTS : data.length));
        console.log('Successfully translated ' + outputData.length + ' translations');
    } catch (e) {
        console.log(e);
    }

    const storeData = (data, path) => {
        try {
            fs.writeFile(path, data, () => {
              if (err) return console.log(err);
              console.log("Output created successfully at" + OUTPUT_PATH);
            });
        } catch (err) {
            console.error(err);
        }
    };
    storeData(outputStr, OUTPUT_PATH);
});

