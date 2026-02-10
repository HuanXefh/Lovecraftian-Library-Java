/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Items that are not final products and by default hidden in planet database.
   * Intermediate items can have parent items, and possible to get generated icons based on the parents.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseItem");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_table = require("lovec/mdl/MDL_table")


  /* <---------- component ----------> */


  function comp_init(itm) {
    itm.intmdParent = MDL_content._ct(itm.intmdParent, "rs");
    itm.extraIntmdParents.inSituMap(nmRs => MDL_content._ct(nmRs, "rs")).pull(null);

    itm.ex_generateIntmdName();
  };


  function comp_setStats(itm) {
    itm.stats.add(fetchStat("lovec", "rs-isintermediate"), true);
    if(itm.intmdParent != null) itm.stats.add(fetchStat("lovec", "rs0int-parent"), newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_ctRow(tb, itm.intmdParent);
    }));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "RS_intermediateItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd")
  .setParam({
    // @PARAM: The parent of this intermediate.
    intmdParent: null,
    // @PARAM: Extra resources used for icon tag generation.
    extraIntmdParents: prov(() => []),
    // @PARAM: Whether to generate icons based on parent. Set this to {false} if you have sprite for the intermediate.
    useParentReg: true,
    // @PARAM: Determines pixmap used to generate recolored sprite, intermediate parent is required. If {null}, icon tag is used instead to distinguish intermediates.
    recolorRegStr: null,

    databaseTag: "lovec-intermediate",
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
