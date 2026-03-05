/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent template for all weathers.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = CLS_contentTemplate;


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "WEA_baseWeather").initClass()
  .setParent(null)
  .setTags("")
  .setParam({
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaStat: true,
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaProp: true,
  })
  .setMethod({});
