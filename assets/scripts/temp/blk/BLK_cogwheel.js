/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_cogwheel>} BLKCogwheel
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_cogwheel>} BCogwheel
     * @prop {BLKCogwheel} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseTorqueBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKCogwheel} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.size % 2 === 0) throw new Error("Cogwheel size should be odd number: " + blk);

        blk.delegee.cogwheelUpdater = new BLKCogwheelUpdater(blk);

        blk.group = BlockGroup.none;
        blk.priority = TargetPriority.transport;
        blk.update = true;
        blk.configurable = true;
        blk.drawDisabled = true;
        blk.drawDynamic = true;
        blk.drawCached = false;

        blk.config(JAVA.boolean, (b, bool) => {
            b.onProximityUpdate();
            b.delegee.isInv = bool;
            b.delegee.rpmCur = b.self.ex_calcRpmTarget();
            MDL_effect.click(b.x, b.y, b.team.color);
            MDL_sound.playAt(b.x, b.y, "SOUNDS: click");
            BOX_trigger.torqueBlockConfigure.fire(b);
        });
    };


    /**
     * @private
     * @param {BLKCogwheel} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.invReg = fetchRegion(blk, "-inv", "");
        blk.delegee.cogDrawW = blk.region.width * 2.0 * 1.06 / Vars.tilesize;
        blk.delegee.cogInvOffAng = 22.5 / (blk.size + 1) * 2.0;
    };


    /**
     * @private
     * @param {BCogwheel} b
     * @param {Unit} unit
     * @return {void}
     */
    function comp_unitOn(b, unit) {
        let dst = Mathf.dst(b.x, b.y, unit.x, unit.y);
        (dst > 3.0 || unit.hitSize > (b.block.size + 0.5) * Vars.tilesize) ?
            unit.impulse(Tmp.v1.set(unit).sub(b).rotate90(Mathf.sign(!b.delegee.isInv)).nor().scl(b.delegee.rpmCur * 3.0 * b.block.size / Math.max(dst * 0.7, 1.0))) :
            MDL_call.rotateUnit(unit, b.delegee.rpmCur * 0.2 * Mathf.sign(!b.delegee.isInv));

        if(GLB_timer.sec && b.delegee.rpmCur > 1.0) {
            BOX_trigger.cogwheelUnitSpin.fire(b, unit);
        };
    };


    /**
     * @private
     * @param {BCogwheel} b
     * @return {boolean}
     */
    function comp_configTapped(b) {
        b.configure(!b.delegee.isInv);
        return false;
    };


    /**
     * @private
     * @param {BCogwheel} b
     * @return {void}
     */
    function comp_draw(b) {
        b.self.ex_drawCog();
    };


    /**
     * @private
     * @param {BCogwheel} b
     * @param {BLKCogwheel} blk
     * @param {Team} team
     * @return {void}
     */
    function comp_ex_justCreated(b, blk, team) {
        b.delegee.cogwheelBuildUpdater = new BCogwheelUpdater(blk.delegee.cogwheelUpdater, b);
    };


    /**
     * @private
     * @param {BCogwheel} b
     * @return {void}
     */
    function comp_ex_updateTorTransTargets(b) {
        b.delegee.torTransTargets.clear();
        let
            size = b.block.size,
            rot,
            ob;
        while(size > 0) {
            rot = 0;
            while(rot < 4) {
                ob = b.self.ex_findCog(size, rot);
                if(ob != null) {
                    b.delegee.torTransTargets.push(ob);
                };
                rot++;
            };
            size -= 2;
        };
    };


    /**
     * @private
     * @param {BCogwheel} b
     * @param {number} size
     * @param {number} rot
     * @return {Building|null}
     */
    function comp_ex_findCog(b, size, rot) {
        let
            pon2,
            dstT = (size + 1) / 2;
        switch(rot) {
            case 0 :
                pon2 = Tmp.p1.set(-dstT, 0);
                break;
            case 1 :
                pon2 = Tmp.p1.set(0, -dstT);
                break;
            case 2 :
                pon2 = Tmp.p1.set(dstT, 0);
                break;
            case 3 :
                pon2 = Tmp.p1.set(0, dstT);
                break;
        };
        let ot = b.tile.nearby(pon2);
        if(ot == null) return null;
        let ob = ot.build;
        if(
            ob == null
                || ob === b
                || (ob.tileX() !== b.tileX() && ob.tileY() !== b.tileY())
                || !SLCPos.calcTileDst(b.tile, ob.tile).fEqual((b.block.size + ob.block.size) * 0.5 * Vars.tilesize)
                || !b.self.ex_checkCogTransValid(ob)
        ) {
            return null;
        };

        if(GLB_param.ENABLE_TEST_DRAW) {
            Fx.placeBlock.at(ob);
        };

        return ob;
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * A torque transmitter.
         * @class BLK_cogwheel
         * @extends BLK_baseTorqueBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_cogwheel")
        .initTemplate()
        .setParent("Wall")
        .setTags("blk-cog", "blk-non-wall")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_cogwheel
             * @instance
             * @type {LCContentUpdater<Wall>}
             */
            cogwheelUpdater: null,
            /**
             * `INTERNAL`
             * @memberof BLK_cogwheel
             * @instance
             * @type {TextureRegion}
             */
            invReg: null,
            /**
             * `INTERNAL`
             * @memberof BLK_cogwheel
             * @instance
             * @type {number}
             */
            cogDrawW: 0.0,
            /**
             * `INTERNAL`
             * @memberof BLK_cogwheel
             * @instance
             * @type {number}
             */
            cogInvOffAng: 0.0,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_cogwheel
             * @instance
             * @type {boolean}
             */
            skipTorFetch: true,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_cogwheel
             * @instance
             * @type {boolean}
             */
            skipTorSupply: true,


            /* <------------------------------ vanilla ------------------------------> */


            solid: false,
            underBullets: true,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


        }),


        /**
         * @class B_cogwheel
         * @extends B_baseTorqueBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_cogwheel")
        .initTemplate()
        .setParent("Wall.WallBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_cogwheel
             * @instance
             * @type {LCBuildUpdater<Wall.WallBuild, Wall>}
             */
            cogwheelBuildUpdater: null,
            /**
             * `INTERNAL`
             * @memberof B_cogwheel
             * @instance
             * @type {boolean}
             */
            isInv: false,


        })
        .setMethod({


            unitOn: function(unit) {
                comp_unitOn(this, unit);
            },


            shouldAmbientSound: function() {
                return this.delegee.rpmCur > 0.0;
            }
            .setProp({
                noSuper: true,
            }),


            ambientVolume: function() {
                return Math.min(this.delegee.rpmCur / 50.0, 1.0);
            }
            .setProp({
                noSuper: true,
            }),


            configTapped: function() {
                return comp_configTapped(this);
            }
            .setProp({
                noSuper: true,
            }),


            config: function() {
                return this.delegee.isInv;
            }
            .setProp({
                noSuper: true,
            }),


            draw: function() {
                comp_draw(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_cogwheel
             * @instance
             * @func
             * @param {BLKCogwheel} blk
             * @param {Team} team
             * @return {void}
             */
            ex_justCreated: function(blk, team) {
                comp_ex_justCreated(this, blk, team);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_cogwheel
             * @instance
             * @func
             * @return {void}
             */
            ex_updateTorTransTargets: function() {
                comp_ex_updateTorTransTargets(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_cogwheel
             * @instance
             * @func
             * @param {Building} b_t
             * @return {number}
             */
            ex_calcRpmTrans: function(b_t) {
                return this.delegee.rpmCur * this.block.size;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_cogwheel
             * @instance
             * @func
             * @param {Building} b_f
             * @return {number}
             */
            ex_calcRpmAcceptScl: function(b_f) {
                return 1.0 / this.block.size;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_cogwheel
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_checkTorTransValid: function(ob) {
                return tryJsProp(ob, "isInv", false) !== this.isInv;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


            /**
             * @memberof B_cogwheel
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_checkCogTransValid: function(ob) {
                return MDL_cond.isCogwheel(ob.block);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof B_cogwheel
             * @instance
             * @func
             * @param {number} size
             * @param {number} rot
             * @return {Building|null}
             */
            ex_findCog: function(size, rot) {
                return comp_ex_findCog(this, size, rot);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * @memberof B_cogwheel
             * @instance
             * @func
             * @return {void}
             */
            ex_drawCog: function() {
                this.delegee.cogwheelBuildUpdater.ex_drawCog();
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof B_cogwheel
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                processData(
                    wr0rd,
                    wr => {
                        wr.bool(this.delegee.isInv);
                    },
                    rd => {
                        this.delegee.isInv = rd.bool();
                    },
                );
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
