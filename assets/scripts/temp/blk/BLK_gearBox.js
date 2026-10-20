/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_gearBox>} BLKGearBox
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_gearBox>} BGearBox
     * @prop {BLKGearBox} block
     */


    const PARENT = require("lovec/temp/blk/BLK_cogwheel");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKGearBox} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.topReg = fetchRegion(blk, "-top");
        blk.delegee.topInvReg = fetchRegion(blk, "-top-inv");
        blk.delegee.botReg = fetchRegion(blk, "-bot", "-bottom");
        // Make the cogwheel smaller since it's in a box
        blk.delegee.cogDrawW = blk.region.width * 2.0 * 0.96 / Vars.tilesize;
    };


    /**
     * @private
     * @param {BGearBox} b
     * @return {void}
     */
    function comp_draw(b) {
        Draw.rect(b.block.delegee.botReg, b.x, b.y);
        processZ(Layer.block + 1.0, 2);
        b.self.ex_drawCog();
        Draw.rect(b.block.delegee.topReg, b.x, b.y);
        if(b.delegee.isInv) {
            Draw.rect(b.block.delegee.topInvReg, b.x, b.y);
        };
        processZ(null, 2);
    };


    /**
     * @private
     * @param {BGearBox} b
     * @return {void}
     */
    function comp_ex_updateTorTransTargets(b) {
        b.proximity.each(
            ob => MDL_cond.isTransmissionRod(ob.block) ?
                ob.front() === b :
                false,
            ob => b.delegee.torTransTargets.push(ob),
        );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * The bridge between fluid torque and data torque, cogwheel and transmission rod.
         * @class BLK_gearBox
         * @extends BLK_cogwheel
         */
        newClass()
        .extendClass(PARENT[0], "BLK_gearBox")
        .initTemplate()
        .setParent("Wall")
        .setTags("blk-cog", "blk-cog-box", "blk-non-wall")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_gearBox
             * @instance
             * @type {TextureRegion}
             */
            topReg: null,
            /**
             * `INTERNAL`
             * @memberof BLK_gearBox
             * @instance
             * @type {TextureRegion}
             */
            topInvReg: null,
            /**
             * `INTERNAL`
             * @memberof BLK_gearBox
             * @instance
             * @type {TextureRegion}
             */
            botReg: null,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_gearBox
             * @instance
             * @type {boolean}
             */
            skipTorFetch: false,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_gearBox
             * @instance
             * @type {boolean}
             */
            skipTorSupply: false,


            /* <------------------------------ vanilla ------------------------------> */


            solid: false,
            underBullets: true,


        })
        .setMethod({


            load: function() {
                comp_load(this);
            },


        }),


        /**
         * @class B_gearBox
         * @extends B_cogwheel
         */
        newClass()
        .extendClass(PARENT[1], "B_gearBox")
        .initTemplate()
        .setParent("Wall.WallBuild")
        .setParam({})
        .setMethod({


            unitOn: function(unit) {
                // Do nothing
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            draw: function() {
                comp_draw(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * @override
             * @memberof B_gearBox
             * @instance
             * @func
             * @return {void}
             */
            ex_updateTorTransTargets: function() {
                comp_ex_updateTorTransTargets(this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
