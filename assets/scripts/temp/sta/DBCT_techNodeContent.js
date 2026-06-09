/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/sta/DBCT_databaseContent");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Used to categorize tech nodes.
   * @class DBCT_infoContent
   * @extends DBCT_databaseContent
   */
  module.exports = newClass().extendClass(PARENT, "DBCT_techNodeContent").initClass()
  .setParent(StatusEffect)
  .setTags()
  .setParam({})
  .setMethod({


    isHidden: function() {
      return true;
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
