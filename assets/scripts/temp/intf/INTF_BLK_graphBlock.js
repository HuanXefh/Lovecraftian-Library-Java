/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    b.ex_updateGraph();
  };


  function comp_ex_updateGraph(b) {
    VARGEN.queueGraphUpdate(b.graphCur);
    if(TIMER.secFive) b.ex_updateGraphState();
  };


  function comp_ex_updateGraphState(b) {
    b.graphProximity.each(
      ob => ob.delegee.graphCur !== b.delegee.graphCur && ob.delegee.graphCur.getSize() >= b.graphCur.getSize(),
      ob => {
        ob.delegee.graphCur.merge(b.graphCur);
        b.graphCur = ob.delegee.graphCur;
      },
    );
    if(b.graphCur.graphData != null && !b.graphCur.graphData.justShrunk) {
      b.graphCur.graphData.justShrunk = true;
      Core.app.post(() => {
        b.graphCur.shrink((ob, vert) => ob.added && !ob.dead && !ob.isPayload());
        b.graphCur.graphData.justShrunk = false;
      });
    };
  };


  function comp_ex_updateGraphProximity(b) {
    b.graphProximity.clear();
    b.proximity.each(
      ob => b.ex_isSameGraphType(ob),
      ob => b.graphProximity.add(ob),
    );
    b.ex_updateGraphState();
    b.ex_updateGraphEdge();
  };


  function comp_ex_updateGraphEdge(b) {
    let vert_b = b.graphCur.getVertByData(b), vert_ob;
    b.graphProximity.each(ob => {
      vert_ob = b.graphCur.getVertByData(ob);
      if(b.block.delegee.isNoRotGraph || (!b.block.rotate && !ob.block.rotate)) {
        if(vert_ob === -1) {
          b.graphCur.addVert(ob);
          vert_ob = b.graphCur.getSize() - 1;
        };
        b.graphCur.addEdge(vert_b, vert_ob, b.block.ex_calcGraphDst(b, ob));
        b.graphCur.addEdge(vert_ob, vert_b, b.block.ex_calcGraphDst(ob, b));
      } else if(!b.block.rotate && ob.block.rotate) {
        if(ob.relativeTo(b) === ob.rotation) {
          if(vert_ob === -1) {
            b.graphCur.addVert(ob);
            vert_ob = b.graphCur.getSize() - 1;
          };
          b.graphCur.addEdge(vert_ob, vert_b, b.block.ex_calcGraphDst(ob, b));
        };
        if(b.relativeTo(ob) === ob.rotation) {
          if(vert_ob === -1) {
            b.graphCur.addVert(ob);
            vert_ob = b.graphCur.getSize() - 1;
          };
          b.graphCur.addEdge(vert_b, vert_ob, b.block.ex_calcGraphDst(b, ob));
        };
      } else if(b.block.rotate && !ob.block.rotate) {
        if(b.relativeTo(ob) === b.rotation) {
          if(vert_ob === -1) {
            b.graphCur.addVert(ob);
            vert_ob = b.graphCur.getSize() - 1;
          };
          b.graphCur.addEdge(vert_b, vert_ob, b.block.ex_calcGraphDst(b, ob));
        };
        if(ob.relativeTo(b) === b.rotation) {
          if(vert_ob === -1) {
            b.graphCur.addVert(ob);
            vert_ob = b.graphCur.getSize() - 1;
          };
          b.graphCur.addEdge(vert_ob, vert_b, b.block.ex_calcGraphDst(ob, b));
        };
      } else {
        if(MDL_cond._isNoSideBlock(ob.block) ? b.relativeTo(ob) === ob.rotation : ob.relativeTo(b) !== b.rotation) {
          if(vert_ob === -1) {
            b.graphCur.addVert(ob);
            vert_ob = b.graphCur.getSize() - 1;
          };
          b.graphCur.addEdge(vert_b, vert_ob, b.block.ex_calcGraphDst(b, ob));
        };
        if(MDL_cond._isNoSideBlock(ob.block) ? ob.relativeTo(b) === b.rotation : b.relativeTo(ob) !== ob.rotation) {
          if(vert_ob === -1) {
            b.graphCur.addVert(ob);
            vert_ob = b.graphCur.getSize() - 1;
          };
          b.graphCur.addEdge(vert_ob, vert_b, b.block.ex_calcGraphDst(ob, b));
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


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Determines how the graph is built and updated.
         * @memberof INTF_BLK_graphBlock
         * @instance
         */
        graphType: "test",
        /**
         * <PARAM>: If true, building rotation will be ignored when updating graph edges.
         * @memberof INTF_BLK_graphBlock
         * @instance
         */
        isNoRotGraph: false,


      }),


      /**
       * Calculates distance used in graph.
       * @memberof INTF_BLK_graphBlock
       * @instance
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


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>: Current graph of this building.
         * @memberof INTF_B_graphBlock
         * @instance
         */
        graphCur: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_graphBlock
         * @instance
         */
        graphProximity: prov(() => new Seq()),


      }),


      created: function() {
        this.graphCur = new MathGraph(1, this, true);
        this.graphCur.graphTag = this.block.delegee.graphType;
      },


      onProximityUpdate: function() {
        this.ex_updateGraphProximity();
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      /**
       * @memberof INTF_B_graphBlock
       * @instance
       * @return {void}
       */
      ex_updateGraph: function() {
        comp_ex_updateGraph(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_graphBlock
       * @instance
       * @return {void}
       */
      ex_updateGraphState: function() {
        comp_ex_updateGraphState(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_graphBlock
       * @instance
       * @return {void}
       */
      ex_updateGraphProximity: function() {
        comp_ex_updateGraphProximity(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_graphBlock
       * @instance
       * @return {void}
       */
      ex_updateGraphEdge: function() {
        comp_ex_updateGraphEdge(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_graphBlock
       * @instance
       * @return {boolean}
       */
      ex_isSameGraphType: function(ob) {
        return tryJsProp(ob.block, "graphType", null) === this.block.delegee.graphType;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
