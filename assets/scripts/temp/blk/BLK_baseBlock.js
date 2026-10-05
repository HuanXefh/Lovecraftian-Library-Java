/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseBlock>} BLKBaseBlock
     */


    /**
     * @typedef {TemplateInstance<Building.ArmoredConveyorBuild, B_baseBlock>} BBaseBlock
     * @prop {BLKBaseBlock} block
     */


    const PARENT = CLS_contentTemplate;
    const INTF_BLK_coreEnergyConsumer = require("lovec/temp/intf/INTF_BLK_coreEnergyConsumer");
    const INTF_BLK_pollutionHandler = require("lovec/temp/intf/INTF_BLK_pollutionHandler");
    const INTF_BLK_buildingRecacheHandler = require("lovec/temp/intf/INTF_BLK_buildingRecacheHandler");


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @param {Table} tb
     * @param {Array<ItemStack>|Array<LiquidStack>} rsStacks
     * @param {number} craftTime
     * @return {void}
     */
    function buildIo(tb, rsStacks, craftTime) {
        rsStacks.forEachFast(rsStack => {
            tb.row();
            tb.add(
                rsStack instanceof ItemStack ?
                    StatValues.displayItem(rsStack.item, rsStack.amount, craftTime, true) :
                    StatValues.displayLiquid(rsStack.liquid, rsStack.amount * 60.0 / craftTime, true)
            )
            .left()
            .marginLeft(24.0);
        });
    };


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBaseBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.ex_isSingleSized() && blk.size > 1) throw new Error("Block size should be 1: " + blk);

        if(blk.delegee.isWaterborne) {
            blk.floating = true;
        };

        blk.delegee.noLoot = blk.delegee.noLoot || DB_block.db["group"]["noLoot"].includes(blk.name);
        blk.delegee.noReac = blk.delegee.noReac || blk instanceof CoreBlock || DB_block.db["group"]["noReac"].includes(blk.name);
        blk.delegee.canShortCircuit = blk.delegee.canShortCircuit || DB_block.db["group"]["shortCircuit"].includes(blk.name);

        if(blk.delegee.useConfigStr) {
            Core.app.post(() => {
                blk.config(JAVA.string, (b, str) => {
                    b.self.ex_handleConfigStr(str);
                });
            });
        };

        if(blk.delegee.payBuiltOnly) {
            blk.rebuildable = false;
            blk.buildVisibility = BuildVisibility.sandboxOnly;
            blk.delegee.hiddenNonPlaceable = true;
        };

        // Don't try putting these into `blk.load`, which spawns mysterious bugs
        if(!Vars.headless) {
            MDL_event.onLoad(() => {
                if(!String.isEmpty(blk.fullOverride)) {
                    blk.fullIcon = blk.uiIcon = Core.atlas.find(blk.fullOverride);
                } else if(Core.atlas.has(blk.name + "-full")) {
                    blk.fullIcon = blk.uiIcon = Core.atlas.find(blk.name + "-full");
                } else if(Core.atlas.has(blk.name + "-icon")) {
                    blk.fullIcon = blk.uiIcon = Core.atlas.find(blk.name + "-icon");
                } else {
                    blk.fullIcon = blk.uiIcon = Core.atlas.find(blk.name);
                };
                if(Core.atlas.has(blk.name + "-ui")) {
                    blk.uiIcon = Core.atlas.find(blk.name + "-ui");
                };
            });
        };
    };


    /**
     * @private
     * @param {BLKBaseBlock} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(blk.delegee.canShortCircuit) {
            stats.add(fetchStat("lovec", "blk-shortcircuit"), true);
        };

        if(DB_block.db["map"]["facFami"].colIncludes(blk.name, 2, 0)) {
            stats.add(fetchStat("lovec", "spec-facfami"), newStatValue(tb => {
                tb.row();
                MDL_table.setFacFami(tb, blk);
            }));
        };

        MDL_pollution.setPolStats(blk, stats);

        // Vanilla stat for I/O looks ass in Lovec, to be honest
        if(blk instanceof GenericCrafter) {
            let
                consItems = blk.consumers.find(blkCons => blkCons instanceof ConsumeItems),
                consLiq = blk.consumers.find(blkCons => blkCons instanceof ConsumeLiquid),
                consLiqs = blk.consumers.find(blkCons => blkCons instanceof ConsumeLiquids);
            if(consItems != null || consLiq != null || consLiqs != null) {
                stats.remove(Stat.input);
                if(consItems != null) {
                    stats.add(Stat.input, newStatValue(tb => {
                        buildIo(tb, consItems.items, blk.craftTime);
                    }));
                };
                if(consLiq != null) {
                    stats.add(Stat.input, newStatValue(tb => {
                        buildIo(tb, [new LiquidStack(consLiq.liquid, consLiq.amount)], 1.0);
                    }));
                };
                if(consLiqs != null) {
                    stats.add(Stat.input, newStatValue(tb => {
                        buildIo(tb, consLiqs.liquids, 1.0);
                    }));
                };
            };
            if(blk.outputItems != null || blk.outputLiquids != null) {
                stats.remove(Stat.output);
                if(blk.outputItems != null) {
                    stats.add(Stat.output, newStatValue(tb => {
                        buildIo(tb, blk.outputItems, blk.craftTime);
                    }));
                };
                if(blk.outputLiquids != null) {
                    stats.add(Stat.output, newStatValue(tb => {
                        buildIo(tb, blk.outputLiquids, 1.0);
                    }));
                };
            };
        };
    };


    /**
     * @private
     * @param {BLKBaseBlock} blk
     * @return {Array<TextureRegion>}
     */
    function comp_icons(blk) {
        return Core.atlas.has(blk.name + "-full") ?
            [Core.atlas.find(blk.name + "-full")] :
            Core.atlas.has(blk.name + "-icon") ?
                [Core.atlas.find(blk.name + "-icon")] :
                blk.super$icons();
    };


    /**
     * @private
     * @param {BLKBaseBlock} blk
     * @param {Tile} t
     * @param {Team} team
     * @param {number} rot
     * @return {boolean}
     */
    function comp_canPlaceOn(blk, t, team, rot) {
        return !(
            t == null
                || (blk.delegee.hiddenNonPlaceable && !blk.isVisible())
                || (blk.delegee.isWaterborne && t.getLinkedTilesAs(blk, Reflect.get(Block, "tempTiles")).find(ot => !ot.floor().isLiquid) != null)
        );
    };


    /**
     * @private
     * @param {BBaseBlock} b
     * @return {void}
     */
    function comp_onRemoved(b) {
        // No pollution elimination through deconstruction
        if(b.liquids != null) {
            let liqPol;
            b.liquids.each((liq, amt) => {
                liqPol = MDL_pollution.getRsPol(liq);
                if(liqPol > 0.0) {
                    MDL_pollution.addLingerPol(liqPol * amt / 150.0);
                };
            });
        };
    };


    /**
     * @private
     * @param {BBaseBlock} b
     * @return {void}
     */
    function comp_onDestroyed(b) {
        // Drop loot when building is destroyed
        if(!b.block.delegee.noLoot && b.items != null) {
            let amt_fi;
            b.items.each((item, amt) => {
                amt_fi = !(b.block instanceof CoreBlock) ?
                    amt :
                    (amt / Math.max(b.team.cores().size, 1));
                if(amt_fi >= 20) {
                    amt_fi = amt_fi.randFreq(0.3);
                    b.items.remove(item, amt_fi);
                    MDL_call.spawnLoots_server(b.x, b.y, item, amt_fi, b.block.size * Vars.tilesize * 0.7);
                };
            });
        };
    };


    /**
     * @private
     * @param {BBaseBlock} b
     * @param {LogicProp} sensor
     * @return {number}
     */
    function comp_sense(b, sensor) {
        let getter = b.block.delegee.logicSensorFMap.get(sensor);
        return getter != null ?
            getter(b) :
            b.super$sense(sensor);
    };


    /**
     * @private
     * @param {BBaseBlock} b
     * @param {LogicProp} sensor
     * @return {Object}
     */
    function comp_senseObject(b, sensor) {
        let getter = b.block.delegee.logicSensorFMap.get(sensor);
        return getter != null ?
            getter(b) :
            b.super$senseObject(sensor);
    };


    /**
     * @private
     * @param {BBaseBlock} b
     * @param {LogicProp} sensor
     * @param {*} param1
     * @param {*} param2
     * @param {*} param3
     * @param {*} param4
     * @return {void}
     */
    function comp_control(b, sensor, param1, param2, param3, param4) {
        let scr = b.block.delegee.logicSensorControlMap.get(sensor);
        if(scr != null) {
            scr(b, param1, param2, param3, param4);
        };
        b.super$control(sensor, param1, param2, param3, param4);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * The root of all man-made blocks.
         * <br> `blk$xxx` in the building template will copy value of `xxx` in the block template after object is built.
         * @class BLK_baseBlock
         * @extends CLS_contentTemplate
         * @extends INTF_BLK_coreEnergyConsumer
         * @extends INTF_BLK_pollutionHandler
         * @extends INTF_BLK_buildingRecacheHandler
         */
        newClass()
        .extendClass(PARENT, "BLK_baseBlock")
        .implement(INTF_BLK_coreEnergyConsumer[0])
        .implement(INTF_BLK_pollutionHandler[0])
        .implement(INTF_BLK_buildingRecacheHandler[0])
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({


            /**
             * `PARAM`: See {@link RS_baseResource#setupVanillaStat}.
             * @memberof BLK_baseBlock
             * @instance
             * @type {boolean}
             */
            setupVanillaStat: true,
            /**
             * `PARAM`: See {@link RS_baseResource#setupVanillaProp}.
             * @memberof BLK_baseBlock
             * @instance
             * @type {boolean}
             */
            setupVanillaProp: true,
            /**
             * `PARAM`: If true, `blk.drawer` will always be used even if the Java class does not support drawer. Can lead to bugs, use with care.
             * @memberof BLK_baseBlock
             * @instance
             * @type {boolean}
             */
            forceUseDrawer: false,
            /**
             * `PARAM`: If true, outline parameters won't be overwritten with DB data. See {@link DB_unit.db.grpParam.outline}.
             * @memberof BLK_baseBlock
             * @instance
             * @type {boolean}
             */
            skipOutlineSetup: false,
            /**
             * `PARAM`: Whether config object string is used for this block. Config object string is a JSON string for dealing with multiple parallel configs.
             * @memberof BLK_baseBlock
             * @instance
             * @type {boolean}
             */
            useConfigStr: false,
            /**
             * `PARAM`: If true, this block can only be placed on liquid floors. I have to do this because `blk.requiresWater` is so hard-coded.
             * @memberof BLK_baseBlock
             * @instance
             * @type {boolean}
             */
            isWaterborne: false,
            /**
             * `PARAM`: If true, this block cannot be built directly and is expected to be produced as payload.
             * @memberof BLK_baseBlock
             * @instance
             */
            payBuiltOnly: false,
            /**
             * `PARAM`: Whether to skip loot spawning when building of this block is destroyed. Recommended to set this in {@link DB_block.db.group.noLoot}.
             * @memberof BLK_baseBlock
             * @instance
             * @type {boolean}
             */
            noLoot: false,
            /**
             * `PARAM`: Whether reactions are ignored in this block. Recommended to set this in {@link DB_block.db.group.noReac}.
             * @memberof BLK_baseBlock
             * @instance
             * @type {boolean}
             */
            noReac: false,
            /**
             * `PARAM`: Whether this block will short-circuit when soaked in puddles of aqueous liquid. Recommended to set this in {@link DB_block.db.group.shortCircuit}.
             * @memberof BLK_baseBlock
             * @instance
             * @type {boolean}
             */
            canShortCircuit: false,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`: Used as fallback if {@link BLK_baseBlock#forceUseDrawer} is true.
             * @memberof BLK_baseBlock
             * @instance
             * @type {TDynamic<DrawBlock>}
             */
            drawer: tprov(() => new DrawDefault()),
            /**
             * `INTERNAL`: If true, this block cannot be placed by player at all when hidden.
             * @memberof BLK_baseBlock
             * @instance
             * @type {boolean}
             */
            hiddenNonPlaceable: false,
            /**
             * `INTERNAL`
             * @memberof BLK_baseBlock
             * @instance
             * @type {TDynamic<F2Array<string, C2Function<Building, Object>>>}
             */
            configKeyCArr: tprov(() => []),
            /**
             * `INTERNAL`
             * @memberof BLK_baseBlock
             * @instance
             * @type {TDynamic<ObjectMap<LogicProp, FFunction<Building, Object>>>}
             */
            logicSensorFMap: tprov(() => new ObjectMap()),
            /**
             * `INTERNAL`
             * @memberof BLK_baseBlock
             * @instance
             * @type {TDynamic<ObjectMap<LogicProp, LogicControlFunction>>}
             */
            logicSensorControlMap: tprov(() => new ObjectMap()),


            /* <------------------------------ vanilla ------------------------------> */


            selectionColumns: 10,
            envRequired: 0,
            envEnabled: Env.any,
            envDisabled: 0,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            icons: function() {
                return comp_icons(this);
            }
            .setProp({
                noSuper: true,
            }),


            canPlaceOn: function(t, team, rot) {
                return comp_canPlaceOn(this, t, team, rot);
            }
            .setProp({
                boolMode: "and",
            }),


            /**
             * If true, the game will throw an error when block size is larger than 1 on INIT.
             * @memberof BLK_baseBlock
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSingleSized: function() {
                return false;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * If true, this block will be treated as gate.
             * Used mostly for accept check.
             * @memberof BLK_baseBlock
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isGateBlk: function() {
                return false;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * If true, this block will be treated as one-side output block.
             * Used mostly for accept check.
             * @memberof BLK_baseBlock
             * @instance
             * @func
             * @return {boolean}
             */
            ex_noSideOutput: function() {
                return false;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * If true, this block will be treated as three side output block.
             * Used mostly for accept check.
             * @memberof BLK_baseBlock
             * @instance
             * @func
             * @return {boolean}
             */
            ex_noAllSideOutput: function() {
                return false;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * If true, this block can be disabled by {@link BLK_directionalSwitch}.
             * Note that some blocks can be disabled even when this returns false.
             * @memberof BLK_baseBlock
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSwitchDisableTarget: function() {
                return false;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * If false, this block cannot be disabled by {@link BLK_directionalSwitch}.
             * @memberof BLK_baseBlock
             * @instance
             * @func
             * @return {boolean}
             */
            ex_canSwitchDisable: function() {
                return true;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Adds a caller function for some config object key.
             * Requires {@link BLK_baseBlock#useConfigStr} to be true.
             * @memberof BLK_baseBlock
             * @instance
             * @func
             * @param {string} key
             * @param {C2Function<Building, Object>} valC - `ARGS`: b, val.
             * @return {void}
             */
            ex_addConfigM: function(key, valC) {
                this.delegee.configKeyCArr.write(key, valC);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * Adds a getter function for some logic sensor.
             * @memberof BLK_baseBlock
             * @instance
             * @func
             * @param {LogicProp} sensor
             * @param {FFunction<Building, Object>} valF
             * @return {void}
             */
            ex_addLogicF: function(sensor, valF) {
                this.delegee.logicSensorFMap.put(sensor, valF);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * Adds a function to implement logic control by some sensor.
             * @memberof BLK_baseBlock
             * @instance
             * @func
             * @param {LogicProp} sensor
             * @param {LogicControlFunction} scr
             * @return {void}
             */
            ex_addLogicControl: function(sensor, scr) {
                this.delegee.logicSensorControlMap.put(sensor, scr);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


        }),


        /**
         * @class B_baseBlock
         * @extends CLS_contentTemplate
         * @extends INTF_B_coreEnergyConsumer
         * @extends INTF_B_pollutionHandler
         * @extends INTF_B_buildingRecacheHandler
         */
        newClass()
        .extendClass(PARENT, "B_baseBlock")
        .implement(INTF_BLK_coreEnergyConsumer[1])
        .implement(INTF_BLK_pollutionHandler[1])
        .implement(INTF_BLK_buildingRecacheHandler[1])
        .initTemplate()
        .setParent(null)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`: Global revision.
             * @memberof B_baseBlock
             * @instance
             * @type {number}
             */
            LCRevi: 5,
            /**
             * `INTERNAL`: Block major update revision.
             * @memberof B_baseBlock
             * @instance
             * @type {number}
             */
            LCReviMajor: 0,
            /**
             * `INTERNAL`: Revision for a specific template.
             * @memberof B_baseBlock
             * @instance
             * @type {number}
             */
            LCReviSub: 0,
            /**
             * `INTERNAL`: For v9 compatibility, where `timers` is removed.
             * @memberof B_baseBlock
             * @instance
             * @type {number}
             */
            dumpTimeCur: 0.0,


        })
        .setMethod({


            onRemoved: function() {
                comp_onRemoved(this);
            },


            onDestroyed: function() {
                comp_onDestroyed(this);
            },


            version: function() {
                return this.super$version() + GLB_var.lovecReviOff + GLB_var.lovecRevi;
            },


            writeAll: function(wr) {
                this.writeBase(wr);
                wr.s(this.self.ex_subRevi());
                wr.s(this.self.ex_majorRevi());
                this.write(wr);
            }
            .setProp({
                noSuper: true,
            }),


            readAll: function(rd, revi) {
                this.readBase(rd);
                this.delegee.LCRevi = revi < GLB_var.lovecReviOff ? 5 : (revi - GLB_var.lovecReviOff - this.super$version());
                if(this.delegee.LCRevi >= 6) {
                    this.delegee.LCReviSub = rd.s();
                };
                if(this.delegee.LCRevi >= 7) {
                    this.delegee.LCReviMajor = rd.s();
                };
                this.read(rd, this.super$version());
            }
            .setProp({
                noSuper: true,
            }),


            sense: function(sensor) {
                return comp_sense(this, sensor);
            }
            .setProp({
                noSuper: true,
                final: true,
            }),


            senseObject: function(sensor) {
                return comp_senseObject(this, sensor);
            }
            .setProp({
                noSuper: true,
                final: true,
            }),


            control: function(sensor, param1, param2, param3, param4) {
                comp_control(this, sensor, param1, param2, param3, param4);
            }
            .setProp({
                noSuper: true,
                final: true,
            }),


            /**
             * A more generic way to handle multiple configs using config object string.
             * Requires {@link BLK_baseBlock#useConfigStr} to be true.
             * @memberof B_baseBlock
             * @instance
             * @func
             * @param {JSONConfigString|string} str
             * @return {void}
             */
            ex_handleConfigStr: function(str) {
                if(str.startsWith("CONFIG: ")) {
                    Object.eachPair(unpackConfig(str), (key, val) => {
                        this.block.delegee.configKeyCArr.read(key, Function.air)(this, val);
                    });
                } else {
                    this.self.ex_handleConfigStrDef(str);
                };
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Fallback when the given string is not a config object string in {@link B_baseBlock#ex_handleConfigStr}.
             * <br> `LATER`
             * @memberof B_baseBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_handleConfigStrDef: function(str) {

            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Draws recipe icon when it's enabled.
             * Should be applied in a specific template.
             * @memberof B_baseBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_drawRcIcon: function() {
                if(GLB_param.SHOULD_DRAW_RECIPE_ICON) {
                    let icon = this.self.ex_getRcIcon();
                    if(icon != null) {
                        let regScl = Math.min(this.block.size * 0.5, 2.0) * (Mathf.absin(12.0, 0.3) + 1.0);
                        Draw.color(0, 0, 0, 0.75);
                        Draw.rect("circle-shadow", this.x, this.y, 13.5 * regScl, 13.5 * regScl);
                        Draw.color();
                        LCDraw.regionIcon(
                            this.x + Vars.tilesize * this.block.size * 0.5,
                            this.y - Vars.tilesize * this.block.size * 0.5,
                            icon,
                            this.block.size,
                            regScl,
                            GLB_var.layer.rcIcon,
                        );
                    };
                };
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Texture region that should be drawn in {@link B_baseBlock#ex_drawRcIcon}.
             * <br> `LATER`
             * @memberof B_baseBlock
             * @instance
             * @func
             * @return {TextureRegion|null}
             */
            ex_getRcIcon: function() {
                return null;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Revision used for all block content templates.
             * @memberof B_baseBlock
             * @instance
             * @func
             * @return {number}
             */
            ex_majorRevi: function() {
                return 0;
            }
            .setProp({
                noSuper: true,
                final: true,
            }),


            /**
             * Revision used for this content template.
             * <br> `LATER`
             * @memberof B_baseBlock
             * @instance
             * @func
             * @return {number}
             */
            ex_subRevi: function() {
                return 0;
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];


    /**
     * @override
     * @memberof BLK_baseBlock
     * @param {BLKBaseBlock} blk
     * @return {void}
     */
    module.exports[0].initContent = function(blk) {
        this.super("initContent", blk);

        // Parse JSON
        let jval = LCContentParser.getJval(blk);
        if(jval != null) {
            LCContentParser.parseResearch(blk, jval);
            LCContentParser.parseBlock(blk, jval);
            LCContentParser.setupFields(blk, jval);
        };

        // Setup outline
        if(!tryJsProp(blk, "skipOutlineSetup", false)) {
            FRAG_faci.setupOutline(blk);
        };
    };
