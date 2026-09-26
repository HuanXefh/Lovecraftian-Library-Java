/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<StatusEffect, STA_fadeStatus>} STAFadeStatus
     */


    const PARENT = require("lovec/temp/sta/STA_baseStatus");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {STAFadeStatus} sta
     * @return {void}
     */
    function comp_load(sta) {
        sta.fadeReg = fetchRegionOrNull(sta, "-fade");
    };


    /**
     * @private
     * @param {STAFadeStatus} sta
     * @param {Unit} unit
     * @return {void}
     */
    function comp_draw(sta, unit) {
        let isAfter = false;
        if(!VARGEN.fadeStas.some(osta => {
            if(osta === sta) isAfter = true;
            return !isAfter && sta.fadeReg != null && unit.hasEffect(osta) && osta !== sta;
        })) {
            LCDrawf.fade(unit.x, unit.y, sta.fadeReg, 0.5, 0.0, LCProp.getHitSize(unit) * 0.1, sta.fadeColor, 0.5, Layer.effect + VAR.layer.offDrawOver);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * A status effect with fading sprite.
     * @class STA_fadeStatus
     * @extends STA_baseStatus
     */
    module.exports = newClass()
    .extendClass(PARENT, "STA_fadeStatus")
    .initTemplate()
    .setParent(StatusEffect)
    .setTags("sta-fade")
    .setParam({


        /**
         * `PARAM`: Color used for the fading region.
         * @memberof STA_fadeStatus
         * @instance
         * @type {Color}
         */
        fadeColor: Color.white,


        /* <------------------------------ region ------------------------------> */


        /**
         * `INTERNAL`
         * @memberof STA_fadeStatus
         * @instance
         * @type {TextureRegion}
         */
        fadeReg: null,


    })
    .setMethod({


        load: function() {
            comp_load(this);
        },


        draw: function(unit) {
            comp_draw(this, unit);
        },


    });
