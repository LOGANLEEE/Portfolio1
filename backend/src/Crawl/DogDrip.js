import axios from 'axios';
import cheerio from 'cheerio';
import store from '../../store';
import * as action from '../../containers/Mowa/action';

const info = console.info;

export default async function DogDrip() {
    const titleList = [];
    const linkList = [];
    const url = 'https://www.dogdrip.net/index.php?mid=dogdrip&page=1';

    await axios
        .get(url)
        .then((res) => {
            if (res.status === 200) {
                dogDripSelector(res.data);
            }
        })
        .catch((err) => info(err));

    function dogDripSelector(html) {
        for (let i = 1; i < 21; i++) {
            const dogDrip = `#main > div > div.eq.section.secontent.background-color-content > div > div.ed.board-list > table > tbody > tr:nth-child(${i})`;
            const $ = cheerio.load(html);
            const title = $(
                dogDrip + '> td.title > a > span.ed.title-link',
            ).text();
            const link = $(dogDrip + '> td.title > a').attr('href');
            // info(title);
            titleList.push(title);
            // info(link);
            linkList.push(link);
        }
    }
    store.dispatch(action.getDogDripNet(titleList, linkList));
    return true;
}
