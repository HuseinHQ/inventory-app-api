const { Item } = require('../models/index.js');

const isItemYours = async (req, res, next) => {
  try {
    const { id } = req.params;
    const UserId = req.user.id;
    const findItem = await Item.findByPk(id);
    if (!findItem) throw { name: 'not_found' };
    if (findItem.UserId !== UserId) throw { name: 'forbidden' };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { isItemYours };
