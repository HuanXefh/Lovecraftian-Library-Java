/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseItem");


  /* <---------- component ----------> */


  function comp_init(item) {
    item.intmdParent = MDL_content.getCt(item.intmdParent, "rs");
    item.extraIntmdParents.inSituMap(nameRs => MDL_content.getCt(nameRs, "rs")).compact();

    item.ex_generateIntmdName();

    if(item.intmdParent != null && item.hardness === 0) {
      item.hardness = item.intmdParent.hardness;
    };
  };


  function comp_setStats(item) {
    item.stats.add(fetchStat("lovec", "rs-isintermediate"), true);
    if(item.intmdParent != null) item.stats.add(fetchStat("lovec", "rs0int-parent"), newStatValue(tb => {
      tb.row();
      MDL_table.setCtRow(tb, item.intmdParent);
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
     * `PARAM`: Parent of this intermediate.
     * @override
     * @memberof RS_intermediateItem
     * @instance
     */
    intmdParent: null,
    /**
     * `PARAM`: Extra resources used for icon tag generation.
     * @override
     * @memberof RS_intermediateItem
     * @instance
     */
    extraIntmdParents: tprov(() => []),
    /**
     * `PARAM`: Whether to generate icons based on the parent. Set this to false if you have sprite for this intermediate.
     * @override
     * @memberof RS_intermediateItem
     * @instance
     */
    useParentReg: true,
    /**
     * `PARAM`: Determines the pixmap used to generate recolored sprites. {@link RS_intermediateItem#intmdParent} is required in this case. If null, icon tag will be used instead.
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
