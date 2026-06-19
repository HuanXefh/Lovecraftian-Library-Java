/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/sta/DBCT_databaseContent");


  /* <---------- auxiliary ----------> */


  function appendChildren(cts, node) {
    node.children.each(onode => {
      // Don't append contents under other nodes (including the other nodes)
      if(checkCreatedByTemp(onode.content) && onode.content.ex_isSubInsOf("DBCT_techNodeContent")) return;
      // Don't append hidden contents
      if(
        (instanceOfAny(onode.content, Item, Liquid, UnitType) && onode.content.hidden)
          || (onode.content instanceof Block && DB_block.db["class"]["group"]["visibility"]["hidden"].includes(onode.content.buildVisibility))
      ) return;

      cts.pushUnique(onode.content);
      appendChildren(cts, onode);
    });
  };


  /* <---------- component ----------> */


  function comp_init(sta) {
    MDL_event._c_onLoad(() => {
      if(sta.techNode == null) {
        console.warn("[LOVEC] Tech node ${1} has never been used in tech tree!".format(sta.name.color(Pal.accent)));
      } else {
        appendChildren(sta.childCts, sta.techNode);
        sta.childCts.sort((ct1, ct2) => ct2.id - ct1.id);
      };
    });
  };


  function comp_setStats(sta) {
    sta.stats.add(fetchStat("lovec", "spec-nodects"), newStatValue(tb => {
      tb.row();
      tb.table(Styles.none, tb1 => {
        MDL_table.__margin(tb1);
        MDL_table._l_ctLi(tb, sta.childCts, 48.0, 7, null, VAR.dialog.ct1);
      }).growX();
    }));
  };


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
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @memberof DBCT_techNodeContent
     * @instance
     */
    childCts: prov(() => []),


    /* <------------------------------ vanilla ------------------------------ */


    databaseCategory: "lovec-tech-node",
    databaseTag: "default",


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


    isHidden: function() {
      return false;
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
