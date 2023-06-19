const axios = require('axios');
const cheerio = require('cheerio');
const { parseAsync } = require('json2csv');
const fs = require("fs");

async function getData(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const properties = [];

    const elements = $('h2 .overflow-hidden');

    for (let i = 0; i < elements.length; i++) {
      const sentence = $(elements[i]).text();
      const words = sentence.split(" ");
      const area = words[words.length - 1];
      const propertyUrl = 'https://www.nobroker.in' + $(elements[i]).attr('href');

      const res = await axios.get(propertyUrl);
      const $1 = cheerio.load(res.data);
      const ageElement = $1('.nb__2xbus .nb__1IoiM').eq(0).text();

      properties.push({
        area,
        url: propertyUrl,
        ageElement
      });
    }

    const csv = await parseAsync(properties);
    fs.writeFileSync('output.csv', csv, 'utf-8');
    console.log('CSV file has been created successfully.');

  } catch (error) {
    console.error(error);
  }
}

const url = 'https://www.nobroker.in/flats-for-sale-in-koramangala_bangalore';
getData(url);
