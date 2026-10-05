/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_graphBlock>} INTFBLKGraphBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_graphBlock>} INTFBGraphBlock
     * @prop {INTFBLKGraphBlock} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBGraphBlock} b
     * @return {void}
     */
    function comp_updateTile(b) {
        b.self.ex_updateGraph();
    };


    /**
     * @private
     * @param {INTFBGraphBlock} b
     * @return {void}
     */
    function comp_ex_updateGraph(b) {
        UTIL_graph.queueUpdate(b.delegee.graphCur);
        if(GLB_timer.secFive) {
            b.self.ex_updateGraphState();
        };
    };


    /**
     * @private
     * @param {INTFBGraphBlock} b
     * @return {void}
     */
    function comp_ex_updateGraphState(b) {
        b.delegee.graphProximity.each(
            ob => ob.delegee.graphCur !== b.delegee.graphCur && ob.delegee.graphCur.getSize() >= b.delegee.graphCur.getSize(),
            ob => {
                ob.delegee.graphCur.merge(b.delegee.graphCur);
                b.delegee.graphCur = ob.delegee.graphCur;
            },
        );
        if(b.delegee.graphCur.graphData != null && !b.delegee.graphCur.graphData.justShrunk) {
            b.delegee.graphCur.graphData.justShrunk = true;
            Core.app.post(() => {
                b.delegee.graphCur.shrink((ob, vert) => !ob.ex_isExpiredVert());
                b.delegee.graphCur.shrink((ob, vert) => ob.isAdded() && !ob.isPayload());
                b.delegee.graphCur.graphData.justShrunk = false;
            });
        };
    };


    /**
     * @private
     * @param {INTFBGraphBlock} b
     * @return {void}
     */
    function comp_ex_updateGraphProximity(b) {
        b.delegee.graphProximity.clear();
        b.proximity.each(
            ob => b.self.ex_isSameGraphType(ob),
            ob => b.delegee.graphProximity.add(ob),
        );
        b.self.ex_updateGraphState();
        b.self.ex_updateGraphEdge();
    };


    /**
     * @private
     * @param {INTFBGraphBlock} b
     * @return {void}
     */
    function comp_ex_updateGraphEdge(b) {
        let vert_b = b.delegee.graphCur.getVertByData(b), vert_ob;
        if(vert_b === -1) return;
        b.delegee.graphProximity.each(ob => {
            vert_ob = b.delegee.graphCur.getVertByData(ob);
            if(b.block.delegee.isNoRotGraph || (!b.block.rotate && !ob.block.rotate)) {
                if(vert_ob === -1) {
                    b.delegee.graphCur.addVert(ob);
                    vert_ob = b.delegee.graphCur.getSize() - 1;
                };
                b.delegee.graphCur.addEdge(vert_b, vert_ob, b.block.self.ex_calcGraphDst(b, ob));
                b.delegee.graphCur.addEdge(vert_ob, vert_b, b.block.self.ex_calcGraphDst(ob, b));
            } else if(!b.block.rotate && ob.block.rotate) {
                if(ob.relativeTo(b) === ob.rotation) {
                    if(vert_ob === -1) {
                        b.delegee.graphCur.addVert(ob);
                        vert_ob = b.delegee.graphCur.getSize() - 1;
                    };
                    b.delegee.graphCur.addEdge(vert_ob, vert_b, b.block.self.ex_calcGraphDst(ob, b));
                };
                if(b.relativeTo(ob) === ob.rotation) {
                    if(vert_ob === -1) {
                        b.delegee.graphCur.addVert(ob);
                        vert_ob = b.delegee.graphCur.getSize() - 1;
                    };
                    b.delegee.graphCur.addEdge(vert_b, vert_ob, b.block.self.ex_calcGraphDst(b, ob));
                };
            } else if(b.block.rotate && !ob.block.rotate) {
                if(b.relativeTo(ob) === b.rotation) {
                    if(vert_ob === -1) {
                        b.delegee.graphCur.addVert(ob);
                        vert_ob = b.delegee.graphCur.getSize() - 1;
                    };
                    b.delegee.graphCur.addEdge(vert_b, vert_ob, b.block.self.ex_calcGraphDst(b, ob));
                };
                if(ob.relativeTo(b) === b.rotation) {
                    if(vert_ob === -1) {
                        b.delegee.graphCur.addVert(ob);
                        vert_ob = b.delegee.graphCur.getSize() - 1;
                    };
                    b.delegee.graphCur.addEdge(vert_ob, vert_b, b.block.self.ex_calcGraphDst(ob, b));
                };
            } else {
                if(MDL_cond.isNoSideBlock(ob.block) ? b.relativeTo(ob) === ob.rotation : ob.relativeTo(b) !== b.rotation) {
                    if(vert_ob === -1) {
                        b.delegee.graphCur.addVert(ob);
                        vert_ob = b.delegee.graphCur.getSize() - 1;
                    };
                    b.delegee.graphCur.addEdge(vert_b, vert_ob, b.block.self.ex_calcGraphDst(b, ob));
                };
                if(MDL_cond.isNoSideBlock(ob.block) ? ob.relativeTo(b) === b.rotation : b.relativeTo(ob) !== ob.rotation) {
                    if(vert_ob === -1) {
                        b.delegee.graphCur.addVert(ob);
                        vert_ob = b.delegee.graphCur.getSize() - 1;
                    };
                    b.delegee.graphCur.addEdge(vert_ob, vert_b, b.block.self.ex_calcGraphDst(ob, b));
                };
            };
        });
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * @class INTF_BLK_graphBlock
         */
        new CLS_interface("INTF_BLK_graphBlock", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Determines how the graph is built and updated. See {@link DB_misc.db.block.graph}.
                     * @memberof INTF_BLK_graphBlock
                     * @instance
                     * @type {string}
                     */
                    graphType: "test",
                    /**
                     * `PARAM`: If true, building rotation will be ignored when updating graph edges.
                     * @memberof INTF_BLK_graphBlock
                     * @instance
                     * @type {boolean}
                     */
                    isNoRotGraph: false,


                };
            },


            /**
             * Calculates distance used in graph.
             * @memberof INTF_BLK_graphBlock
             * @instance
             * @func
             * @param {Building} b
             * @param {Building} ob
             * @return {number}
             */
            ex_calcGraphDst: function(b, ob) {
                return b.dst(ob);
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class INTF_B_graphBlock
         */
        new CLS_interface("INTF_B_graphBlock", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Current graph of this building, null when just created. Graph is not initialized in the first frame!
                     * @memberof INTF_B_graphBlock
                     * @instance
                     * @type {MathGraph|null}
                     */
                    graphCur: null,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_graphBlock
                     * @instance
                     * @type {TDynamic<Seq<INTFBGraphBlock>>}
                     */
                    graphProximity: tprov(() => new Seq()),


                };
            },


            created: function() {
                this.delegee.graphCur = new MathGraph(1, this, true);
                this.delegee.graphCur.graphTag = this.block.delegee.graphType;
            },


            onProximityUpdate: function() {
                this.self.ex_updateGraphProximity();
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            /**
             * Updates graph of this building.
             * Graph will be updated only once in this frame.
             * @memberof INTF_B_graphBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updateGraph: function() {
                comp_ex_updateGraph(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Updates graph structure, removes expired vertrices.
             * @memberof INTF_B_graphBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updateGraphState: function() {
                comp_ex_updateGraphState(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Updates {@link INTF_B_graphBlock#graphProximity}.
             * @memberof INTF_B_graphBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updateGraphProximity: function() {
                comp_ex_updateGraphProximity(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Updates edges in the graph.
             * @memberof INTF_B_graphBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updateGraphEdge: function() {
                comp_ex_updateGraphEdge(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Whether this building shares the same graph type with another building.
             * @memberof INTF_B_graphBlock
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSameGraphType: function(ob) {
                return tryJsProp(ob.block, "graphType", null) === this.block.delegee.graphType;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * If true, this building will be removed from graph.
             * @memberof INTF_B_graphBlock
             * @instance
             * @return {boolean}
             */
            ex_isExpiredVert: function() {
                return !this.isAdded() || this.isPayload();
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
