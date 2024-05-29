const moment = require('moment');

function formatDate(date, lang = 'en') {
  moment.locale(lang);
  if (lang === 'id') {
    return moment(date).format('dddd, D MMMM YYYY HH:mm [WIB]');
  } else if (lang === 'en') {
    return moment(date).format('dddd, MMMM D, YYYY h:mm A');
  }
}

module.exports = formatDate;
