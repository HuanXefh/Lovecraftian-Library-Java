/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseItem");


  /* <---------- component ----------> */


  function comp_init(itm) {
    itm.intmdParent = MDL_content._ct(itm.intmdParent, "rs");
    itm.extraIntmdParents.inSituMap(nmRs => MDL_content._ct(nmRs, "rs")).compact();

    itm.ex_generateIntmdName();
  };


  function comp_setStats(itm) {
    itm.stats.add(fetchStat("lovec", "rs-isintermediate"), true);
    if(itm.intmdParent != null) itm.stats.add(fetchStat("lovec", "rs0int-parent"), newStatValue(tb => {
      tb.row();
      MDL_table._l_ctRow(tb, itm.intmdParent);
    }));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Items that are not final products.
   * Intermediate items can have parent items, and it's possible to create generated icons based on the parents.
   * @class RS_intermediateItem
   * @extends RS_baseItem
   */
  module.exports = newClass().extendClass(PARENT, "RS_intermediateItem").initClass()
  .setParent(Item)
  .setTags("rs-intmd")
  .setParam({


    /**
     * <PARAM>: Parent of this intermediate.
     * @override
     * @memberof RS_intermediateItem
     * @instance
     */
    intmdParent: null,
    /**
     * <PARAM>: Extra resources used for icon tag generation.
     * @override
     * @memberof RS_intermediateItem
     * @instance
     */
    extraIntmdParents: prov(() => []),
    /**
     * <PARAM>: Whether to generate icons based on the parent. Set this to false if you have sprite for this intermediate.
     * @override
     * @memberof RS_intermediateItem
     * @instance
     */
    useParentReg: true,
    /**
     * <PARAM>: Determines the pixmap used to generate recolored sprites. {@link RS_intermediateItem#intmdParent} is required in this case. If null, icon tag will be used instead.
     * @override
     * @memberof RS_intermediateItem
     * @instance
     */
    recolorRegStr: null,


    /* <------------------------------ vanilla ------------------------------ */


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
