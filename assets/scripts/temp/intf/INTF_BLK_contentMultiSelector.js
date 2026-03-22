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
    blk.saveConfig = false;
    blk.clearOnDoubleTap = false;

    blk.config(JAVA.string, (b, str) => {
      b.ex_accCtTgs(str, false);
      EFF.placeFadePack[b.block.size].at(b);
      b.ex_onSelectorUpdate();
    });

    blk.config(JAVA.object_arr, (b, cfgArr) => {
      switch(cfgArr[0]) {
        case "selectorBlock" :
          let i = 1, iCap = cfgArr.iCap();
          while(i < iCap) {
            let ct = MDL_content._ct(cfgArr[i], null, true);
            if(ct != null) b.ex_accCtTgs(ct, true);
            i++;
          };
          EFF.placeFadePack[b.block.size].at(b);
          b.ex_onSelectorConfigLoad(cfgArr);
          break;

        case "selector" :
          b.ex_accCtTgs(cfgArr[1], cfgArr[2]);
          EFF.placeFadePack[b.block.size].at(b);
          b.ex_onSelectorUpdate();
          break;
      };
    });
  };


  function comp_buildConfiguration(b, tb) {
    b.ex_buildSelector(tb);

    tb.row();
    MDL_table.__btnCfg(tb, b, b => {
      b.configure("clear");
      b.deselect();
    }, VARGEN.icons.cross).tooltip(MDL_bundle._info("lovec", "tt-clear-selection"), true)
  };


  function comp_ex_buildSelector(b, tb) {
    MDL_table._s_ctMulti(
      tb, b.block, b.block.delegee.selectionQueue,
      () => b.ex_accCtTgs("read", false), val => b.configure(val), false,
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
     * Handles content multi-selection.
     * @class INTF_BLK_contentMultiSelector
     */
    new CLS_interface("INTF_BLK_contentMultiSelector", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_BLK_contentMultiSelector
         * @instance
         */
        selectionQueue: prov(() => []),


      }),


      init: function() {
        comp_init(this);
      },


      /**
       * See {@link INTF_BLK_contentSelector}.
       * @memberof INTF_BLK_contentMultiSelector
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
     * @class INTF_B_contentMultiSelector
     */
    new CLS_interface("INTF_B_contentMultiSelector", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>: Contents selected.
         * @memberof INTF_B_contentMultiSelector
         * @instance
         */
        ctTgs: prov(() => []),


      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return ["selectorBlock"]
        .pushAll(this.ctTgs.map(ct => ct == null ? "null" : ct.name))
        .toJavaArr(JAVA.object);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Use this method to add/remove a content from selected list.
       * @memberof INTF_B_contentMultiSelector
       * @instance
       * @param {string|UnlockableContent} param
       * @param {boolean} isAdd
       * @return {Array<UnlockableContent>}
       */
      ex_accCtTgs: function(param, isAdd) {
        switch(param) {
          case "read" :
            return this.ctTgs;
          case "clear" :
            this.block.lastConfig = "clear";
            return this.ctTgs.clear();
        };

        return isAdd ?
          this.ctTgs.pushUnique(param) :
          this.ctTgs.removeAll(param);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_contentMultiSelector
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
       * Called just after config from multi-selector is loaded.
       * <br> <LATER>
       * @memberof INTF_B_contentMultiSelector
       * @instance
       * @param {Array} cfgArr
       * @return {void}
       */
      ex_onSelectorConfigLoad: function(cfgArr) {

      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * See {@link INTF_B_contentSelector}.
       * <br> <LATER>
       * @memberof INTF_B_contentMultiSelector
       * @instance
       * @return {void}
       */
      ex_onSelectorUpdate: function() {

      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_contentMultiSelector
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd, this.LCRevi,

          (wr, revi) => {
            MDL_io._wr_cts(wr, this.ctTgs);
          },

          (rd, revi) => {
            MDL_io._rd_cts(rd, this.ctTgs);
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
