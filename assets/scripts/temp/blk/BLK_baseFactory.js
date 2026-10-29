/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_baseFactory>} BLKBaseFactory
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_baseFactory>} BBaseFactory
     * @prop {BLKBaseFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseBlock");
    const INTF_BLK_facilityBlock = require("lovec/temp/intf/INTF_BLK_facilityBlock");
    const INTF_BLK_terrainHandler = require("lovec/temp/intf/INTF_BLK_terrainHandler");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBaseFactory} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.priority = GLB_var.priority.fac;
        if(blk.delegee.setupVanillaProp) {
            if(blk.liquidOutputDirections != null) {
                blk.drawArrow = blk.liquidOutputDirections.length === 1 && blk.liquidOutputDirections[0] === -1;
            };
        };

        if(blk.delegee.rcMajorIo == null) {
            blk.delegee.rcMajorIo = MDL_content.getMajorIo(blk);
        };
    };


    /**
     * @private
     * @param {BLKBaseFactory} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.craftSe = fetchSound(blk.delegee.craftSe);
    };


    /**
     * @private
     * @param {BLKBaseFactory} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        if(!GLB_var.isMindustryX) {
            blk.addBar("lovec-prog", b => new Bar(
                prov(() => Core.bundle.format("bar.lovec-bar-prog-amt", b.progress.perc(0))),
                prov(() => GLB_color.ammo),
                () => Mathf.clamp(b.progress, 0.0, 1.0),
            ));
        };
    };


    /**
     * @private
     * @param {BBaseFactory} b
     * @return {void}
     */
    function comp_created(b) {
        MDL_event.onDelayRun(0.0, () => {
            if(isNaN(b.warmup)) {
                b.warmup = 0.0;
            };
            if(isNaN(b.progress)) {
                b.progress = 0.0;
            };
        });
    };


    /**
     * @private
     * @param {BBaseFactory} b
     * @return {void}
     */
    function comp_craft(b) {
        MDL_sound.playAt(b.x, b.y, b.block.delegee.craftSe, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);
    };


    /**
     * @private
     * @param {BBaseFactory} b
     * @param {Building} b_f
     * @param {Item} item
     * @return {boolean}
     */
    function comp_acceptItem(b, b_f, item) {
        return !b.block.rotate || b.block.delegee.inputDirs.length === 0
            || b.block.delegee.inputDirs.some(offRot => b.relativeTo(b_f) === Mathf.mod(b.rotation + offRot, 4));
    };


    /**
     * @private
     * @param {BBaseFactory} b
     * @param {Building} b_f
     * @param {Liquid} liq
     * @return {boolean}
     */
    function comp_acceptLiquid(b, b_f, liq) {
        return !b.block.rotate || b.block.delegee.fldInputDirs.length === 0
            || MDL_cond.isAuxiliaryFluid(liq)
            || b.block.delegee.fldInputDirs.some(offRot => b.relativeTo(b_f) === Mathf.mod(b.rotation + offRot, 4));
    };


    /**
     * @private
     * @param {BBaseFactory} b
     * @param {Building} b_t
     * @param {Item} item
     * @return {boolean}
     */
    function comp_canDump(b, b_t, item) {
        return !b.block.rotate || b.block.delegee.outputDirs.length === 0
            || b.block.delegee.outputDirs.some(offRot => b.relativeTo(b_t) === Mathf.mod(b.rotation + offRot, 4));
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Parent for all factories.
         * This template also serves as the Lovec version of {@link GenericCrafter}.
         * @class BLK_baseFactory
         * @extends BLK_baseBlock
         * @extends INTF_BLK_facilityBlock
         * @extends INTF_BLK_terrainHandler
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseFactory")
        .implement(INTF_BLK_facilityBlock[0])
        .implement(INTF_BLK_terrainHandler[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Relative directions of item input sides.
             * @memberof BLK_baseFactory
             * @instance
             * @type {TDynamic<Array<number>>}
             */
            inputDirs: tprov(() => []),
            /**
             * `PARAM`: Relative directions of fluid input sides (not abstract fluid).
             * @memberof BLK_baseFactory
             * @instance
             * @type {TDynamic<Array<number>>}
             */
            fldInputDirs: tprov(() => []),
            /**
             * `PARAM`: Relative directions of item output sides.
             * @memberof BLK_baseFactory
             * @instance
             * @type {TDynamic<Array<number>>}
             */
            outputDirs: tprov(() => []),
            /**
             * `PARAM`: Major output for this recipe. If null, this will be automatically set.
             * @memberof BLK_baseFactory
             * @instance
             * @type {UnlockableContent|null}
             */
            rcMajorIo: null,
            /**
             * `PARAM`: Sound played when this building crafts.
             * @memberof BLK_baseFactory
             * @instance
             * @type {SoundGn}
             */
            craftSe: Sounds.unset,


        })
        .setParamAlias([
            /**
             * `ALIAS`: `craftEffect`.
             * @memberof BLK_baseFactory
             * @instance
             * @name craftEff
             * @type {Effect}
             */
            "craftEff", "craftEffect", Fx.none,
            /**
             * `ALIAS`: `updateEffect`.
             * @memberof BLK_baseFactory
             * @instance
             * @name updateEff
             * @type {Effect}
             */
            "updateEff", "updateEffect", Fx.none,
            /**
             * `ALIAS`: `updateEffectChance`.
             * @memberof BLK_baseFactory
             * @instance
             * @name updateEffP
             * @type {number}
             */
            "updateEffP", "updateEffectChance", 0.02,
        ])
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            setBars: function() {
                comp_setBars(this);
            },


        }),


        /**
         * @class B_baseFactory
         * @extends B_baseBlock
         * @extends INTF_B_facilityBlock
         * @extends INTF_B_terrainHandler
         */
        newClass()
        .extendClass(PARENT[1], "B_baseFactory")
        .implement(INTF_BLK_facilityBlock[1])
        .implement(INTF_BLK_terrainHandler[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_baseFactory
             * @instance
             * @type {UnlockableContent|null|TmpStateTag}
             */
            blk$rcMajorIo: TmpStateTag.needReplace,


        })
        .setMethod({


            created: function() {
                comp_created(this);
            },


            craft: function() {
                comp_craft(this);
            },


            acceptItem: function(b_f, item) {
                return comp_acceptItem(this, b_f, item);
            }
            .setProp({
                boolMode: "and",
            }),


            acceptLiquid: function(b_f, liq) {
                return comp_acceptLiquid(this, b_f, liq);
            }
            .setProp({
                boolMode: "and",
            }),


            canDump: function(b_t, item) {
                return comp_canDump(this, b_t, item);
            }
            .setProp({
                boolMode: "and",
            }),


            draw: function() {
                this.self.ex_drawRcIcon();
            },


            /**
             * `REALIZED`
             * @override
             * @memberof B_baseFactory
             * @instance
             * @func
             * @return {TextureRegion|null}
             */
            ex_getRcIcon: function() {
                return this.delegee.blk$rcMajorIo == null ?
                    null :
                    this.delegee.blk$rcMajorIo.uiIcon;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
