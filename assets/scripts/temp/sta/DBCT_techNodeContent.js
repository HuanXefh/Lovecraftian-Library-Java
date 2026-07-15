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


  function comp_setStats(sta) {
    if(sta.techNode != null) {
      sta.stats.add(fetchStat("lovec", "spec-researchreq"), StatValues.items(false, sta.techNode.requirements));
    };
    if(sta.childCts.length > 0) {
      sta.stats.add(fetchStat("lovec", "spec-nodects"), newStatValue(tb => {
        tb.row();
        tb.table(Styles.none, tb1 => {
          MDL_table.__margin(tb1);
          MDL_table._l_ctLi(tb, sta.childCts, 48.0, 7, null, VAR.dialog.ct1);
        }).growX();
      }));
    };
    if(sta.childRcs.length > 0) {
      sta.stats.add(fetchStat("lovec", "spec-nodercs"), newStatValue(tb => {
        tb.row();
        tb.table(Styles.none, tb1 => {
          MDL_table.__margin(tb1);
          MDL_table._l_iconLi(
            tb1,
            sta.childRcs.map(rc => rc.altIcon),
            sta.childRcs.map(rc => tb => rc.displayTooltip(tb, true, rc.owner.localizedName)),
            sta.childRcs.map(rc => () => Vars.ui.content.show(rc.owner)),
            64.0,
            7,
          );
        });
      }));
    };
  };


  function comp_ex_init(sta) {
    MDL_event._c_onLoad(() => {
      if(sta.techNode == null) {
        console.warn("[LOVEC] Tech node ${1} has never been used in tech tree!".format(sta.name.color(Pal.accent)));
      } else {
        appendChildren(sta.childCts, sta.techNode);
        sta.childCts.sort((ct1, ct2) => ct2.id - ct1.id);
      };
      Time.runTask(VAR.delay.load.loadNodeRcs, () => {
        sta.childRcs.pushAll(CLS_recipe.getNodeRcsMap().get(sta, Array.air));
      });
    });
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Used to categorize tech nodes.
   * @class DBCT_techNodeContent
   * @extends DBCT_databaseContent
   */
  module.exports = newClass().extendClass(PARENT, "DBCT_techNodeContent").initClass()
  .setParent(StatusEffect)
  .setTags()
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * `INTERNAL`
     * @memberof DBCT_techNodeContent
     * @instance
     */
    childCts: prov(() => []),
    /**
     * `INTERNAL`
     * @memberof DBCT_techNodeContent
     * @instance
     */
    childRcs: prov(() => []),


    /* <------------------------------ vanilla ------------------------------ */


    databaseCategory: "lovec-tech-node",
    databaseTag: "default",


  })
  .setMethod({


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


    /**
     * @memberof DBCT_techNodeContent
     * @instance
     * @return {void}
     */
    ex_init: function() {
      comp_ex_init(this);
    }
    .setProp({
      noSuper: true,
    }),


  });
