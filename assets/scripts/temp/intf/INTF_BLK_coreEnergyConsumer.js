/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.useCep = DB_block.db["param"]["cep"]["use"].read(blk.name) != null;
  };


  function comp_setStats(blk) {
    let cepProv = FRAG_faci._cepProv(blk);
    if(cepProv > 0.0) blk.stats.add(fetchStat("lovec", "blk0misc-cepprov"), cepProv);
    let cepUse = FRAG_faci._cepUse(blk);
    if(cepUse > 0.0) blk.stats.add(fetchStat("lovec", "blk0misc-cepuse"), cepUse);
  };


  function comp_setBars(blk) {
    if(
      !(blk instanceof CoreBlock)
        && DB_block.db["param"]["cep"]["use"].read(blk.name) == null
        && DB_block.db["param"]["cep"]["prov"].read(blk.name) == null
    ) return;

    blk.addBar("lovec-cep", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-cep-amt", FRAG_faci._cepUseCur(b.team) + "/" + FRAG_faci._cepCapCur(b.team))),
      prov(() => FRAG_faci._cepFracCur(b.team) < 1.0 ? Pal.accent : Tmp.c1.set(Color.scarlet).lerp(Color.clear, Math.abs(Math.sin(Time.globalTime * 0.03)))),
      () => FRAG_faci._cepFracCur(b.team) > 1.0 ? 1.0 : Mathf.clamp(1.0 - FRAG_faci._cepFracCur(b.team)),
    ));
  };


  function comp_updateTile(b) {
    if(!b.block.delegee.useCep) return;

    if(TIMER.effc) {
      b.cepEffc = FRAG_faci._cepEffcCur(b.team);
    };
    if(TIMER.coreSignal && b.efficiency > 0.0 && b.shouldConsume()) {
      MDL_effect._e_coreSignal(b.x, b.y, b.team, b.block.size * 0.6 * Vars.tilesize);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(b.block.delegee.useCep) {
      b.efficiency *= b.cepEffc;
    };
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles core energy consumption and efficiency.
     * CEP parameters are set in {@link DB_block}.
     * @class INTF_BLK_coreEnergyConsumer
     */
    new CLS_interface("INTF_BLK_coreEnergyConsumer", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <INTERNAL>: Whether this block consumes or produces CEP.
         * @memberof INTF_BLK_coreEnergyConsumer
         * @instance
         */
        useCep: false,


      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


    }),


    /**
     * @class INTF_B_coreEnergyConsumer
     */
    new CLS_interface("INTF_B_coreEnergyConsumer", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <INTERNAL>: CEP efficiency.
         * @memberof INTF_B_coreEnergyConsumer
         * @instance
         */
        cepEffc: 1.0,


      }),


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      /**
       * @memberof INTF_B_coreEnergyConsumer
       * @instance
       * @return {void}
       */
      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
