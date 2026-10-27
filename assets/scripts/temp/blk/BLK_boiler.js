/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_boiler>} BLKBoiler
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_boiler>} BBoiler
     * @prop {BLKBoiler} block
     */


    const PARENT = require("lovec/temp/blk/BLK_furnaceFactory");
    const INTF_BLK_pressureProducer = require("lovec/temp/intf/INTF_BLK_pressureProducer");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBoiler} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(!blk.hasLiquids) throw new LCError.NoLiquidModuleError(blk);
        // noinspection JSValidateTypes
        blk.delegee.exploFldTarget = MDL_content.getCt(blk.delegee.exploFldTarget, ContentGetModes.RS);
        // noinspection JSValidateTypes
        blk.delegee.dryHeatFldTarget = MDL_content.getCt(blk.delegee.dryHeatFldTarget, ContentGetModes.RS);
        if(blk.delegee.dryHeatCancelThr < 0.0) {
            blk.delegee.dryHeatCancelThr = blk.delegee.dryHeatThr * 0.5;
        };
    };


    /**
     * @private
     * @param {BLKBoiler} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.flashReg = fetchRegionOrNull(blk, "-flash");
    };


    /**
     * @private
     * @param {BLKBoiler} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk-canexplode"), true);
        stats.add(fetchStat("lovec", "blk-explor"), blk.delegee.exploRad / Vars.tilesize, StatUnit.blocks);
        stats.add(fetchStat("lovec", "blk-explodmg"), blk.delegee.exploDmg);
    };


    /**
     * @private
     * @param {BLKBoiler} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.addBar("lovec-instab", b => new Bar(
            "bar.instability",
            GLB_color.sap,
            () => b.delegee.boilerInstab,
        ));
    };


    /**
     * @private
     * @param {BLKBoiler} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    function comp_drawPlace(blk, tx, ty, rot, valid) {
        if(blk.delegee.exploDmg > 0.0) {
            SLCDrawf.diskWarning(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.delegee.exploRad);
        };
    };


    /**
     * @private
     * @param {BBoiler} b
     * @return {void}
     */
    function comp_onDestroyed(b) {
        if(b.delegee.boilerInstab > b.block.delegee.hitExploMinInstab) {
            FRAG_attack.explosion(b.x, b.y, b.block.delegee.exploDmg, b.block.delegee.exploRad, b.block.delegee.exploShake);
        };
    };


    /**
     * @private
     * @param {BBoiler} b
     * @return {void}
     */
    function comp_updateTile(b) {
        let
            cap = b.block.liquidCapacity,
            amtWater = b.block.delegee.dryHeatFldTarget == null ? cap : b.liquids.get(b.block.delegee.dryHeatFldTarget),
            amtSteam = b.block.delegee.exploFldTarget == null ? 0.0 : b.liquids.get(b.block.delegee.exploFldTarget),
            amtHeat = b.self.ex_getHeat();

        if(amtWater < 0.01 && amtHeat > b.block.delegee.dryHeatThr) {
            b.delegee.dryHeated = true;
        };
        if(amtHeat < b.block.delegee.dryHeatCancelThr) {
            b.delegee.dryHeated = false;
        };

        b.delegee.boilerInstab = b.cheating() ?
            0.0 :
            Mathf.clamp(b.delegee.boilerInstab + (
                (b.delegee.dryHeated && amtWater > 0.1) || (amtSteam / cap > 0.95) ?
                    b.block.delegee.boilerInstabIncRate :
                    -b.block.delegee.boilerInstabIncRate
            ) * Time.delta);
        if(b.delegee.boilerInstab > 0.9999) {
            BOX_trigger.boilerExplosion.fire(b);
            b.kill();
        };

        b.delegee.boilerInstabProg += b.delegee.boilerInstab * 3.0;
    };


    /**
     * @private
     * @param {BBoiler} b
     * @return {void}
     */
    function comp_draw(b) {
        SLCDrawf.fadeProg(b.x, b.y, b.block.delegee.flashReg, b.delegee.boilerInstabProg, 1.0, 0.0, 1.0, Color.white, b.delegee.boilerInstab * 0.7);
    };


    /**
     * @private
     * @param {BBoiler} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        if(b.block.delegee.exploDmg > 0.0) {
            SLCDrawf.diskWarning(b.x, b.y, b.block.delegee.exploRad);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * A crafter (reactor???) that explodes if dry-heated or full of steam.
         * @class BLK_boiler
         * @extends BLK_furnaceFactory
         * @extends INTF_BLK_pressureProducer
         */
        newClass()
        .extendClass(PARENT[0], "BLK_boiler")
        .implement(INTF_BLK_pressureProducer[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Explosion radius.
             * @memberof BLK_boiler
             * @instance
             * @type {number}
             */
            exploRad: 40.0,
            /**
             * `PARAM`: Explosion damage. Use 0.0 to disable explosion.
             * @memberof BLK_boiler
             * @instance
             * @type {number}
             */
            exploDmg: 3000.0,
            /**
             * `PARAM`: Explosion shake.
             * @memberof BLK_boiler
             * @instance
             * @type {number}
             */
            exploShake: 12.0,
            /**
             * `PARAM`: Minimum instability required for this boiler to explode when destroyed.
             * @memberof BLK_boiler
             * @instance
             * @type {number}
             */
            hitExploMinInstab: 0.3,
            /**
             * `PARAM`: Fluid that causes explosion if full, nullable.
             * @memberof BLK_boiler
             * @instance
             * @type {LiquidGn}
             */
            exploFldTarget: "loveclab-gas0int-steam-hp",
            /**
             * `PARAM`: Fluid that causes explosion if the boiler is dry-heated, nullable.
             * @memberof BLK_boiler
             * @instance
             * @type {LiquidGn}
             */
            dryHeatFldTarget: "loveclab-liq0ore-water",
            /**
             * `PARAM`: Temperature above which dry-heating can happen.
             * @memberof BLK_boiler
             * @instance
             * @type {number}
             */
            dryHeatThr: 100.0,
            /**
             * `PARAM`: Temperature below which the boiler exits dry-heated state, half of {@link BLK_boiler#dryHeatThr} by default.
             * @memberof BLK_boiler
             * @instance
             * @type {number}
             */
            dryHeatCancelThr: -1.0,
            /**
             * `PARAM`: Instability increase/decrease rate.
             * @memberof BLK_boiler
             * @instance
             * @type {number}
             */
            boilerInstabIncRate: 0.001,
            /**
             * `PARAM`: Most boilers only accept external heat. Set this to false if the boiler burns fuel items.
             * @override
             * @memberof BLK_boiler
             * @instance
             * @type {boolean}
             */
            noFuelInput: true,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_boiler
             * @instance
             * @type {TextureRegion|null}
             */
            flashReg: null,
            /**
            * `INTERNAL`
            * <br> `REALIZED`
            * @override
            * @memberof BLK_boiler
            * @instance
            * @type {boolean}
            */
            shouldClearAuxOnStop: false,
            /**
            * `INTERNAL`
            * <br> `REALIZED`
            * @override
            * @memberof BLK_boiler
            * @instance
            * @type {string}
            */
            presFldType: "gas",


        })
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


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            },


            /**
             * You shall not prevent explosion by disabling a boiler.
             * <br> `REALIZED`
             * @override
             * @memberof BLK_boiler
             * @instance
             * @func
             * @return {boolean}
             */
            ex_canSwitchDisable: function() {
                return false;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_boiler
         * @extends B_furnaceFactory
         * @extends INTF_B_pressureProducer
         */
        newClass()
        .extendClass(PARENT[1], "B_boiler")
        .implement(INTF_BLK_pressureProducer[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_boiler
             * @instance
             * @type {number}
             */
            boilerInstab: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_boiler
             * @instance
             * @type {number}
             */
            boilerInstabProg: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_boiler
             * @instance
             * @type {boolean}
             */
            dryHeated: false,


        })
        .setMethod({


            onDestroyed: function() {
                comp_onDestroyed(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            draw: function() {
                comp_draw(this);
            },


            drawSelect: function() {
                comp_drawSelect(this);
            },


            write: function(wr) {
                wr.f(this.delegee.boilerInstab);
                wr.bool(this.delegee.dryHeated);
            },


            read: function(rd, revi) {
                this.delegee.boilerInstab = rd.f();
                this.delegee.dryHeated = rd.bool();
            },


        }),


    ];
