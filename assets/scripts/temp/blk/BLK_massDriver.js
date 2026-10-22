/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<MassDriver, BLK_massDriver>} BLKMassDriver
     */


    /**
     * @typedef {TemplateInstance<MassDriver.MassDriverBuild, B_massDriver>} BMassDriver
     * @prop {BLKMassDriver} block
     */


    const PARENT = require("lovec/temp/blk/BLK_configTurret");
    const INTF_BLK_impactInducer = require("lovec/temp/intf/INTF_BLK_impactInducer");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKMassDriver} blk
     * @return {void}
     */
    function comp_init(blk) {
        MDL_event.onLoad(() => {
            blk.bullet.damage = blk.delegee.bulDmg;
            blk.bullet.collidesGround = blk.delegee.bulCollidesGround;
            blk.bullet.collidesAir = blk.delegee.bulCollidesAir;
            blk.bullet.sprite = blk.delegee.bulSpr;
            blk.bullet.width = blk.delegee.bulW;
            blk.bullet.height = blk.delegee.bulH;
            blk.bullet.shrinkX = blk.delegee.bulShrinkX;
            blk.bullet.shrinkY = blk.delegee.bulShrinkY;
        });
    };


    /**
     * @private
     * @param {BLKMassDriver} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(Stat.damage, blk.delegee.bulDmg);
    };


    /**
     * @private
     * @param {BMassDriver} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.reloadCounter > 0.99 && !b.delegee.justCrafted) {
            b.self.ex_onCraft();
            b.delegee.justCrafted = true;
        };
        if(b.reloadCounter < 0.1) {
            b.delegee.justCrafted = false;
        };
    };


    /**
     * @private
     * @param {BMassDriver} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        let ob = GLB_var.world.build(b.link);
        if(ob == null) return;

        LCDrawf.lineFlick(
            b.x, b.y, ob.x, ob.y, false, 1.0, 0.5,
            !b.block.delegee.bulCollidesTerrain ?
                Pal.accent :
                b.block.delegee.bulCollidesTerrainCaveOnly && !GLB_param.IS_CAVE_MAP ?
                    Pal.accent :
                    !LCRaycastf.checkLegSolid(b.x, b.y, ob.x, ob.y) ?
                        Pal.accent :
                        Pal.remove,
        );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Greatly nerfed mass driver.
         * @class BLK_massDriver
         * @extends BLK_configTurret
         * @extends INTF_BLK_impactInducer
         */
        newClass()
        .extendClass(PARENT[0], "BLK_massDriver")
        .implement(INTF_BLK_impactInducer[0])
        .initTemplate()
        .setParent("MassDriver")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Damage dealt by the mass driver bolt.
             * @memberof BLK_massDriver
             * @instance
             * @type {number}
             */
            bulDmg: 40.0,
            /**
             * `PARAM`: If true, the bullet will collide with terrain wall.
             * @memberof BLK_massDriver
             * @instance
             * @type {boolean}
             */
            bulCollidesTerrain: true,
            /**
             * `PARAM`: If true, the bullet only collides with terrain wall in a cave map.
             * @memberof BLK_massDriver
             * @instance
             * @type {boolean}
             */
            bulCollidesTerrainCaveOnly: false,
            /**
             * `PARAM`: Whether the bullet collides with ground units.
             * @memberof BLK_massDriver
             * @instance
             * @type {boolean}
             */
            bulCollidesGround: true,
            /**
             * `PARAM`: Whether the bullet collides with air units.
             * @memberof BLK_massDriver
             * @instance
             * @type {boolean}
             */
            bulCollidesAir: false,
            /**
             * `PARAM`: `sprite` of the bullet.
             * @memberof BLK_massDriver
             * @instance
             * @type {string}
             */
            bulSpr: "shell",
            /**
             * `PARAM`: `width` of the bullet.
             * @memberof BLK_massDriver
             * @instance
             * @type {number}
             */
            bulW: 9.0,
            /**
             * `PARAM`: `height` of the bullet.
             * @memberof BLK_massDriver
             * @instance
             * @type {number}
             */
            bulH: 12.0,
            /**
             * `PARAM`: `shrinkX` of the bullet.
             * @memberof BLK_massDriver
             * @instance
             * @type {number}
             */
            bulShrinkX: 0.0,
            /**
             * `PARAM`: `shrinkY` of the bullet.
             * @memberof BLK_massDriver
             * @instance
             * @type {number}
             */
            bulShrinkY: 0.5,
            /**
             * `PARAM`: Used to build the mass driver bullet.
             * @memberof BLK_massDriver
             * @instance
             * @type {ExtendParamObject|null}
             */
            bulParamObj: null,


            /* <------------------------------ vanilla ------------------------------> */


            bullet: tfunc(paramObj => fetchBullet("MassDriverBullet", paramObj.bulParamObj)),


        })
        .setParamAlias([
            /**
             * `ALIAS`: `shootEffect`.
             * @memberof BLK_massDriver
             * @instance
             * @name shootEff
             * @type {Effect}
             */
            "shootEff", "shootEffect", Fx.shootBig2,
            /**
             * `ALIAS`: `smokeEffect`.
             * @memberof BLK_massDriver
             * @instance
             * @name smokeEff
             * @type {Effect}
             */
            "smokeEff", "smokeEffect", Fx.none,
            /**
             * `ALIAS`: `receiveEffect`.
             * @memberof BLK_massDriver
             * @instance
             * @name receiveEff
             * @type {Effect}
             */
            "receiveEff", "receiveEffect", Fx.mineBig,
        ])
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_massDriver
             * @instance
             * @func
             * @param {Building} b
             * @return {number}
             */
            ex_calcImpactIntv: function(b) {
                return this.reload;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_massDriver
             * @instance
             * @func
             * @param {Building} b
             * @return {number}
             */
            ex_calcImpactShake: function(b) {
                return this.shake;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


        }),


        /**
         * @class B_massDriver
         * @extends B_configTurret
         * @extends INTF_B_impactInducer
         */
        newClass()
        .extendClass(PARENT[1], "B_massDriver")
        .implement(INTF_BLK_impactInducer[1])
        .initTemplate()
        .setParent("MassDriver.MassDriverBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_massDriver
             * @instance
             * @type {boolean}
             */
            justCrafted: false,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            currentShooter: function() {
                return this.reloadCounter > 0.0 ?
                    null :
                    this.super$currentShooter();
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            },


            write: function(wr) {
                wr.f(this.reloadCounter);
                wr.bool(this.delegee.justCrafted);
            },


            read: function(rd, revi) {
                if(this.delegee.LCReviJson["B_massDriver"] >= 1) {
                    this.reloadCounter = rd.f();
                    this.delegee.justCrafted = rd.bool();
                };
            },


            /**
             * @memberof B_massDriver
             * @instance
             * @func
             * @return {void}
             */
            ex_onCraft: function() {
                this.self.ex_createImpactWave();
                MDL_effect.impactWave(this.x, this.y, this.block.self.ex_calcImpactRad(this));
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
