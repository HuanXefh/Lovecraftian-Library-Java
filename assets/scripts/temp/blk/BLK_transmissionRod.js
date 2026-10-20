/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_transmissionRod>} BLKTransmissionRod
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_transmissionRod>} BTransmissionRod
     * @prop {BLKTransmissionRod} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseTorqueBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKTransmissionRod} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.group = BlockGroup.none;
        blk.priority = TargetPriority.transport;
        blk.update = true;
        blk.drawDisabled = true;
        blk.drawCached = false;
        blk.drawDynamic = true;
    };


    /**
     * @private
     * @param {BLKTransmissionRod} blk
     * @return {void}
     */
    function comp_load(blk) {
        // noinspection JSValidateTypes
        blk.delegee.rodRegs = fetchRegions(blk, "-frame", 2, blk.delegee.rodFrameAmt);
        blk.delegee.dirReg = fetchRegion(blk, "-dir", "-arrow");
    };


    /**
     * @private
     * @param {BTransmissionRod} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.delegee.isVerticalRod = Mathf.mod(b.rotation, 4) !== 0;
    };


    /**
     * @private
     * @param {BTransmissionRod} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.minTwo) {
            b.delegee.rodProg = 0.0;
        };
        b.delegee.rodProg += b.block.delegee.rodFrameAmt * b.delegee.rpmCur * Time.delta;
    };


    /**
     * @private
     * @param {BTransmissionRod} b
     * @return {void}
     */
    function comp_draw(b) {
        LCDrawf.frameFade(
            b.x, b.y,
            b.block.delegee.rodRegs[b.delegee.isVerticalRod ? 1 : 0],
            b.delegee.rodProg, 60.0,
        );
        Draw.rect(b.block.delegee.dirReg, b.x, b.y, b.drawrot());
    };


    /**
     * @private
     * @param {BTransmissionRod} b
     * @return {void}
     */
    function comp_ex_updateTorTransTargets(b) {
        b.delegee.torTransTargets.clear();
        let ob = b.back();
        if(ob == null || ob.team !== b.team) return;

        if(
            MDL_cond.isTransmissionRod(ob.block) ?
                ob.relativeTo(b) === ob.rotation :
                MDL_cond.isGearBox(ob.block)
        ) {
            b.delegee.torTransTargets.push(ob);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * An axial torque transmitter.
         * Better than cogwheel for long-range torque transfer.
         * <br> `SINGLESIZE`
         * @todo Unfinished: untested.
         * @class BLK_transmissionRod
         * @extends BLK_baseTorqueBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_transmissionRod")
        .initTemplate()
        .setParent(Wall)
        .setTags("blk-tor-rod", "blk-non-wall")
        .setParam({


            /**
             * `PARAM`: Amount of frames for the rod sprite.
             * @memberof BLK_transmissionRod
             * @instance
             * @type {number}
             */
            rodFrameAmt: 8,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_transmissionRod
             * @instance
             * @type {TDynamic<D2Array<TextureRegion>>}
             */
            rodRegs: null,
            /**
             * `INTERNAL`
             * @memberof BLK_transmissionRod
             * @instance
             * @type {TextureRegion}
             */
            dirReg: null,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_transmissionRod
             * @instance
             * @type {boolean}
             */
            skipTorFetch: true,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_transmissionRod
             * @instance
             * @type {boolean}
             */
            skipTorSupply: true,


            /* <------------------------------ vanilla ------------------------------> */


            underBullets: true,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_transmissionRod
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSingleSized: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_transmissionRod
         * @extends B_baseTorqueBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_transmissionRod")
        .initTemplate()
        .setParent(Wall.WallBuild)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_transmissionRod
             * @instance
             * @type {number}
             */
            rotProg: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_transmissionRod
             * @instance
             * @type {boolean}
             */
            isVerticalRod: false,


        })
        .setMethod({


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            draw: function() {
                comp_draw(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_transmissionRod
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


        }),


    ];
