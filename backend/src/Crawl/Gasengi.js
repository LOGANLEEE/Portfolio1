const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;

function fetching() {
    const url = 'https://www.gasengi.com/main/board.php?bo_table=commu';
    axios.get(url).then((res) => {
        if (res.status === 200) {
            Processor(res.data);
        }
    }).catch((err) => info(err));

    async function Processor(html) {
        for (let i = 1; i < 3; i++) {
            for (let j = 1; j < 6; j++) {
                // #rightcolumn > div.rank_div > div.rank_dbox > ol > span:nth-child(1) > li:nth-child(1)
                // #rightcolumn > div.rank_div > div.rank_dbox > ol > span:nth-child(2) > li:nth-child(1)
                const target = `#rightcolumn > div.rank_div > div.rank_dbox > ol > span:nth-child(${i}) > li:nth-child(${j})`;
                const $ = cheerio.load(html);
                const link = $(target + '> a').attr('href');
                const title = $(target + '> a').text();
                // const time = $(target + '> td.list_date.no_att').text();
                // const author = $(target + '> td.list_name > span').text();
                // const hitCount = $(target + '> td.list_click.no_att').text();
                const data = {
                    title,
                    // author,
                    link: 'https://www.gasengi.com/' + link,
                    // hitCount: parseInt(hitCount),
                    // registeredAt: time,
                    from: 'Gasengi',
                };

                await prisma.createPost(data);
                await prisma.createGasengi(data);
            }
        }
        info("£££ Gasengi Done")
    }
}

module.exports = {
    fetching
}