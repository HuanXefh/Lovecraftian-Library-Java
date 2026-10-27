/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<ArmoredConveyor, BLK_armoredCable>} BLKArmoredCable
     */


    /**
     * @typedef {TemplateInstance<ArmoredConveyor.ArmoredConveyorBuild, B_armoredCable>} BArmoredCable
     * @prop {BLKArmoredCable} block
     */


    const PARENT = require("lovec/temp/blk/BLK_cable");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKArmoredCable} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.delegee.armoredCableUpdater = new BLKArmoredCableUpdater(blk);
    };


    /**
     * @private
     * @param {BArmoredCable} b
     * @param {Building} ob
     * @return {boolean}
     */
    function comp_conductsTo(b, ob) {
        return !MDL_cond.isArmoredCable(ob.block) ?
            (b.front() === ob || b.back() === ob) :
            (b.front() === ob || ob.front() === b);
    };


    /**
     * @private
     * @param {BArmoredCable} b
     * @param {BLKArmoredCable} blk
     * @param {Team} team
     * @return {void}
     */
    function comp_ex_justCreated(b, blk, team) {
        b.delegee.armoredCableBuildUpdater = new BArmoredCableUpdater(blk.delegee.armoredCableUpdater, b);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * {@link BLK_cable} but no side conductivity.
         * <br> `SINGLESIZE`
         * @class BLK_armoredCable
         * @extends BLK_cable
         */
        newClass()
        .extendClass(PARENT[0], "BLK_armoredCable")
        .initTemplate()
        .setParent("ArmoredConveyor")
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_armoredCable
             * @instance
             * @type {LCContentUpdater<ArmoredConveyor>}
             */
            armoredCableUpdater: null,


            /* <------------------------------ vanilla ------------------------------> */


            noSideBlend: true,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            blends: function() {
                return this.delegee.armoredCableUpdater.blends.apply(this.delegee.armoredCableUpdater, arguments);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            blendsArmored: function(t, rot, otx, oty, orot, oblk) {
                return this.delegee.armoredCableUpdater.blendsArmored.apply(this.delegee.armoredCableUpdater, arguments);
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class B_armoredCable
         * @extends B_cable
         */
        newClass()
        .extendClass(PARENT[1], "B_armoredCable")
        .initTemplate()
        .setParent("ArmoredConveyor.ArmoredConveyorBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_armoredCable
             * @instance
             * @type {LCBuildUpdater<ArmoredConveyor.ArmoredConveyorBuild, ArmoredConveyor>}
             */
            armoredCableBuildUpdater: null,


        })
        .setMethod({


            conductsTo: function(ob) {
                return comp_conductsTo(this, ob);
            }
            .setProp({
                boolMode: "and",
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_armoredCable
             * @instance
             * @func
             * @param {BLKArmoredCable} blk
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


        }),


    ];
