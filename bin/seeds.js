const mongoose = require('mongoose');
require('../configs/db.config');
const Shop = require('../models/shop.model');

const shops = [
  {
    "name": "Revolve",
    "image": "https://consumer-img.huawei.com/content/dam/huawei-cbg-site/common/support/list-image/phones/p8-lite-2017/p8-lite-2017-listimage-black.png",
    "specs": [
      "party",
      "dresses"
    ]
  },
  {
    "name": "Missguided",
    "image": "https://boltmobile.ca/wp-content/uploads/2016/09/iphone7-plus-front-web-boltmobile-sasktel.png",
    "specs": [
      "jackets",
      "t-shirts"
    ]
  },
  {
    "name": "Asos",
    "image": "http://catalogo.movistar.com.pe/ArchivosUsuario/EquipoCaracteristica/g-flex-2-h955p_528_Imagen.png",
    "specs": [
      "summer"
    ]
  }
];

Shop.create(shops)
  .then(() => {
    console.info("Seeds success:", shops);
    mongoose.connection.close();
  })
  .catch(error => {
    console.error("Seeds error:", shops);
    mongoose.connection.close();
  });
