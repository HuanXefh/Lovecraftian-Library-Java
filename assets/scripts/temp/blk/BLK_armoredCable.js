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
     * @return {void}
     */
    function comp_created(b) {
        b.delegee.armoredCableBuildUpdater = new BArmoredCableUpdater(b.block.delegee.armoredCableUpdater, b);
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
        .setParent(ArmoredConveyor)
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_armoredCable
             * @instance
             * @type {ContentUpdater<ArmoredConveyor>}
             */
            armoredCableUpdater: null,


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
        .setParent(ArmoredConveyor.ArmoredConveyorBuild)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_armoredCable
             * @instance
             * @type {BuildUpdater<ArmoredConveyor.ArmoredConveyorBuild, ArmoredConveyor>}
             */
            armoredCableBuildUpdater: null,


        })
        .setMethod({


            created: function() {
                comp_created(this);
            },


            conductsTo: function(ob) {
                return comp_conductsTo(this, ob);
            }
            .setProp({
                boolMode: "and",
            }),


        }),


    ];
