/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/sta/DBCT_databaseContent");


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


  /**
   * Used to play a dialog flow in database.
   * This content can only be unlocked by playing the dialog flow in campaign, it's meaningless to set objectives for it.
   * <br> <NAMEGEN>
   * @class DBCT_dialFlowContent
   * @extends DBCT_databaseContent
   */
  module.exports = newClass().extendClass(PARENT, "DBCT_dialFlowContent").initClass()
  .setParent(StatusEffect)
  .setTags()
  .setParam({


    /**
     * <PARAM>: Name of the dialog flow used, see {@link newDialogFlow}.
     * <br> <BUNDLE-name>: "dial.<nmDialFlow>".
     * @memberof DBCT_dialFlowContent
     * @instance
     */
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
