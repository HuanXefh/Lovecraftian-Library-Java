/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<StatusEffect, DBCT_infoContent>} DBCTInfoContent
     */


    const PARENT = require("lovec/temp/sta/DBCT_databaseContent");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {DBCTInfoContent} sta
     * @return {void}
     */
    function comp_setStats(sta) {
        sta.stats.add(fetchStat("lovec", "spec-info"), newStatValue(tb => {
            tb.row();
            MDL_table.btnSmall(tb, "I", () => {
                !sta.ex_checkDbctUnlocked() ?
                  MDL_ui.showFadeInfo("lovec", "info-locked") :
                  fetchDialog("infoContent").ex_show(sta.minfo.mod.name, sta.nameInfo);
            })
            .left()
            .padLeft(28.0)
            .tooltip(MDL_bundle.getTerm("lovec", "display"), true);
        }));
    };


    /**
     * @private
     * @param {DBCTInfoContent} sta
     * @return {void}
     */
    function comp_ex_init(sta) {
        if(sta.nameInfo == null) throw new LCError.NullArgumentError(sta.name + ".nameInfo");

        sta.databaseCategory = "lovec-information";
        MDL_content.rename(
            sta,
            MDL_bundle.getInfo(sta.minfo.mod.name, "content-" + sta.nameInfo),
        );
        MDL_event.onLoad(() => {
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
     * The text can be viewed only when this content is unlocked (even in sandbox).
     * <br> `NAMEGEN`
     * @class DBCT_infoContent
     * @extends DBCT_databaseContent
     */
    module.exports = newClass()
    .extendClass(PARENT, "DBCT_infoContent")
    .initClass()
    .setParent(StatusEffect)
    .setTags()
    .setParam({


        /**
         * `PARAM`: Name for information, don't include mod name here. The title will be used as content name.
         * <br> `BUNDLE - title`: `info.<nameMod>-info-content-<nameInfo>.name`.
         * <br> `BUNDLE - text`: `info.<nameMod>-info-content-<nameInfo>.description`.
         * @memberof DBCT_infoContent
         * @instance
         * @type {BundlePiece}
         */
        nameInfo: null,


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
