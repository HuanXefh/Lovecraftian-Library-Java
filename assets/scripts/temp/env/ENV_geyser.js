/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Floor, ENV_geyser>} ENVGeyser
     */


    const PARENT = require("lovec/temp/env/ENV_liquidMaterialFloor");


    /* <------------------------------ auxiliary ------------------------------ */


    /**
     * @private
     * @type {number}
     */
    const PARTICLE_LAYER = VAR.layer.effSmog - 0.5;


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {ENVGeyser} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.parent = MDL_content.getCt(blk.parent, ContentGetModes.BLK);
        if(blk.parent == null) throw new LCError.NullArgumentError(blk.name + ".parent");
        if(!(blk.parent instanceof Floor)) throw new TypeError("${1} is not a floor".format(blk.name));

        blk.blendGroup = blk.parent;
        MDL_event.onLoad(() => {
            let color_f = blk.parent.mapColor.cpy().mul(1.5);
            let color_t = blk.parent.mapColor.cpy().mul(2.2);
            color_t.a = 0.0;
            blk.updateEff = new MultiEffect(
                extend(ParticleEffect, {
                    lifetime: 150.0,
                    startDelay: 16.0,
                    layer: PARTICLE_LAYER + 0.0001,
                    particles: 10,
                    useRotation: false,
                    colorFrom: color_f,
                    colorTo: color_t,
                    lightOpacity: 0.0,
                    baseRotation: 90.0,
                    cone: 26.0,
                    length: 40.0,
                    baseLength: 9.0,
                    sizeInterp: Interp.pow3In,
                    sizeFrom: 1.8,
                    sizeTo: 0.2,
                }),
                extend(ParticleEffect, {
                    lifetime: 150.0,
                    startDelay: 14.0,
                    layer: PARTICLE_LAYER + 0.0002,
                    particles: 10,
                    useRotation: false,
                    colorFrom: color_f,
                    colorTo: color_t,
                    lightOpacity: 0.0,
                    baseRotation: 90.0,
                    cone: 25.0,
                    length: 36.0,
                    baseLength: 8.0,
                    sizeInterp: Interp.pow3In,
                    sizeFrom: 1.8,
                    sizeTo: 0.2,
                }),
                extend(ParticleEffect, {
                    lifetime: 150.0,
                    startDelay: 12.0,
                    layer: PARTICLE_LAYER + 0.0003,
                    particles: 9,
                    useRotation: false,
                    colorFrom: color_f,
                    colorTo: color_t,
                    lightOpacity: 0.0,
                    baseRotation: 90.0,
                    cone: 24.0,
                    length: 32.0,
                    baseLength: 7.0,
                    sizeInterp: Interp.pow3In,
                    sizeFrom: 1.8,
                    sizeTo: 0.2,
                }),
                extend(ParticleEffect, {
                    lifetime: 150.0,
                    startDelay: 10.0,
                    layer: PARTICLE_LAYER + 0.0004,
                    particles: 8,
                    useRotation: false,
                    colorFrom: color_f.cpy().mul(1.1),
                    colorTo: color_t.cpy().mul(1.1),
                    lightOpacity: 0.0,
                    baseRotation: 90.0,
                    cone: 23.0,
                    length: 26.0,
                    baseLength: 6.0,
                    sizeInterp: Interp.pow3In,
                    sizeFrom: 1.8,
                    sizeTo: 0.2,
                }),
                extend(ParticleEffect, {
                    lifetime: 150.0,
                    startDelay: 8.0,
                    layer: PARTICLE_LAYER + 0.0005,
                    particles: 8,
                    useRotation: false,
                    colorFrom: color_f.cpy().mul(1.2),
                    colorTo: color_t.cpy().mul(1.2),
                    lightOpacity: 0.0,
                    baseRotation: 90.0,
                    cone: 22.0,
                    length: 22.0,
                    baseLength: 5.0,
                    sizeInterp: Interp.pow3In,
                    sizeFrom: 1.8,
                    sizeTo: 0.2,
                }),
                extend(ParticleEffect, {
                    lifetime: 150.0,
                    startDelay: 6.0,
                    layer: PARTICLE_LAYER + 0.0006,
                    particles: 7,
                    useRotation: false,
                    colorFrom: color_f.cpy().mul(1.3),
                    colorTo: color_t.cpy().mul(1.3),
                    lightOpacity: 0.0,
                    baseRotation: 90.0,
                    cone: 21.0,
                    length: 18.0,
                    baseLength: 4.0,
                    sizeInterp: Interp.pow3In,
                    sizeFrom: 1.8,
                    sizeTo: 0.2,
                }),
                extend(ParticleEffect, {
                    lifetime: 150.0,
                    startDelay: 0.0,
                    layer: PARTICLE_LAYER + 0.0007,
                    particles: 6,
                    useRotation: false,
                    colorFrom: color_f.cpy().mul(1.4),
                    colorTo: color_t.cpy().mul(1.4),
                    lightOpacity: 0.0,
                    baseRotation: 90.0,
                    cone: 20.0,
                    length: 14.0,
                    baseLength: 3.0,
                    sizeInterp: Interp.pow3In,
                    sizeFrom: 1.8,
                    sizeTo: 0.2,
                }),
            );
        });

        MDL_content.rename(
            blk,
            () => MDL_bundle.getTerm("lovec", "geyser") + MDL_text.getSpace() + "(" + blk.parent.localizedName + ")",
        );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Geyser as a special liquid floor.
     * <br> `NAMEGEN`
     * <br> `DEDICATION`: Inspired by Asthosus.
     * @class ENV_geyser
     * @extends ENV_liquidMaterialFloor
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_geyser")
    .initTemplate()
    .setParent(Floor)
    .setTags("env-mat-flr")
    .setParam({


        /**
         * `PARAM`: Parent floor block.
         * @memberof ENV_geyser
         * @instance
         * @type {Floor}
         */
        parent: null,


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`: Will be set later, do not use this.
         * <br> `REALIZED`
         * @override
         * @memberof ENV_geyser
         * @instance
         * @type {Effect}
         */
        updateEff: Fx.none,
        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof ENV_geyser
         * @instance
         * @type {number}
         */
        updateEffP: 0.0035,
        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof ENV_geyser
         * @instance
         * @type {number}
         */
        updateEffSpread: 0.0,
        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof ENV_geyser
         * @instance
         * @type {number}
         */
        updateEffThr: 0.0,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


    });
