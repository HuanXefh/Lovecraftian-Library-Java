/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_quadTreeHandler>} INTFBLKQuadTreeHandler
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_quadTreeHandler>} INTFBQuadTreeHandler
     * @prop {INTFBLKQuadTreeHandler} block
     */


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @param {ExtendObject} obj
     * @return {boolean}
     */
    function skipCondition(obj) {
        return obj.typeData != null && (obj.typeData.delegee.quadTreeTags == null || obj.typeData.delegee.quadTreeTags.length === 0);
    };


    /**
     * @private
     * @type {Array<string>}
     */
    const allQuadTreeTags = [];
    /**
     * @private
     * @type {ObjectMap<string, QuadTree<INTFBQuadTreeHandler>>}
     */
    const quadTreeMap = new ObjectMap();
    /**
     * @private
     * @type {ObjectMap<string, Seq<INTFBQuadTreeHandler>>}
     */
    const quadTreeSeqMap = new ObjectMap();


    /**
     * Gets all registered quad tree tags.
     * <br> `TEMP`: `INTF_BLK_quadTreeHandler`.
     * @return {Array<string>}
     */
    SLCTempMethods.getQuadTreeTags = function() {
        return allQuadTreeTags;
    };


    /**
     * Gets quad tree by tag.
     * <br> `TEMP`: `INTF_BLK_quadTreeHandler`.
     * @param {string} tag
     * @return {QuadTree<INTFBQuadTreeHandler>|null}
     */
    SLCTempMethods.getQuadTree = function(tag) {
        return quadTreeMap.get(tag);
    };


    /**
     * Gets quad tree elements as a seq by tag.
     * <br> `TEMP`: `INTF_BLK_quadTreeHandler`.
     * @param {string} tag
     * @return {Seq<INTFBQuadTreeHandler>|null}
     */
    SLCTempMethods.getQuadTreeSeq = function(tag) {
        return quadTreeSeqMap.get(tag);
    };


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Automatically inserts buildings into quad trees with matching tags.
         * <br> Trees can be accessed later by {@Link SLCTempMethods.getQuadTree}.
         * @class INTF_BLK_quadTreeHandler
         */
        new CLS_interface("INTF_BLK_quadTreeHandler", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_BLK_quadTreeHandler
                     * @instance
                     * @type {Array<string>|null}
                     */
                    quadTreeTags: null,


                };
            },


            init: function() {
                this.delegee.quadTreeTags.forEachFast(tag => {
                    allQuadTreeTags.pushUnique(tag);
                }, true);
                MDL_event.onWorldLoad(() => {
                    this.self.ex_initQuadTree();
                });
            }
            .setProp({
                skipCondition: function(obj) {
                    return obj.quadTreeTags == null || obj.quadTreeTags.length === 0;
                },
            }),


            /**
             * @memberof INTF_BLK_quadTreeHandler
             * @instance
             * @func
             * @return {void}
             */
            ex_initQuadTree: function() {
                let
                    quadTreeSeq,
                    bSeq;
                this.quadTreeTags.forEachFast(tag => {
                    quadTreeMap.put(tag, new QuadTree(GLB_var.world.getQuadBounds(new Rect())));
                    quadTreeSeq = quadTreeSeqMap.get(tag);
                    quadTreeSeq == null ?
                        (quadTreeSeq = quadTreeSeqMap.put(tag, new Seq())) :
                        quadTreeSeq.clear();
                    GLB_varGen.mainTeams.forEachFast(team => {
                        bSeq = team.data().buildingTypes.get(this);
                        if(bSeq != null) {
                            bSeq.each(ob => ob.self.ex_registerInQuadTree(tag));
                        };
                    }, true);
                }, true);
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class INTF_B_quadTreeHandler
         */
        new CLS_interface("INTF_B_quadTreeHandler", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_quadTreeHandler
                     * @instance
                     * @type {TDynamic<Array<string>>}
                     */
                    handledQuadTreeTags: tprov(() => []),


                };
            },


            placed: function() {
                this.block.delegee.quadTreeTags.forEachFast(tag => {
                    this.self.ex_registerInQuadTree(tag);
                }, true);
            }
            .setProp({
                skipCondition: skipCondition,
            }),


            onRemoved: function() {
                this.block.delegee.quadTreeTags.forEachFast(tag => {
                    this.self.ex_removeFromQuadTree(tag);
                }, true);
            }
            .setProp({
                skipCondition: skipCondition,
            }),


            pickedUp: function() {
                this.block.delegee.quadTreeTags.forEachFast(tag => {
                    this.self.ex_removeFromQuadTree(tag);
                }, true);
            }
            .setProp({
                skipCondition: skipCondition,
            }),


            dropped: function() {
                this.block.delegee.quadTreeTags.forEachFast(tag => {
                    this.self.ex_registerInQuadTree(tag);
                }, true);
            }
            .setProp({
                skipCondition: skipCondition,
            }),


            /**
             * `LATER`
             * @memberof INTF_B_quadTreeHandler
             * @instance
             * @func
             * @param {string} tag
             * @return {void}
             */
            ex_onQuadTreeRegister: function(tag) {

            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * `LATER`
             * @memberof INTF_B_quadTreeHandler
             * @instance
             * @func
             * @param {string} tag
             * @return {void}
             */
            ex_onQuadTreeRemove: function(tag) {

            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_B_quadTreeHandler
             * @instance
             * @func
             * @param {string} tag
             * @return {void}
             */
            ex_registerInQuadTree: function(tag) {
                if(this.self.ex_checkRegisteredInQuadTree(tag)) return;
                quadTreeMap.get(tag).insert(this);
                quadTreeSeqMap.get(tag).add(this);
                this.delegee.handledQuadTreeTags.pushUnique(tag);
                this.self.ex_onQuadTreeRegister(tag);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_B_quadTreeHandler
             * @instance
             * @func
             * @param {string} tag
             * @return {void}
             */
            ex_removeFromQuadTree: function(tag) {
                if(!this.self.ex_checkRegisteredInQuadTree(tag)) return;
                quadTreeMap.get(tag).remove(this);
                quadTreeSeqMap.get(tag).remove(this);
                this.delegee.handledQuadTreeTags.remove(tag);
                this.self.ex_onQuadTreeRemove(tag);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_B_quadTreeHandler
             * @instance
             * @func
             * @param {string} tag
             * @return {boolean}
             */
            ex_checkRegisteredInQuadTree: function(tag) {
                return this.delegee.handledQuadTreeTags.includes(tag);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


    ];
