/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_buildingRecacheHandler>} INTFBLKBuildingRecacheHandler
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_buildingRecacheHandler>} INTFBBuildingRecacheHandler
     * @prop {INTFBLKBuildingRecacheHandler} block
     */


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @param {ExtendObject} obj
     * @return {boolean}
     */
    function skipConditionItem(obj) {
        return obj.typeData != null && (!obj.typeData.drawCached || !obj.typeData.hasItems || !obj.typeData.delegee.recacheForItem);
    };


    /**
     * @private
     * @param {ExtendObject} obj
     * @return {boolean}
     */
    function skipConditionFld(obj) {
        return obj.typeData != null && (!obj.typeData.drawCached || !obj.typeData.hasLiquids || !obj.typeData.delegee.recacheForFld);
    };


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Handles recaching of buildings when `blk.drawCached` is true.
         * @class INTF_BLK_buildingRecacheHandler
         */
        new CLS_interface("INTF_BLK_buildingRecacheHandler", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Whether to recache when an item is added or removed.
                     * @memberof INTF_BLK_buildingRecacheHandler
                     * @instance
                     * @type {boolean}
                     * @default false
                     */
                    recacheForItem: false,
                    /**
                     * `PARAM`: Whether to recache when a fluid is added or removed.
                     * @memberof INTF_BLK_buildingRecacheHandler
                     * @instance
                     * @type {boolean}
                     * @default false
                     */
                    recacheForFld: false,


                };
            },


        }),


        /**
         * @class INTF_B_buildingRecacheHandler
         */
        new CLS_interface("INTF_B_buildingRecacheHandler", {


            handleItem: function(b_f, item) {
                if(!Vars.headless) this.recache();
            }
            .setProp({
                skipCondition: skipConditionItem,
            }),


            handleStack: function(item, amt, e_f) {
                if(!Vars.headless) this.recache();
            }
            .setProp({
                skipCondition: skipConditionItem,
            }),


            itemTaken: function(item) {
                if(!Vars.headless) this.recache();
            }
            .setProp({
                skipCondition: skipConditionItem,
            }),


            removeStack: function(item, amt) {
                if(!Vars.headless) this.recache();
            }
            .setProp({
                skipCondition: skipConditionItem,
                mergeMode: function(valPrev, val) {
                    return valPrev;
                },
            }),


            dump: function(item) {
                if(!Vars.headless) this.recache();
            }
            .setProp({
                skipCondition: skipConditionItem,
                mergeMode: function(valPrev, val) {
                    return valPrev;
                },
            }),


            moveForward: function(item) {
                if(!Vars.headless) this.recache();
            }
            .setProp({
                skipCondition: skipConditionItem,
                mergeMode: function(valPrev, val) {
                    return valPrev;
                },
            }),


            handleLiquid: function(b_f, liq, amt) {
                if(!Vars.headless) this.recache();
            }
            .setProp({
                skipCondition: skipConditionFld,
            }),


            dumpLiquid: function(liq, amt) {
                if(!Vars.headless) this.recache();
            }
            .setProp({
                skipCondition: skipConditionFld,
            }),


            moveLiquid: function(b_t, liq) {
                if(!Vars.headless) this.recache();
            }
            .setProp({
                skipCondition: skipConditionFld,
                mergeMode: function(valPrev, val) {
                    return valPrev;
                },
            }),


            moveLiquidForward: function(b_t, liq) {
                if(!Vars.headless) this.recache();
            }
            .setProp({
                skipCondition: skipConditionFld,
                mergeMode: function(valPrev, val) {
                    return valPrev;
                },
            }),


            transferLiquid: function(b_t, amt, liq) {
                if(!Vars.headless) this.recache();
            }
            .setProp({
                skipCondition: skipConditionFld,
            }),


        }),


    ];
