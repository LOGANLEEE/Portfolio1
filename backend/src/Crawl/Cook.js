const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;

function fetching() {
    const url = 'https://www.82cook.com/entiz/enti.php?bn=15';
    axios.get(url).then((res) => {
        if (res.status === 200) {
            Processor(res.data);
        }
    }).catch((err) => info(err));

    async function Processor(html) {
        for (let i = 1; i < 11; i++) {
            const target = `#column1 > div.leftbox.Best > ul > li:nth-child(${i})`;
            const $ = cheerio.load(html);
            const link = $(target + '> a').attr('href');
            const title = $(target + '> a').text();
            // const time = $(target + '> td.list_date.no_att').text();
            // const author = $(target + '> td.list_name > span').text();
            // const hitCount = $(target + '> td.list_click.no_att').text();
            const data = {
                title,
                // author,
                link: 'https://www.82cook.com/' + link,
                // hitCount: parseInt(hitCount),
                // registeredAt: time,
                from: '82Cook',
            };

            await prisma.createPost(data);
            await prisma.createCook(data);
        }
        info("£££ COOK Done");
    }
}

module.exports = {
    fetching
}