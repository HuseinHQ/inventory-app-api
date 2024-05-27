const moment = require('moment');

function formatDate(date) {
  moment.locale('id'); // set locale to Indonesian
  return moment(date).format('dddd, D MMMM YYYY HH:mm [WIB]');
}

module.exports = formatDate;
