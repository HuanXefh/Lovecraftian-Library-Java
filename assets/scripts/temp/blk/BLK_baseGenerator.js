/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseGenerator>} BLKBaseGenerator
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseGenerator>} BBaseGenerator
     * @prop {BLKBaseGenerator} block
     */


    const PARENT = require("lovec/temp/blk/BLK_basePowerBlock");
    const INTF_BLK_facilityBlock = require("lovec/temp/intf/INTF_BLK_facilityBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBaseGenerator} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.priority = GLB_var.priority.powGen;

        if(blk.delegee.setupExploParam) {
            blk.explosionRadius = Math.round(FRAG_attack.getPresExploRad(blk.size) / Vars.tilesize);
            blk.explosionDamage = FRAG_attack.getPresExploDmg(blk.size);
            if(blk.explosionPuddleLiquid != null) {
                blk.explosionPuddles = Math.round(Mathf.lerp(5, 10, blk.size / 2));
                blk.explosionPuddleRange = blk.explosionRadius * 0.75;
                blk.explosionPuddleAmount = Mathf.lerp(50.0, 70.0, blk.size / 2);
            };
        };
    };


    /**
     * @private
     * @param {BLKBaseGenerator} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(blk.delegee.setupVanillaStat) {
            if(blk.explosionDamage > 0) {
                stats.add(fetchStat("lovec", "blk-canexplode"), true);
                stats.add(fetchStat("lovec", "blk-explor"), blk.explosionRadius, StatUnit.blocks);
                stats.add(fetchStat("lovec", "blk-explodmg"), blk.explosionDamage);
                if(blk.explosionPuddleLiquid != null) {
                    stats.add(fetchStat("lovec", "blk-exploliq"), StatValues.content([blk.explosionPuddleLiquid].toSeq()));
                };
            };
        };
    };


    /**
     * @private
     * @param {BLKBaseGenerator} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    function comp_drawPlace(blk, tx, ty, rot, valid) {
        if(blk.explosionDamage > 0) {
            SLCDrawf.diskWarning(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.explosionRadius * Vars.tilesize);
        };
    };


    /**
     * @private
     * @param {BBaseGenerator} b
     * @return {void}
     */
    function comp_createExplosion(b) {
        FRAG_attack.shockwave(b.x, b.y, b.block.explosionRadius);
        FRAG_attack.impact(b.x, b.y, b.block.explosionDamage * 0.5, 480.0, b.block.explosionRadius * Vars.tilesize, 0.0, 0.0);
    };


    /**
     * @private
     * @param {BBaseGenerator} b
     * @param {Building} ob
     * @return {boolean}
     */
    function comp_conductsTo(b, ob) {
        // Don't cause short circuit for pipes
        return !MDL_cond.isFluidConduit(ob.block);
    };


    /**
     * @private
     * @param {BBaseGenerator} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        if(b.block.explosionDamage > 0) {
            SLCDrawf.diskWarning(b.x, b.y, b.block.explosionRadius * Vars.tilesize);
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Blocks that produce power.
         * @class BLK_baseGenerator
         * @extends BLK_basePowerBlock
         * @extends INTF_BLK_facilityBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseGenerator")
        .implement(INTF_BLK_facilityBlock[0])
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({


            /**
             * `PARAM`: Whether to set up explosion-related parameters with generated ones. Set this to false if the generator should not explode.
             * @memberof BLK_baseGenerator
             * @instance
             * @type {boolean}
             */
            setupExploParam: true,


        })
        .setParamAlias([
            /**
             * `ALIAS`: `generateEffect`.
             * @memberof BLK_baseGenerator
             * @instance
             * @name genEff
             * @type {Effect}
             */
            "genEff", "generateEffect", Fx.none,
            /**
             * `ALIAS`: `effectChance`.
             * @memberof BLK_baseGenerator
             * @instance
             * @name genEffP
             * @type {number}
             */
            "genEffP", "effectChance", 0.02,
            /**
             * `ALIAS`: `generateEffectRange`.
             * @memberof BLK_baseGenerator
             * @instance
             * @name genEffRad
             * @type {number}
             */
            "genEffRad", "generateEffectRange", 3.0,
            /**
             * `ALIAS`: `explodeEffect`.
             * @memberof BLK_baseGenerator
             * @instance
             * @name exploEff
             * @type {Effect}
             */
            "exploEff", "explodeEffect", Fx.none,
        ])
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            },


        }),


        /**
         * @class B_baseGenerator
         * @extends B_basePowerBlock
         * @extends INTF_B_facilityBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_baseGenerator")
        .implement(INTF_BLK_facilityBlock[1])
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({


            createExplosion: function() {
                comp_createExplosion(this);
            },


            conductsTo: function(ob) {
                return comp_conductsTo(this, ob);
            }
            .setProp({
                boolMode: "and",
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            },


        }),


    ];
