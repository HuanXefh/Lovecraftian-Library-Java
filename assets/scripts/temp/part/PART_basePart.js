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


  /**
   * Root of all parts.
   * @class PART_basePart
   * @extends CLS_contentTemplate
   */
  module.exports = newClass().extendClass(PARENT, "PART_basePart").initClass()
  .setParent(null)
  .setTags()
  .setParam({


    /* <------------------------------ vanilla ------------------------------ */


    under: false,


  })
  .setMethod({});
