import axios from 'axios';
import cheerio from 'cheerio';
import store from '../../store';
import * as action from '../../containers/Mowa/action';

const info = console.info;

export default async function fetching() {
    const titleList = [];
    const linkList = [];
    const timeList = [];
    const authorist = [];
    const hitList = [];
    const url = '/board/humor/list.html?table=pds';
    await axios
        .get(url)
        .then((res) => {
            if (res.status === 200) {
                Processor(res.data);
            }
        })
        .catch((err) => info(err));
    // #cnts_list_new > div:nth-child(1) > table:nth-child(3) > tbody > tr:nth-child(20)
    // #cnts_list_new > div:nth-child(1) > table:nth-child(3) > tbody > tr:nth-child(1) > td.li_sbj > a
    // #cnts_list_new > div:nth-child(1) > table:nth-child(3) > tbody > tr:nth-child(1) > td.li_date > span.w_time
    // #cnts_list_new > div:nth-child(1) > table:nth-child(3) > tbody > tr:nth-child(1) > td.li_icn > table > tbody > tr > td.g6 > span > span
    // #cnts_list_new > div:nth-child(1) > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(5)
    // #li_chk_pds-886726 > td:nth-child(5)

    function Processor(html) {
        // 1~20
        for (let i = 1; i < 21; i++) {
            const target = `#cnts_list_new > div:nth-child(1) > table:nth-child(3) > tbody > tr:nth-child(${i})`;
            const $ = cheerio.load(html);
            const title = $(target + ' > td.li_sbj > a').text();
            const link = $(target + ' > td.li_sbj > a').attr('href');
            const time = $(target + ' > td.li_date > span.w_time').text();
            const writer = $(
                target +
                    ' > td.li_icn > table > tbody > tr > td.g6 > span > span',
            ).text();
            const count = $(target + ' > td:nth-child(5)').text();

            authorist.push(writer);
            titleList.push(title);
            linkList.push('http://web.humoruniv.com/board/humor/' + link);
            timeList.push(time[1]);
            hitList.push(count);
        }
    }
    store.dispatch(
        action.getHumorUniv(titleList, linkList, timeList, authorist, hitList),
    );
    return true;
}
