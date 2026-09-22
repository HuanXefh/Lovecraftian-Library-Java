/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Floor, ENV_baseFloor>} ENVBaseFloor
     */


    const PARENT = require("lovec/temp/env/ENV_baseFloor");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVBaseFloor} blk
     * @return {void}
     */
    function comp_init(blk) {
        let liq = blk.liquidDrop;

        if(blk.setupVanillaProp) {
            if(!Vars.headless && (blk.walkSound === Sounds.none || blk.walkSound === Sounds.unset)) {
                blk.walkSound = DB_env.db["grpParam"]["floor"]["splashMaterial"].includes(blk.delegee.matGrp) ?
                    fetchSound("SOUNDS: stepWater") :
                    fetchSound("se-step-" + blk.matGrp);
                blk.walkSoundVolume = blk.defStepVol;
                blk.walkSoundPitchMin = blk.defStepPitchMin;
                blk.walkSoundPitchMax = blk.defStepPitchMax;
            };

            blk.isLiquid = true;
            if(blk.speedMultiplier.fEqual(1.0)) {
                blk.speedMultiplier = blk.shallow ? blk.shallowDefSpdMtp : blk.deepDefSpdMtp;
                if(liq != null) {
                    blk.speedMultiplier *= LCLerp.applyInterp(
                        1.0, blk.fullViscSpdMtp, liq.viscosity,
                        Interp.linear, 0.5, 1.0,
                    );
                };
            };
            if(blk.drownTime.fEqual(0.0)) {
                blk.drownTime = blk.shallow ? 0.0 : blk.defDrownTime;
            };
            if(blk.status !== StatusEffects.none) {
                blk.statusDuration = blk.defStaDur * (blk.shallow ? 1.0 : blk.staDurDeepMtp);
            };
            blk.supportsOverlay = true;

            if(blk.cacheLayer === CacheLayer.normal) {
                blk.cacheLayer = DB_env.db["grpParam"]["floor"]["cacheLayer"].read(blk.delegee.matGrp, CacheLayer.water);
            };
            if(blk.albedo.fEqual(0.0)) {
                blk.albedo = blk.defAlbedo;
            };
            if(blk.walkEffect === Fx.none) {
                blk.walkEffect = blk.defStepEff;
            };

            if(liq != null && blk.liquidMultiplier.fEqual(1.0)) {
                blk.liquidMultiplier = blk.shallow ? blk.shallowDefLiqMtp : blk.deepDefLiqMtp;
            };
        };
        DB_env.db["grpParam"]["floor"]["extraSetter"].read(blk.delegee.matGrp, Function.air)(blk, blk.setupVanillaProp);

        if(liq != null) {
            MDL_content.rename(
                blk,
                liq.localizedName + (!blk.shallow ? "" : (MDL_text.getSpace() + "(" + MDL_bundle.getTerm("lovec", "shallow") + ")")),
            );
        };
    };


    /**
     * @private
     * @param {ENVBaseFloor} blk
     * @param {Tile} t
     * @return {boolean}
     */
    function comp_updateRender(blk, t) {
        return blk.updateEff !== Fx.none && Mathf.randomSeed(t.pos(), 0.0, 1.0) > blk.updateEffThr;
    };


    /**
     * @private
     * @param {ENVBaseFloor} blk
     * @param {Floor.UpdateRenderState} renderState
     * @return {void}
     */
    function comp_renderUpdate(blk, renderState) {
        if(Mathf.chanceDelta(blk.updateEffP)) {
            blk.updateEff.at(
                renderState.tile.worldx() + Mathf.range(blk.updateEffSpread),
                renderState.tile.worldy() + Mathf.range(blk.updateEffSpread),
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
         * `PARAM`: See {@link ENV_materialFloor}.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         */
        matGrp: "none",
        /**
         * `PARAM`: Effect shown when updating the floor.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         */
        updateEff: Fx.none,
        /**
         * `PARAM`: Chance for update effect.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         */
        updateEffP: 0.02,
        /**
         * `PARAM`: Spread radius of update effect.
         * @memberof ENV_liquidMaterialFloor
         * @instance
         */
        updateEffSpread: 3.0,
        /**
         * `PARAM`: Affects intensity of update effect, larger value leads to fewer tiles being able to create the effect.
         * @memberof ENV_liquidMaterialFloor
         * @instance
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
