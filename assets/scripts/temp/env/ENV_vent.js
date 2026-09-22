/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<SteamVent, ENV_vent>} ENVVent
     */


    const PARENT = require("lovec/temp/env/ENV_materialFloor");
    const INTF_ENV_dynamicSizeVent = require("lovec/temp/intf/INTF_ENV_dynamicSizeVent");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {ENVVent} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.setupVanillaProp) {
            if(blk.itemDrop == null) {
                blk.itemDrop = blk.parent.itemDrop;
                blk.playerUnmineable = blk.parent.playerUnmineable;
            };
        };

        switch(blk.ventRs) {
            case "none" :
                // Do nothing
                break;

            case "fire" :
                blk.effect = new MultiEffect(EFF.smogFireExplo, Fx.fire);
                blk.effectSpacing = 4.0;
                MDL_content.rename(
                    blk,
                    MDL_bundle.getTerm("lovec", "fire") + MDL_text.getSpace() + MDL_bundle.getTerm("lovec", "vent") + MDL_text.getSpace() + "(" + blk.parent.localizedName + ")",
                );
                break;

            default :
                blk.rsDrop = MDL_content.getCt(blk.ventRs, ContentGetModes.RS);
                if(blk.rsDrop != null) {
                    blk.effect = TP_effect.smogVent({color: blk.rsDrop.color});
                    blk.effectSpacing = 20.0;
                    MDL_content.rename(
                        blk,
                        blk.rsDrop.localizedName + MDL_text.getSpace() + MDL_bundle.getTerm("lovec", "vent") + MDL_text.getSpace() + "(" + blk.parent.localizedName + ")",
                    );
                };
        };
    };


    /**
     * @private
     * @param {ENVVent} blk
     * @param {Tile} t
     * @param {boolean} isBlocked
     * @return {void}
     */
    function comp_onVentUpdate(blk, t, isBlocked) {
        if(blk.ventRs === "fire" && Mathf.chanceDelta(0.003)) {
            Damage.createIncend(t.worldx() + blk.offDraw, t.worldy() + blk.offDraw, blk.ventSize * Vars.tilesize * 0.65, 1);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Steam vents with varied size, will load parameters from `blk.parent`.
     * Vents should always be loaded after the parent floors!
     * <br> Special values for {@link ENV_vent#ventRs}:
     * <br> `"none"` - This vent is only for decoration.
     * <br> `"fire"` - Turns this vent into a fire vent.
     * <br> `NAMEGEN`
     * @class ENV_vent
     * @extends ENV_materialFloor
     * @extends INTF_ENV_dynamicSizeVent
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_vent")
    .implement(INTF_ENV_dynamicSizeVent)
    .initTemplate()
    .setParent(SteamVent)
    .setTags()
    .setParam({


        /**
         * `PARAM`: Resource (?) produced from the vent, usually a gas. Can be special values.
         * @memberof ENV_vent
         * @instance
         * @type {string}
         */
        ventRs: "none",


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof ENV_vent
         * @instance
         * @type {Resource|null}
         */
        rsDrop: null,


        /* <------------------------------ vanilla ------------------------------ */


        parent: null,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        /**
         * `REALIZED`
         * @override
         * @memberof ENV_vent
         * @instance
         * @func
         * @param {Tile} t
         * @param {boolean} isBlocked
         * @return {void}
         */
        ex_onVentUpdate: function(t, isBlocked) {
            comp_onVentUpdate(this, t, isBlocked);
        }
        .setProp({
            noSuper: true,
        }),


        /**
         * `REALIZED`
         * @memberof ENV_vent
         * @instance
         * @func
         * @return {Liquid|null}
         */
        ex_getRsDrop: function() {
            return this.rsDrop;
        }
        .setProp({
            noSuper: true,
        }),


    });
