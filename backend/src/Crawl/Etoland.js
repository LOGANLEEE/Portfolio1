const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;

function fetching() {
    const url = '/list?code=best';

    axios.get(url).then((res) => {
        if (res.status === 200) {
            Processor(res.data);
        }
    }).catch((err) => info(err));

    function Processor(html) {
        // 1~30
        for (let i = 1; i < 31; i++) {
            const target = `#boardlist > tbody > tr:nth-child(${i})`;
            const $ = cheerio.load(html);
            const title = $(target + ' > td.pl14 > a.bsubject').text();
            const link = $(target + ' > td.pl14 > a.bsubject').attr('href');
            const time = $(target + ' > td.date').text();
            const writer = $(target + ' > td.author02 > span.author').text();

            authorist.push(writer);
            titleList.push(title);
            linkList.push('http://www.bobaedream.co.kr' + link);
            timeList.push(time);
        }
    }
    store.dispatch(action.getBobae(titleList, linkList, timeList, authorist));
    return true;
}

module.exports = {
    fetching
}