/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    MDL_event.onLoadPost(() => {
      blk.selectionQueue.pushAll(blk.ex_findSelectionTargets());
    });

    blk.configurable = true;
    blk.saveConfig = true;
    blk.clearOnDoubleTap = true;

    blk.config(UnlockableContent, (b, ct) => {
      if(!blk.selectionQueue.includes(ct)) return;
      b.delegee.ctTarget = ct;
      b.ex_onSelectorUpdate();
    });
    blk.config(JAVA.string, (b, nameCt) => {
      let ct = MDL_content.getCt(nameCt, null, true);
      if(!blk.selectionQueue.includes(ct)) return;
      b.delegee.ctTarget = ct;
      b.ex_onSelectorUpdate();
    });

    blk.configClear(b => {
      b.delegee.ctTarget = null;
      b.ex_onSelectorUpdate();
    });
  };


  function comp_buildConfiguration(b, tb) {
    b.ex_buildSelector(tb);
  };


  function comp_ex_buildSelector(b, tb) {
    MDL_table.setCtSelect(
      tb, b.block, b.block.delegee.selectionQueue,
      () => b.delegee.ctTarget, val => b.configure(val == null ? null : val.name), false,
      b.block.selectionRows, b.block.selectionColumns,
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles content selection.
     * @class INTF_BLK_contentSelector
     */
    new CLS_interface("INTF_BLK_contentSelector", {


      __paramObjM__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof INTF_BLK_contentSelector
         * @instance
         */
        selectionQueue: tprov(() => []),


      }),


      init: function() {
        comp_init(this);
      },


      /**
       * Finds contents that can be selected for this block.
       * @memberof INTF_BLK_contentSelector
       * @instance
       * @return {Array<UnlockableContent>}
       */
      ex_findSelectionTargets: function() {
        return Vars.content.items().toArray();
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class INTF_B_contentSelector
     */
    new CLS_interface("INTF_B_contentSelector", {


      __paramObjM__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`: Selected content.
         * @memberof INTF_B_contentSelector
         * @instance
         */
        ctTarget: null,


      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return this.ctTarget == null ? "null" : this.ctTarget.name;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @memberof INTF_B_contentSelector
       * @instance
       * @param {Table} tb
       * @return {void}
       */
      ex_buildSelector: function(tb) {
        comp_ex_buildSelector(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Called when something is selected.
       * @memberof INTF_B_contentSelector
       * @instance
       * @return {void}
       */
      ex_onSelectorUpdate: function() {
        if(!Vars.headless && this.block.drawCached) this.recache();
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Call this method to draw icon of selected content.
       * @memberof INTF_B_contentSelector
       * @instance
       * @return {void}
       */
      ex_drawSelected: function() {
        LCDraw.contentIcon(this.x, this.y, this.ctTarget, this.block.size, 0.75);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_contentSelector
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd,

          wr => {
            MDL_io.ct(wr, this.ctTarget);
          },

          rd => {
            this.ctTarget = MDL_io.ct(rd);
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
