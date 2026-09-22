/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<StatusEffect, DBCT_dialFlowContent>} DBCTDialFlowContent
     */


    const PARENT = require("lovec/temp/sta/DBCT_databaseContent");


    /* <---------- component ----------> */


    /**
     * @private
     * @param {DBCTDialFlowContent} sta
     * @return {void}
     */
    function comp_setStats(sta) {
        sta.stats.add(fetchStat("lovec", "spec-dialflow"), newStatValue(tb => {
            tb.row();
            MDL_table.btnSmall(tb, VARGEN.icons.play, () => {
                !sta.ex_checkDbctUnlocked() ?
                    MDL_ui.showFadeInfo("lovec", "info-locked") :
                    MDL_ui.createFlow(sta.nameDialFlow);
            }).left().padLeft(28.0).tooltip(MDL_bundle.getTerm("lovec", "dialog-flow-play"), true);
        }));
    };


    /**
     * @private
     * @param {DBCTDialFlowContent} sta
     * @return {void}
     */
    function comp_ex_init(sta) {
        if(sta.nameDialFlow == null) throw new LCError.NullArgumentError(sta.name + ".nameDialFlow");

        sta.databaseCategory = "lovec-information";
        if(!Vars.headless) {
            MDL_content.rename(
                sta,
                Core.bundle.get("dial." + sta.nameDialFlow),
            );
        };
        MDL_event.onLoad(() => {
            if(!Vars.headless && !sta.uiIcon.found()) {
                sta.fullIcon = sta.uiIcon = Core.atlas.find("lovec-icon-dialog-flow");
            };
        });
        UTIL_dialogFlow.getNameCtMap().put(sta.nameDialFlow, sta);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Used to play a dialog flow in database.
     * This content is meant to be only unlockable by playing the dialog flow in campaign.
     * <br> `NAMEGEN`
     * @class DBCT_dialFlowContent
     * @extends DBCT_databaseContent
     */
    module.exports = newClass()
    .extendClass(PARENT, "DBCT_dialFlowContent")
    .initTemplate()
    .setParent(StatusEffect)
    .setTags()
    .setParam({


        /**
         * `PARAM`: Name of the dialog flow used, see {@link newDialogFlow}.
         * <br> <BUNDLE - name>: `dial.<nameDialFlow>`.
         * @memberof DBCT_dialFlowContent
         * @instance
         * @type {BundlePiece}
         */
        nameDialFlow: null,


    })
    .setMethod({


        setStats: function() {
          comp_setStats(this);
        },


        /**
         * @inheritdoc
         */
        ex_init: function() {
            comp_ex_init(this);
        }
        .setProp({
            noSuper: true,
        }),


    });
