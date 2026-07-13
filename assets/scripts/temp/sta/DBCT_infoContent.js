/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/sta/DBCT_databaseContent");


  /* <---------- component ----------> */


  function comp_setStats(sta) {
    sta.stats.add(fetchStat("lovec", "spec-info"), newStatValue(tb => {
      tb.row();
      MDL_table.__btnSmall(tb, "I", () => {
        !sta.ex_checkDbctUnlocked() ?
          MDL_ui.show_fadeInfo("lovec", "info-locked") :
          fetchDialog("infoContent").ex_show(sta.minfo.mod.name, sta.nameInfo);
      })
      .left()
      .padLeft(28.0)
      .tooltip(MDL_bundle._term("lovec", "display"), true);
    }));
  };


  function comp_ex_init(sta) {
    if(sta.nameInfo == null) ERROR_HANDLER.throw("nullArgument", "nameInfo");

    sta.databaseCategory = "lovec-information";

    MDL_content.rename(
      sta,
      MDL_bundle._info(sta.minfo.mod.name, "content-" + sta.nameInfo),
    );

    MDL_event._c_onLoad(() => {
      if(!Vars.headless && !sta.uiIcon.found()) {
        sta.fullIcon = sta.uiIcon = Core.atlas.find("lovec-icon-info-panel");
      };
    });
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Used to display text information in database.
   * The text can be viewed only when this content is unlocked.
   * <br> <NAMEGEN>
   * @class DBCT_infoContent
   * @extends DBCT_databaseContent
   */
  module.exports = newClass().extendClass(PARENT, "DBCT_infoContent").initClass()
  .setParent(StatusEffect)
  .setTags()
  .setParam({


    /**
     * <PARAM>: Name for information, don't include mod name here. The title will be used as content name.
     * <br> <BUNDLE-title>: "info.<nameMod>-info-content-<nameInfo>.name".
     * <br> <BUNDLE-text>: "info.<nameMod>-info-content-<nameInfo>.description".
     * @memberof DBCT_infoContent
     * @instance
     */
    nameInfo: null,


  })
  .setMethod({


    setStats: function() {
      comp_setStats(this);
    },


    /**
     * @memberof DBCT_infoContent
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
