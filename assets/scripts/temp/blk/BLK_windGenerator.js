/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<ConsumeGenerator, BLK_windGenerator>} BLKWindGenerator
     */


    /**
     * @typedef {TemplateInstance<ConsumeGenerator.ConsumeGeneratorBuild, B_windGenerator>} BWindGenerator
     * @prop {BLKWindGenerator} block
     */


    const PARENT = require("lovec/temp/blk/BLK_consumeGenerator");
    const INTF_BLK_sameBlockRestrictionHandler = require("lovec/temp/intf/INTF_BLK_sameBlockRestrictionHandler");
    const INTF_BLK_rangeDisplay = require("lovec/temp/intf/INTF_BLK_rangeDisplay");


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @type {number}
     */
    const POW_PROD_SCL = 1.35;


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKWindGenerator} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.delegee.blkR = blk.delegee.placeRestrictR;
        blk.clipSize += blk.delegee.placeRestrictR * Vars.tilesize;
    };


    /**
     * @private
     * @param {BLKWindGenerator} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.bladeHitSe = fetchSound(blk.delegee.bladeHitSe);
    };


    /**
     * @private
     * @param {BLKWindGenerator} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(blk.generationType);
        stats.add(blk.generationType, blk.powerProduction * 60.0, StatUnit.powerSecond);
    };


    /**
     * @private
     * @param {BLKWindGenerator} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.removeBar("lovec-warmup");
        blk.addBar("lovec-wind-effc", b => new Bar(
            prov(() => Core.bundle.format("bar.lovec-bar-wind-effc-amt", b.delegee.windEffc.perc(0))),
            prov(() => Tmp.c1.set(Pal.accent).lerp(Pal.heal, b.delegee.windEffc)),
            () => Mathf.clamp(b.delegee.windEffc, 0.0, 1.0),
        ));
    };


    /**
     * @private
     * @param {BWindGenerator} b
     * @return {void}
     */
    function comp_created(b) {
        b.totalTime += Mathf.random(360.0);
    };


    /**
     * @private
     * @param {BWindGenerator} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_param.IS_CAVE_MAP || b.isPayload()) {
            b.delegee.windEffc = 0.0;
        };
        if(GLB_timer.secHalf) {
            b.delegee.windEffc = MDL_attr.calcSumWind(b.tile, b.block.delegee.windScl, b.block.delegee.minProdEffc, b.block.delegee.posVari);
        };

        if(GLB_timer.secHalf && b.block.delegee.bladeTouchRad > 0.0 && b.delegee.windEffc >= b.block.delegee.bladeTouchWarmupThr) {
            let hasHit = false;
            LCEntity.eachUnit(b.x, b.y, null, b.block.delegee.bladeTouchRad, ounit => MDL_cond.isUnitInLowAir(ounit) || MDL_cond.isUnitBoosting(ounit), ounit => {
                FRAG_attack.damage(ounit, b.block.delegee.bladeTouchDmg * b.delegee.windEffc);
                hasHit = true;
            });
            if(hasHit) {
                FRAG_attack.damage(b, b.block.delegee.bladeTouchSelfDmg * b.delegee.windEffc);
                MDL_sound.playAt(b.x, b.y, b.block.delegee.bladeHitSe);
            };
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Generates power from wind, cannot be built near other wind generators, deals damage to some flying units.
         * @class BLK_windGenerator
         * @extends BLK_consumeGenerator
         * @extends INTF_BLK_sameBlockRestrictionHandler
         * @extends INTF_BLK_rangeDisplay
         */
        newClass()
        .extendClass(PARENT[0], "BLK_windGenerator")
        .implement(INTF_BLK_sameBlockRestrictionHandler[0])
        .implement(INTF_BLK_rangeDisplay[0])
        .initTemplate()
        .setParent("ConsumeGenerator")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Scaling on efficiency oscillation.
             * @memberof BLK_windGenerator
             * @instance
             * @type {number}
             */
            windScl: 1.0,
            /**
             * `PARAM`: Minimum power production efficiency due to oscillation at 100% wind attribute.
             * @memberof BLK_windGenerator
             * @instance
             * @type {number}
             */
            minProdEffc: 0.3,
            /**
             * `PARAM`: Power production oscillation due to position.
             * @memberof BLK_windGenerator
             * @instance
             * @type {number}
             */
            posVari: 0.15,
            /**
             * `PARAM`: Radius used for flying unit touch damage. Use a negative number to disable.
             * @memberof BLK_windGenerator
             * @instance
             * @type {number}
             */
            bladeTouchRad: -1.0,
            /**
             * `PARAM`: Warmup above which blade damage can happen.
             * @memberof BLK_windGenerator
             * @instance
             * @type {number}
             */
            bladeTouchWarmupThr: 0.7,
            /**
             * `PARAM`: Damage dealt to flying units hit by blade.
             * @memberof BLK_windGenerator
             * @instance
             * @type {number}
             */
            bladeTouchDmg: 200.0,
            /**
             * `PARAM`: Like {@link BLK_windGenerator#bladeTouchDmg} but dealt to the building itself.
             * @memberof BLK_windGenerator
             * @instance
             * @type {number}
             */
            bladeTouchSelfDmg: 40.0,
            /**
             * `PARAM`: The rotator speed used in drawer. Required for proper flash effect.
             * @memberof BLK_windGenerator
             * @instance
             * @type {number}
             */
            bladeVisualSpd: 0.0,
            /**
             * `PARAM`: Sound played when a unit is hit by blade.
             * @memberof BLK_windGenerator
             * @instance
             * @type {SoundGn}
             */
            bladeHitSe: "SOUNDS: blockExplode2Alt",
            /**
             * @inheritdoc
             * @memberof BLK_windGenerator
             * @instance
             * @type {boolean}
             */
            overwriteExploParam: false,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_windGenerator
             * @instance
             * @type {Boolf2<BLKWindGenerator, Block>}
             */
            sameTypeFilter: boolf2(function(blk, oblk) {return checkSubInsOfTemp(oblk, "BLK_windGenerator")}),


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


        }),


        /**
         * @class B_windGenerator
         * @extends B_consumeGenerator
         * @extends INTF_B_sameBlockRestrictionHandler
         * @extends INTF_B_rangeDisplay
         */
        newClass()
        .extendClass(PARENT[1], "B_windGenerator")
        .implement(INTF_BLK_sameBlockRestrictionHandler[1])
        .implement(INTF_BLK_rangeDisplay[1])
        .initTemplate()
        .setParent("ConsumeGenerator.ConsumeGeneratorBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`: Wind power efficiency.
             * @memberof B_windGenerator
             * @instance
             * @type {number}
             */
            windEffc: 0.0,


        })
        .setMethod({


            created: function() {
                comp_created(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            }
            .setProp({
                noSuper: true,
            }),


            getPowerProduction: function() {
                return POW_PROD_SCL;
            }
            .setProp({
                noSuper: true,
                mergeMode: function(valPrev, val) {
                    return valPrev * val;
                },
            }),


            /**
             * @override
             * @memberof B_windGenerator
             * @instance
             * @func
             * @return {number}
             */
            ex_getGenWarmupTarget: function() {
                return this.delegee.windEffc;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * @memberof B_windGenerator
             * @instance
             * @func
             * @return {number}
             */
            ex_getFlashEffAng: function() {
                return Mathf.mod(this.totalTime * this.block.delegee.bladeVisualSpd, 360.0);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof B_windGenerator
             * @instance
             * @func
             * @return {number}
             */
            ex_getFlashEffRotSpd: function() {
                return this.block.delegee.bladeVisualSpd;
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
