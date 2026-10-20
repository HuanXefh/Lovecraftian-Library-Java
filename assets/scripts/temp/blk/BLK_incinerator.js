/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_incinerator>} BLKIncinerator
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_incinerator>} BIncinerator
     * @prop {BLKIncinerator} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemBlock");
    const INTF_BLK_contentMultiSelector = require("lovec/temp/intf/INTF_BLK_contentMultiSelector");
    const INTF_BLK_fluidTypeFilter = require("lovec/temp/intf/INTF_BLK_fluidTypeFilter");


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @type {number}
     */
    const EXPLO_FLAM_THR = 0.5;


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKIncinerator} blk
     * @return {void}
     */
    function comp_init(blk) {
        resetBlockFlag(blk, []);
        blk.group = BlockGroup.transportation;

        blk.outputsLiquid = blk.outputLiquids != null && blk.outputLiquids.length > 0;
    };


    /**
     * @private
     * @param {BLKIncinerator} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.craftSe = fetchSound(blk.delegee.craftSe);
    };


    /**
     * @private
     * @param {BLKIncinerator} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(Stat.productionTime);
        stats.add(Stat.productionTime, blk.craftTime / 60.0, StatUnit.seconds);
    };


    /**
     * @private
     * @param {BLKIncinerator} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        if(!GLB_var.isMindustryX) {
            blk.addBar("lovec-prog", b => new Bar(
                MDL_bundle.getTerm("lovec", "progress"),
                Pal.ammo,
                () => Mathf.clamp(b.progress, 0.0, 1.0),
            ));
        };
    };


    /**
     * @private
     * @param {BIncinerator} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.efficiency < 0.0001) {
            b.progress = 0.0;
        };

        if(GLB_timer.sec) {
            if(b.items != null && !b.delegee.justCrafted) {
                b.delegee.hasItemTarget = false;
                b.items.each((item, amt) => {
                    if(b.delegee.hasItemTarget) return;
                    if(!b.block.consumesItem(item)) {
                        b.delegee.hasItemTarget = true;
                    };
                });
            };

            if(b.liquids != null && !b.delegee.justCrafted) {
                b.delegee.hasLiqTarget = false;
                b.liquids.each((liq, amt) => {
                    if(b.delegee.hasLiqTarget) return;
                    if(!b.block.consumesLiquid(liq) && amt > 1.0) {
                        b.delegee.hasLiqTarget = true;;
                    };
                });
            };

            // Skip a round for consistent incineration
            b.delegee.justCrafted = false;
        };
    };


    /**
     * @private
     * @param {BIncinerator} b
     * @return {void}
     */
    function comp_craft(b) {
        MDL_sound.playAt(b.x, b.y, b.block.delegee.craftSe, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);

        let
            flam = 0.0,
            explo = 0.0,
            pow = 0.0,
            canExplo = b.self.ex_canExploIncinerate();

        if(b.items != null) {
            b.items.each((item, amt) => {
                if(b.block.consumesItem(item)) return;
                if(b.block.outputItems != null && b.block.outputItems.some(itemStack => itemStack.item === item)) return;

                if(canExplo) {
                    flam += (item.flammability < EXPLO_FLAM_THR ? 0.0 : item.flammability) * amt * 3.0;
                    explo += item.explosiveness * amt * 3.0;
                    pow += item.charge * amt * 3.0;
                };
                b.items.set(item, 0);
            });
        };
        if(b.liquids != null) {
            b.liquids.each((liq, amt) => {
                if(b.block.consumesLiquid(liq) || amt < 0.01) return;
                if(b.block.outputLiquids != null && b.block.outputLiquids.some(liqStack => liqStack.liquid === liq)) return;

                if(canExplo) {
                    flam += (liq.flammability < EXPLO_FLAM_THR ? 0.0 : liq.flammability) * amt * 30.0;
                    explo += liq.explosiveness * amt * 30.0;
                };
                b.liquids.set(liq, 0.0);
            });
        };

        if(flam > 0.0 || explo > 0.0 || pow > 0.0) {
            BOX_trigger.incineratorExplosion.fire();
            MDL_sound.playAt(b.x, b.y, "SOUNDS: unitExplode1");
            Damage.dynamicExplosion(b.x, b.y, flam, explo, pow, FRAG_attack.getPresExploRad(b.block.size) / Vars.tilesize, true);
        };

        b.delegee.justCrafted = true;
    };


    /**
     * @private
     * @param {BIncinerator} b
     * @param {Building} b_f
     * @param {Item} item
     * @return {boolean}
     */
    function comp_acceptItem(b, b_f, item) {
        if(b.items == null) return false;
        if(b.block.consumesItem(item) && b.items.get(item) < b.getMaximumAccepted(item)) return true;
        if(!b.block.delegee.itemTargetFilter.get(item)) return false;

        return b.delegee.ctTargets.length === 0 ?
            b.items.total() < b.block.itemCapacity :
            b.delegee.ctTargets.includes(item) && b.items.total() < b.block.itemCapacity;
    };


    /**
     * @private
     * @param {BIncinerator} b
     * @param {Building} b_f
     * @param {Liquid} liq
     * @return {boolean}
     */
    function comp_acceptLiquid(b, b_f, liq) {
        if(b.liquids == null) return false;
        if(b.liquids.get(liq) / b.block.liquidCapacity >= 0.98) return false;
        if(b.block.consumesLiquid(liq)) return true;
        if(!b.block.delegee.liqTargetFilter.get(liq)) return false;

        return b.delegee.ctTargets.length === 0 || b.delegee.ctTargets.includes(liq);
    };


    /**
     * @private
     * @param {BIncinerator} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        b.self.ex_drawSelected();
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Incinerator that is actually a crafter.
         * @class BLK_incinerator
         * @extends BLK_baseItemBlock
         * @extends INTF_BLK_contentMultiSelector
         */
        newClass()
        .extendClass(PARENT[0], "BLK_incinerator")
        .implement(INTF_BLK_contentMultiSelector[0])
        .implement(INTF_BLK_fluidTypeFilter[0])
        .initTemplate()
        .setParent(GenericCrafter)
        .setTags("blk-non-fac")
        .setParam({


            /**
             * `PARAM`: If true, explosion can happen if explosive resource is consumed.
             * @memberof BLK_incinerator
             * @instance
             * @type {boolean}
             */
            hasExploIncineration: true,
            /**
             * `PARAM`: Extra filter for valid item.
             * <br> `ARGS`: item.
             * @memberof BLK_incinerator
             * @instance
             * @type {Boolf<Item>}
             */
            itemTargetFilter: boolf(function(item) {return true}),
            /**
             * `PARAM`: Extra filter for valid fluid.
             * <br> `ARGS`: liq.
             * @memberof BLK_incinerator
             * @instance
             * @type {Boolf<Liquid>}
             */
            liqTargetFilter: boolf(function(liq) {return true}),
            /**
             * `PARAM`: See {@link BLK_baseFactory}.
             * @memberof BLK_incinerator
             * @instance
             * @type {SoundGn}
             */
            craftSe: Sounds.unset,


        })
        .setParamAlias([
            /**
             * `ALIAS`: `craftEffect`.
             * @memberof BLK_incinerator
             * @instance
             * @name craftEff
             * @type {Effect}
             */
            "craftEff", "craftEffect", Fx.none,
            /**
             * `ALIAS`: `updateEffect`.
             * @memberof BLK_incinerator
             * @instance
             * @name updateEff
             * @type {Effect}
             */
            "updateEff", "updateEffect", Fx.none,
            /**
             * `ALIAS`: `updateEffectChance`.
             * @memberof BLK_incinerator
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


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


            outputsItems: function() {
                return this.outputItems != null && this.outputItems.length > 0;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_incinerator
             * @instance
             * @func
             * @return {Array<UnlockableContent>}
             */
            ex_findSelectionTargets: function() {
                let arr = [];
                if(this.hasItems) {
                    arr.pushAll(Vars.content.items().select(item => this.delegee.itemTargetFilter.get(item)).toArray());
                };
                if(this.hasLiquids) {
                    if(this.delegee.fldType === "liquid") {
                        arr.pushAll(Vars.content.liquids().select(liq => !liq.gas && this.delegee.liqTargetFilter.get(liq)).toArray());
                    } else if(this.delegee.fldType === "gas") {
                        arr.pushAll(Vars.content.liquids().select(liq => liq.gas && this.delegee.liqTargetFilter.get(liq)).toArray());
                    } else {
                        arr.pushAll(Vars.content.liquids().select(liq => this.delegee.liqTargetFilter.get(liq)).toArray());
                    };
                };

                return arr;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_incinerator
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSwitchDisableTarget: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_incinerator
         * @extends B_baseItemBlock
         * @extends INTF_B_contentMultiSelector
         */
        newClass()
        .extendClass(PARENT[1], "B_incinerator")
        .implement(INTF_BLK_contentMultiSelector[1])
        .implement(INTF_BLK_fluidTypeFilter[1])
        .initTemplate()
        .setParent(GenericCrafter.GenericCrafterBuild)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_incinerator
             * @instance
             * @type {boolean}
             */
            hasItemTarget: false,
            /**
             * `INTERNAL`
             * @memberof B_incinerator
             * @instance
             * @type {boolean}
             */
            hasLiqTarget: false,
            /**
             * `INTERNAL`
             * @memberof B_incinerator
             * @instance
             * @type {boolean}
             */
            justCrafted: false,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            craft: function() {
                comp_craft(this);
            },


            acceptItem: function(b_f, item) {
                return comp_acceptItem(this, b_f, item);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            acceptLiquid: function(b_f, liq) {
                return comp_acceptLiquid(this, b_f, liq);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            shouldConsume: function() {
                return this.delegee.hasItemTarget || this.delegee.hasLiqTarget;
            }
            .setProp({
                noSuper: true,
            }),


            draw: function() {
                this.self.ex_drawRcIcon();
            },


            drawSelect: function() {
                comp_drawSelect(this);
            },


            write: function(wr) {
                this.self.ex_processData(wr);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.self.ex_processData(rd);
            },


            /**
             * Whether explosion can happen.
             * @memberof B_incinerator
             * @instance
             * @func
             * @return {boolean}
             */
            ex_canExploIncinerate: function() {
                return Vars.state.rules.reactorExplosions && this.block.delegee.hasExploIncineration;
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
