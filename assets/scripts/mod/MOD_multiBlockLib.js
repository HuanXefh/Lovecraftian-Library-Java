/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Utility methods for Multi Block Lib.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  const ENABLED = fetchMod("multi-block-lib") != null;
  exports.ENABLED = ENABLED;


  const CLASSES = {};
  if(ENABLED) {
    CLASSES.LinkBlock = fetchClass("multiblock.extend.LinkBlock");
    CLASSES.PlaceholderBlock = fetchClass("multiblock.extend.PlaceholderBlock");
    CLASSES.MultiBlockGenericCrafter = fetchClass("multiblock.extend.multiblock.MultiBlockGenericCrafter");
    CLASSES.MultiBlockAttributeCrafter = fetchClass("multiblock.extend.multiblock.MultiBlockAttributeCrafter");
  };
  exports.CLASSES = CLASSES;
