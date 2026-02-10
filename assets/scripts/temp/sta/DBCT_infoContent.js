/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * A content used to display information, but not written in the description.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/sta/DBCT_databaseContent");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  /* <---------- component ----------> */


  function comp_init(sta) {
    if(sta.nmInfo == null) ERROR_HANDLER.throw("nullArgument", "nmInfo");

    sta.databaseCategory = "lovec-information";

    MDL_content.rename(
      sta,
      MDL_bundle._info(sta.minfo.mod.name, "content-" + sta.nmInfo),
    );

    MDL_event._c_onLoad(() => {
      if(!Vars.headless && !sta.uiIcon.found()) {
        sta.fullIcon = sta.uiIcon = Core.atlas.find("lovec-icon-info-panel");
      };
    });
  };


  function comp_setStats(sta) {
    sta.stats.add(fetchStat("lovec", "spec-info"), newStatValue(tb => {
      tb.row();
      MDL_table.__btnSmall(tb, "I", () => {
        !sta.ex_checkDbctUnlocked() ?
          MDL_ui.show_fadeInfo("lovec", "info-locked") :
          fetchDialog("infoContent").ex_show(sta.minfo.mod.name, sta.nmInfo);
      }).left().padLeft(28.0).tooltip(MDL_bundle._term("lovec", "display"), true);
    }));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "DBCT_infoContent").initClass()
  .setParent(StatusEffect)
  .setTags()
  .setParam({
    // @PARAM: Name for information used, the info text will be {info.*your mod*-info-content-*nmInfo*.description} in the bundle (.name for the title). Yep don't include mod name here.
    nmInfo: null,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
