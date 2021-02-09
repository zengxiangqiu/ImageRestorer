module.exports = (sequelize, Sequelize) => {
  const Image = sequelize.define('image', {
    item_no: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    seq:{
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    picture: {
      type: Sequelize.BLOB('long')
    }
  }, {
    timestamps: false,
    tableName: 'tblitemmast_pic'
  });

  return Image;
}