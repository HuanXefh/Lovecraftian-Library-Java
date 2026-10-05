/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Floor, ENV_liquidMaterialFloor>} ENVLiquidMaterialFloor
     */


    const PARENT = require("lovec/temp/env/ENV_baseFloor");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVLiquidMaterialFloor} blk
     * @return {void}
     */
    function comp_init(blk) {
        let liq = blk.liquidDrop;

        if(blk.delegee.setupVanillaProp) {
            if(!Vars.headless && (blk.walkSound === Sounds.none || blk.walkSound === Sounds.unset)) {
                blk.walkSound = DB_env.db["grpParam"]["floor"]["splashMaterial"].includes(blk.delegee.matGrp) ?
                    fetchSound("SOUNDS: stepWater") :
                    fetchSound("se-step-" + blk.delegee.matGrp);
                blk.walkSoundVolume = blk.delegee.defStepVol;
                blk.walkSoundPitchMin = blk.delegee.defStepPitchMin;
                blk.walkSoundPitchMax = blk.delegee.defStepPitchMax;
            };

            blk.isLiquid = true;
            if(blk.speedMultiplier.fEqual(1.0)) {
                blk.speedMultiplier = blk.shallow ? blk.delegee.shallowDefSpdMtp : blk.delegee.deepDefSpdMtp;
                if(liq != null) {
                    blk.speedMultiplier *= LCLerp.applyInterp(
                        1.0, blk.delegee.fullViscSpdMtp, liq.viscosity,
                        Interp.linear, 0.5, 1.0,
                    );
                };
            };
            if(blk.drownTime.fEqual(0.0)) {
                blk.drownTime = blk.shallow ? 0.0 : blk.delegee.defDrownTime;
            };
            if(blk.status !== StatusEffects.none) {
                blk.statusDuration = blk.delegee.defStaDur * (blk.shallow ? 1.0 : blk.delegee.staDurDeepMtp);
            };
            blk.supportsOverlay = true;

            if(blk.cacheLayer === CacheLayer.normal) {
                blk.cacheLayer = DB_env.db["grpParam"]["floor"]["cacheLayer"].read(blk.delegee.matGrp, CacheLayer.water);
            };
            if(blk.albedo.fEqual(0.0)) {
                blk.albedo = blk.delegee.defAlbedo;
            };
            if(blk.walkEffect === Fx.none) {
                blk.walkEffect = blk.delegee.defStepEff;
            };

            if(liq != null && blk.liquidMultiplier.fEqual(1.0)) {
                blk.liquidMultiplier = blk.shallow ? blk.delegee.shallowDefLiqMtp : blk.delegee.deepDefLiqMtp;
            };
        };
        // noinspection JSValidateTypes
        DB_env.db["grpParam"]["floor"]["extraSetter"].read(blk.delegee.matGrp, Function.air)(blk, blk.delegee.setupVanillaProp);

        if(liq != null) {
            MDL_content.rename(
                blk,
                liq.localizedName + (!blk.shallow ? "" : (MDL_text.getSpace() + "(" + MDL_bundle.getTerm("lovec", "shallow") + ")")),
            );
        };
    };


    /**
     * @private
     * @param {ENVLiquidMaterialFloor} blk
     * @param {Tile} t
     * @return {boolean}
     */
    function comp_updateRender(blk, t) {
        return blk.delegee.updateEff !== Fx.none && Mathf.randomSeed(t.pos(), 0.0, 1.0) > blk.delegee.updateEffThr;
    };


    /**
     * @private
     * @param {ENVLiquidMaterialFloor} blk
     * @param {Floor.UpdateRenderState} renderState
     * @return {void}
     */
    function comp_renderUpdate(blk, renderState) {
        if(Mathf.chanceDelta(blk.delegee.updateEffP)) {
            blk.delegee.updateEff.at(
                renderState.tile.worldx() + Mathf.range(blk.delegee.updateEffSpread),
                renderState.tile.worldy() + Mathf.range(blk.delegee.updateEffSpread),
            );
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Similar to {@link ENV_materialFloor} but for liquid floors.
     * `blk.shallow` is used to set up some parameters.
     * <br> Block name will be generated from `blk.liquidDrop` if not set in bundle.
     * <br> `NAMEGEN`
     * @class ENV_liquidMaterialFloor
     * @extends ENV_baseFloor
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_liquidMaterialFloor")
    .initTemplate()
    .setParent(Floor)
    .setTags("env-mat-flr")
    .setParam({


        /**
         * `PARAM`: See {@link ENV_materialFloor#matGrp}.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {string}
         */
        matGrp: "none",
        /**
         * `PARAM`: Effect shown when updating the floor.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {Effect}
         */
        updateEff: Fx.none,
        /**
         * `PARAM`: Chance for update effect.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        updateEffP: 0.02,
        /**
         * `PARAM`: Spread radius of update effect.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        updateEffSpread: 3.0,
        /**
         * `PARAM`: Affects intensity of update effect, larger value leads to fewer tiles being able to create the effect.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        updateEffThr: 0.4,


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`: Default speed multiplier for shallow liquid floor.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        shallowDefSpdMtp: 0.85,
        /**
         * `INTERNAL`: Default speed multiplier for deep liquid floor.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        deepDefSpdMtp: 0.5,
        /**
         * `INTERNAL`: Speed multiplier at 100% viscosity of liquid drop.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        fullViscSpdMtp: 0.2,
        /**
         * `INTERNAL`: Default drown time.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        defDrownTime: 200.0,
        /**
         * `INTERNAL`: See {@link ENV_materialFloor#defStaDur}.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        defStaDur: 40.0,
        /**
         * `INTERNAL`: Extra multipler on status duration for deep liquid floor.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        staDurDeepMtp: 2.0,
        /**
         * `INTERNAL`: Default liquid multiplier for shallow liquid floor.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        shallowDefLiqMtp: 1.0,
        /**
         * `INTERNAL`: Default liquid multiplier for deep liquid floor.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        deepDefLiqMtp: 1.5,
        /**
         * `INTERNAL`: Default albedo.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        defAlbedo: 0.9,
        /**
         * `INTERNAL`: Default walk effect.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {Effect}
         */
        defStepEff: Fx.ripple,
        /**
         * `INTERNAL`: See {@link ENV_materialFloor#defStepVol}.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        defStepVol: 0.25,
        /**
         * `INTERNAL`: See {@link ENV_materialFloor#defStepPitchMin}.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        defStepPitchMin: 0.95,
        /**
         * `INTERNAL`: See {@link ENV_materialFloor#defStepPitchMax}.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         * @type {number}
         */
        defStepPitchMax: 1.05,


        /* <------------------------------ vanilla ------------------------------> */


        shallow: false,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        updateRender: function(t) {
            return comp_updateRender(this, t);
        }
        .setProp({
            noSuper: true,
        }),


        renderUpdate: function(renderState) {
            comp_renderUpdate(this, renderState);
        }
        .setProp({
            noSuper: true,
        }),


    });
