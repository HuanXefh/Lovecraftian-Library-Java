/* ----------------------------------------
 * NOTE:
 *
 * A collection of noise generators (as class).
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_objectBox = require("lovec/cls/struct/CLS_objectBox");


/* <---------- meta ----------> */


const BOX_noise = new CLS_objectBox({


  white: require("lovec/cls/math/noise/CLS_whiteNoise"),
  value: require("lovec/cls/math/noise/CLS_valueNoise"),
  perlin: require("lovec/cls/math/noise/CLS_perlinNoise"),


});


module.exports = BOX_noise;
