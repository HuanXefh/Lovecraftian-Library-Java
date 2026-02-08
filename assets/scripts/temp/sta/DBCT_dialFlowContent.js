/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * A content used to replay dialog flow after it's unlocked.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/sta/DBCT_databaseContent");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  /* <---------- component ----------> */


  function comp_init(sta) {
    if(sta.nmDialFlow == null) ERROR_HANDLER.throw("nullArgument", "nmDialFlow");

    sta.databaseCategory = "lovec-information";

    if(!Vars.headless) {
      MDL_content.rename(
        sta,
        Core.bundle.get("dial." + sta.nmDialFlow),
      );
    };

    MDL_event._c_onLoad(() => {
      if(!Vars.headless && !sta.uiIcon.found()) {
        sta.fullIcon = sta.uiIcon = Core.atlas.find("lovec-icon-dialog-flow");
      };
    });

    VARGEN.dialFlowNmCtMap.put(sta.nmDialFlow, sta);
    lockTechNode(sta);
  };


  function comp_setStats(sta) {
    sta.stats.add(fetchStat("lovec", "spec-dialflow"), newStatValue(tb => {
      tb.row();
      MDL_table.__btnSmall(tb, VARGEN.icons.play, () => {
        !sta.ex_checkDbctUnlocked() ?
          MDL_ui.show_fadeInfo("lovec", "info-locked") :
          MDL_ui._d_flow(sta.nmDialFlow);
      }).left().padLeft(28.0).tooltip(MDL_bundle._term("lovec", "dialog-flow-play"), true);
    }));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(StatusEffect)
  .setTags()
  .setParam({
    // @PARAM: Name for dialog flow used.
    nmDialFlow: null,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
