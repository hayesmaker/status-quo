
const fs = require('fs');
const translate = require('translate');
const path = require('path');
const Encoding = require('encoding-japanese');
require('dotenv').config();
translate.from = 'ko';
translate.engine = 'google';
translate.key = process.env.GOOGLE_CLOUD_KEY;
const FILE_PATH = './input/snakes-utf8.tsv';
const OUTPUT_PATH = './output/snakes.json';
const fileBuffer = fs.readFileSync(FILE_PATH);

console.log(Encoding.detect(fileBuffer));

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
    console.log("data", data.slice(0, 4));

    const outputData = [];

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
            } catch (e) {
                console.log("Failed to convert language data (see error below) ", data[i]);
                throw e
            }
        }
    };

    try {
        await tSeries(data.slice(0, 5));
        console.log('Successfully translated ' + outputData.length + ' translations');
        console.log('Find Translations in ', path.join(__dirname, OUTPUT_PATH));
    } catch (e) {
        console.log(e);
    }

    const storeData = (data, path) => {
        try {
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error(err)
        }
    };

    storeData(outputData, OUTPUT_PATH);
});

