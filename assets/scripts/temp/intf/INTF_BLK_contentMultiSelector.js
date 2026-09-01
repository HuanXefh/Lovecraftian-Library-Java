/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.selectionQueue.pushAll(blk.ex_findSelectionTargets());

    blk.configurable = true;
    blk.saveConfig = false;
    blk.clearOnDoubleTap = false;

    blk.config(JAVA.string, (b, str) => {
      b.ex_accCtTargets(str, false);
      b.ex_onSelectorUpdate();
      EFF.fadePlacePack[blk.size].at(b);
    });

    blk.config(JAVA.object_arr, (b, cfgArr) => {
      switch(cfgArr[0]) {
        case "selectorBlock" :
          let i = 1, iCap = cfgArr.iCap();
          while(i < iCap) {
            let ct = MDL_content.getCt(cfgArr[i], null, true);
            if(ct != null) b.ex_accCtTargets(ct, true);
            i++;
          };
          b.ex_onSelectorConfigLoad(cfgArr);
          EFF.fadePlacePack[blk.size].at(b);
          break;

        case "selector" :
          b.ex_accCtTargets(cfgArr[1], cfgArr[2]);
          b.ex_onSelectorUpdate();
          EFF.fadePlacePack[blk.size].at(b);
          break;
      };
    });
  };


  function comp_updateTile(b) {
    b.ex_updateDisplayedCtTarget();
  };


  function comp_buildConfiguration(b, tb) {
    b.ex_buildSelector(tb);

    tb.row();
    MDL_table.btnCfg(tb, b, b => {
      b.configure("clear");
      b.deselect();
    }, VARGEN.icons.cross).tooltip(MDL_bundle.getInfo("lovec", "tt-clear-selection"), true)
  };


  function comp_ex_updateDisplayedCtTarget(b) {
    if(Vars.headless) return;

    b.displayedCtTarget = b.ctTargets.length === 0 ?
      null :
      b.ctTargets[Math.floor((Time.globalTime / PARAM.ICON_TAG_FLICKERING_INTERVAL) % b.ctTargets.length)];
  };


  function comp_ex_buildSelector(b, tb) {
    MDL_table.setCtSelectMulti(
      tb, b.block, b.block.delegee.selectionQueue,
      () => b.ex_accCtTargets("read", false), val => b.configure(val), false,
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


      __paramObjM__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof INTF_BLK_contentMultiSelector
         * @instance
         */
        selectionQueue: tprov(() => []),


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
      ex_findSelectionTargets: function() {
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


      __paramObjM__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`: Contents selected.
         * @memberof INTF_B_contentMultiSelector
         * @instance
         */
        ctTargets: tprov(() => []),
        /**
         * `INTERNAL`: Content displayed in {@link INTF_B_contentMultiSelector#ex_drawSelected}.
         * @memberof INTF_B_contentMultiSelector
         * @instance
         */
        displayedCtTarget: null,


      }),


      updateTile: function() {
        comp_updateTile(this);
      },


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return ["selectorBlock"]
        .pushAll(this.ctTargets.map(ct => ct == null ? "null" : ct.name))
        .toJavaArr(JAVA.object);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * Use this method to add/remove a content from selected list.
       * @memberof INTF_B_contentMultiSelector
       * @instance
       * @param {string|UnlockableContent} param
       * @param {boolean} isAdd
       * @return {Array<UnlockableContent>}
       */
      ex_accCtTargets: function(param, isAdd) {
        switch(param) {
          case "read" :
            return this.ctTargets;
          case "clear" :
            this.block.lastConfig = "clear";
            return this.ctTargets.clear();
        };

        return isAdd ?
          this.ctTargets.pushUnique(param) :
          this.ctTargets.removeAll(param);
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
       * <br> `LATER`
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
       * @memberof INTF_B_contentMultiSelector
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
       * @memberof INTF_B_contentMultiSelector
       * @instance
       * @return {void}
       */
      ex_updateDisplayedCtTarget: function() {
        comp_ex_updateDisplayedCtTarget(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Use this method to draw icon of selected contents alternately.
       * @memberof INTF_B_contentMultiSelector
       * @instance
       * @return {void}
       */
      ex_drawSelected: function() {
        LCDraw.contentIcon(this.x, this.y, this.displayedCtTarget, this.block.size, 0.75);
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
          wr0rd,

          wr => {
            MDL_io.cts(wr, this.ctTargets);
          },

          rd => {
            MDL_io.cts(rd, this.ctTargets);
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
