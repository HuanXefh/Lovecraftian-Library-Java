/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.selectionColumns = 10;
    };

    blk.selectionQueue.pushAll(blk.ex_findSelectionTgs());

    blk.configurable = true;
    blk.saveConfig = true;
    blk.clearOnDoubleTap = true;

    blk.config(UnlockableContent, (b, ct) => {
      if(!blk.selectionQueue.includes(ct)) return;
      b.delegee.ctTg = ct;
      b.ex_onSelectorUpdate();
    });
    blk.config(JAVA.string, (b, nmCt) => {
      let ct = MDL_content._ct(nmCt, null, true);
      if(!blk.selectionQueue.includes(ct)) return;
      b.delegee.ctTg = ct;
      b.ex_onSelectorUpdate();
    });

    blk.configClear(b => {
      b.delegee.ctTg = null;
      b.ex_onSelectorUpdate();
    });
  };


  function comp_buildConfiguration(b, tb) {
    b.ex_buildSelector(tb);
  };


  function comp_ex_buildSelector(b, tb) {
    MDL_table._s_ct(
      tb, b.block, b.block.delegee.selectionQueue,
      () => b.delegee.ctTg, val => b.configure(val == null ? null : val.name), false,
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


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_BLK_contentSelector
         * @instance
         */
        selectionQueue: prov(() => []),


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
      ex_findSelectionTgs: function() {
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


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>: Selected content.
         * @memberof INTF_B_contentSelector
         * @instance
         */
        ctTg: null,


      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return this.ctTg == null ? "null" : this.ctTg.name;
      }
      .setProp({
        noSuper: true,
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
       * <br> <LATER>
       * @memberof INTF_B_contentSelector
       * @instance
       * @return {void}
       */
      ex_onSelectorUpdate: function() {

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
          wr0rd, this.LCRevi,

          (wr, revi) => {
            MDL_io._wr_ct(wr, this.ctTg);
          },

          (rd, revi) => {
            this.ctTg = MDL_io._rd_ct(rd);
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
