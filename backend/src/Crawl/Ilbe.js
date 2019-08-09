const axios = require('axios');
const cheerio = require('cheerio');
const { prisma } = require('../../generated/prisma-client');

const { info } = console;

function fetching() {
    const url = 'https://www.ilbe.com/list/ilbe';
    // http://www.ilbe.com/list/ilbe?page=2&listStyle=list
    axios.get(url).then((res) => {
        if (res.status === 200) {
            Processor(res.data);
        }
    }).catch((err) => info(err));

    async function Processor(html) {
        // 7~36
        for (let i = 7; i < 37; i++) {
            const target = `#content-wrap > div.board-wrap > div.board-list > ul > li:nth-child(${i})`;
            const $ = cheerio.load(html);
            const link = $(target + ' > span.title > a').attr('href');
            const title = $(target + ' > span.title > a').text();
            const time = $(target + ' > span.date').text();
            const author = $(target + '> span.global-nick.nick > a').text();
            const hitCount = $(target + '> span.view').text();
            const data = {
                title,
                author,
                link: 'https://www.ilbe.com/' + link,
                hitCount: parseInt(hitCount),
                registeredAt: time,
                from: 'Ilbe',
            };
            await prisma.createPost(data);
            await prisma.createIlbe(data);
        }
    }
}

module.exports = {
    fetching
}