/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_lootProducer>} INTFBLKLootProducer
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_lootProducer>} INTFBLootProducer
     * @prop {INTFBLKLootProducer} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKLootProducer} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.setupVanillaProp) {
            blk.drawArrow = blk.rotate;
        };

        blk.ex_addLogicF(LAccess.progress, b => b.ex_getCraftProg());
    };


    /**
     * @private
     * @param {INTFBLKLootProducer} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        if(!GLB_var.isMindustryX) {
            blk.addBar("lovec-prog", b => new Bar(
                prov(() => Core.bundle.format("bar.lovec-bar-prog-amt", b.ex_getCraftProg().perc(0))),
                prov(() => Pal.ammo),
                () => Mathf.clamp(b.ex_getCraftProg()),
            ));
        };
    };


    /**
     * @private
     * @param {INTFBLootProducer} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        if(!b.block.rotate) {
            b.lootDumpVec.set(b.x, b.y);
        } else {
            LCPos.getCoordsBack(b.lootDumpVec, b.x, b.y, b.block.size, b.rotation);
        };
    };


    /**
     * @private
     * @param {INTFBLootProducer} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.lootDumpVec.set(-1.0, -1.0);
    };


    /**
     * @private
     * @param {INTFBLootProducer} b
     * @param {Item} item
     * @return {void}
     */
    function comp_offload(b, item) {
        if(!b.ex_shouldDropLoot()) {
            b.super$offload(item);
            return;
        };
        if(b.lootDumpVec.x < 0.0 || b.lootDumpVec.y < 0.0) return;

        b.lootCharge++;
        if(b.lootCharge >= b.ex_getDumpAmt()) {
            b.lootCharge = 0;
            FRAG_item.produceLootAt(b.lootDumpVec.x, b.lootDumpVec.y, b, item, b.ex_getDumpAmt(), true);
        };
    };


    /**
     * @private
     * @param {INTFBLootProducer} b
     * @return {number}
     */
    function comp_ex_getCraftProg(b) {
        return !b.ex_shouldDropLoot() ?
            b.ex_getCraftTimeCur() / b.block.ex_getCraftTime() :
            (b.lootCharge * b.block.ex_getCraftTime() + b.ex_getCraftTimeCur()) / (b.block.itemCapacity * b.block.ex_getCraftTime());
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Makes a block possible to output loot instead of items.
         * @class INTF_BLK_lootProducer
         */
        new CLS_interface("INTF_BLK_lootProducer", {


            init: function() {
                comp_init(this);
            },


            setBars: function() {
                comp_setBars(this);
            },


            /**
             * Expected craft time of this block.
             * <br> `LATER`
             * @memberof INTF_BLK_lootProducer
             * @instance
             * @func
             * @return {number}
             */
            ex_getCraftTime: function() {
                return Number.n8;
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class INTF_B_lootProducer
         */
        new CLS_interface("INTF_B_lootProducer", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Loot dump position (absolute).
                     * @memberof INTF_B_lootProducer
                     * @instance
                     * @type {TDynamic<Vec2>}
                     */
                    lootDumpVec: tprov(() => new Vec2(-1.0, -1.0)),
                    /**
                     * `INTERNAL`: Increased by one when this building crafts. Loot is dumped when full item by default.
                     * @memberof INTF_B_lootProducer
                     * @instance
                     */
                    lootCharge: 0,


                };
            },


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            pickedUp: function() {
                comp_pickedUp(this);
            },


            offload: function(item) {
                comp_offload(this, item);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * If true, this building outputs loot instead of items.
             * Override this method for mixed output.
             * @memberof INTF_B_lootProducer
             * @instance
             * @func
             * @return {boolean}
             */
            ex_shouldDropLoot: function() {
                return true;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_lootProducer
             * @instance
             * @func
             * @return {number}
             */
            ex_getCraftProg: function() {
                return comp_ex_getCraftProg(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Expected time spent on current recipe.
             * <br> `LATER`
             * @memberof INTF_B_lootProducer
             * @instance
             * @func
             * @return {number}
             */
            ex_getCraftTimeCur: function() {
                return 0.0;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Expected amount of items to dump for each loot.
             * @memberof INTF_B_lootProducer
             * @instance
             * @func
             * @return {number}
             */
            ex_getDumpAmt: function() {
                return this.block.itemCapacity;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_lootProducer
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                processData(
                    wr0rd,
                    wr => {
                        wr.i(this.lootCharge);
                    },
                    rd => {
                        if(this.LCRevi === 5) return;
                        this.lootCharge = rd.i();
                    },
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


    ];
