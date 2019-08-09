const proxy = require('http-proxy-middleware');

const ilbe = proxy({
    target: 'https://www.ilbe.com',
    changeOrigin: true,
});

const bullpen = proxy({
    target: 'http://mlbpark.donga.com',
    changeOrigin: true,
});

const clien = proxy({
    target: 'https://www.clien.net',
    changeOrigin: true,
});
const bobae = proxy({
    target: 'http://www.bobaedream.co.kr',
    changeOrigin: true,
});

const humorUniv = proxy({
    target: 'http://web.humoruniv.com',
    changeOrigin: true,
});

module.exports = function(app) {
    app.use('/list/ilbe', ilbe);
    app.use('/mp/b.php', bullpen);
    app.use('/service/board/park', clien);
    app.use('/list', bobae);
    app.use('/board/humor', humorUniv);
};
