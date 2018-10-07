const {session} = require('electron');


function clearCookies(url) {
    session.defaultSession.cookies.get({url: url}, (err, cookies) => {
        if (err) throw err;
        var cookies = cookies;
        console.log('cookies on this website:', cookies);
        for (let k = 0; k < cookies.length; k++) {
            session.defaultSession.cookies.remove(url, cookies[k]['name'], (err) => {
                if (err) throw err;
            })
        }
    });
}

module.exports = clearCookies;
