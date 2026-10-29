/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


      /* <------------------------------ import ------------------------------> */


      /**
       * @typedef {TemplateInstance<LiquidJunction, BLK_fluidPressureValve>} BLKFluidPressureValve
       */


      /**
       * @typedef {TemplateInstance<LiquidJunction.LiquidJunctionBuild, B_fluidPressureValve>} BFluidPressureValve
       * @prop {BLKFluidPressureValve} block
       */


      const PARENT = require("lovec/temp/blk/BLK_fluidJunction");
      const INTF_BLK_pressureBlock = require("lovec/temp/intf/INTF_BLK_pressureBlock");


      /* <------------------------------ component ------------------------------> */


      /**
       * @private
       * @param {BLKFluidPressureValve} blk
       * @return {void}
       */
      function comp_init(blk) {
          blk.update = true;
          blk.rotate = true;
          blk.configurable = true;

          blk.config(JAVA.float, (b, f) => {
              b.delegee.presAllowFrac = f;
          });
      };


      /**
       * @private
       * @param {BLKFluidPressureValve} blk
       * @return {void}
       */
      function comp_load(blk) {
          blk.delegee.dirReg = fetchRegion(blk, "-dir", "-arrow");
      };


      /**
       * @private
       * @param {BFluidPressureValve} b
       * @return {void}
       */
      function comp_updateTile(b) {
          b.delegee.presExtra = Mathf.lerp(0.0, b.delegee.presTmp, 1.0 - b.delegee.presAllowFrac);
      };


      /**
       * @private
       * @param {BFluidPressureValve} b
       * @param {Building} b_f
       * @param {Liquid} liq
       * @return {Building|null}
       */
      function comp_getLiquidDestination(b, b_f, liq) {
          return !b.enabled || MDL_cond.isAuxiliaryFluid(liq) ?
              b :
              tryVal(b.front(), b);
      };


      /**
       * @private
       * @param {BFluidPressureValve} b
       * @param {Table} tb
       * @return {void}
       */
      function comp_buildConfiguration(b, tb) {
          tb.row();
          tb.table(Styles.black3, tb1 => {
              tb1.left();
              MDL_table.margin(tb1);
              MDL_table.sliderCfg(tb1, b, () => "${1}: ${2}".format(MDL_bundle.getTerm("lovec", b.delegee.presTmp < 0.0 ? "vacuum" : "pressure"), b.delegee.presAllowFrac.perc(0)), 0.0, 1.0, 0.05, b.delegee.presAllowFrac);
          })
          .left()
          .growX();
      };


      /**
       * @private
       * @param {BFluidPressureValve} b
       * @return {void}
       */
      function comp_draw(b) {
          Draw.rect(b.block.region, b.x, b.y);
          Draw.rect(b.block.delegee.dirReg, b.x, b.y, b.drawrot());
      };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * A fluid junction that controls pressure/vacuum.
         * <br> `SINGLESIZE`
         * @class BLK_fluidPressureValve
         * @extends BLK_fluidJunction
         * @extends INTF_BLK_pressureBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_fluidPressureValve")
        .implement(INTF_BLK_pressureBlock[0])
        .initTemplate()
        .setParent("LiquidJunction")
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_fluidPressureValve
             * @instance
             * @type {TextureRegion}
             */
            dirReg: null,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


        }),


        /**
         * @class B_fluidPressureValve
         * @extends B_fluidJunction
         * @extends INTF_B_pressureBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_fluidPressureValve")
        .implement(INTF_BLK_pressureBlock[1])
        .initTemplate()
        .setParent("LiquidJunction.LiquidJunctionBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_fluidPressureValve
             * @instance
             * @type {number}
             */
            presAllowFrac: 1.0,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            getLiquidDestination: function(b_f, liq) {
                return comp_getLiquidDestination(this, b_f, liq);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            config: function() {
                return this.delegee.presAllowFrac.toF();
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            buildConfiguration: function(tb) {
                comp_buildConfiguration(this, tb);
            }
            .setProp({
                noSuper: true,
            }),


            draw: function() {
                comp_draw(this);
            }
            .setProp({
                noSuper: true,
            }),


            write: function(wr) {
                this.self.ex_processData(wr);
                wr.f(this.delegee.presAllowFrac);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.self.ex_processData(rd);
                this.delegee.presAllowFrac = rd.f();
            },


            /**
             * `REALIZED`
             * @override
             * @memberof B_fluidPressureValve
             * @instance
             * @func
             * @param {Building} b_t
             * @return {number}
             */
            ex_getPresTransScl: function(b_t) {
                return this.delegee.presAllowFrac;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


        }),


    ];
