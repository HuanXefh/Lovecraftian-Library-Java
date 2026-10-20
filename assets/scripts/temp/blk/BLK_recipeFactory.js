/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_recipeFactory>} BLKRecipeFactory
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_recipeFactory>} BRecipeFactory
     * @prop {BLKRecipeFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFactory");
    const INTF_BLK_recipeSelector = require("lovec/temp/intf/INTF_BLK_recipeSelector");
    const INTF_BLK_recipeHandler = require("lovec/temp/intf/INTF_BLK_recipeHandler");


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @type {Array<Class>}
     */
    const tmpIntfs = [];


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKRecipeFactory} blk
     * @return {void}
     */
    function comp_init(blk) {
        MOD_tmi.regisRc_recipeFactory(blk, blk.delegee.rcMdl);
    };


    /**
     * @private
     * @param {BLKRecipeFactory} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(Stat.output);
        stats.remove(Stat.productionTime);
        stats.add(Stat.productionTime, blk.craftTime / 60.0, StatUnit.seconds);
        stats.add(fetchStat("lovec", "blk0fac-recipes"), newStatValue(tb => {
            tb.row();

            if(blk.delegee.useAutoSelection) {
                MDL_table.br(tb, 1);
                tb.add(MDL_bundle.getInfo("lovec", "recipe-auto-selection")).left().padLeft(32.0).color(Pal.remove).row();
                MDL_table.br(tb, 1);
            };

            MDL_table.setRc(tb, blk);
            MDL_table.btn(tb, MDL_bundle.getTerm("lovec", "new-window"), () => {
                new CLS_window(
                    "${1} (${2})".format(fetchStat("lovec", "blk0fac-recipes").localized(), blk.localizedName),
                    tb1 => MDL_table.setRc(tb1, blk, true, true),
                ).add();
            }).row();
        }));

        if(!MDL_recipe.checkAnyPayOutput(blk.delegee.rcMdl)) {
            stats.remove(fetchStat("lovec", "blk0fac-payroom"));
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Lovec version of multi-crafter, the bedrock of Reindustrialization.
         * Only `ConsumePower` can be used, do not add any other consumers.
         * Crafter chaining is possible if an item/fluid exists in both input and output. Note that it's only stable for multi-crafters!
         * Recipe data should be set in {@link INTF_BLK_recipeHandler#rcMdl}.
         * @class BLK_recipeFactory
         * @extends BLK_baseFactory
         * @extends INTF_BLK_recipeSelector
         * @extends INTF_BLK_recipeHandler
         */
        newClass()
        .extendClass(PARENT[0], "BLK_recipeFactory")
        .implement(INTF_BLK_recipeSelector[0])
        .implement(INTF_BLK_recipeHandler[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags()
        .setParam({})
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


        }),


        /**
         * @class B_recipeFactory
         * @extends B_baseFactory
         * @extends INTF_B_recipeSelector
         * @extends INTF_B_recipeHandler
         */
        newClass()
        .extendClass(PARENT[1], "B_recipeFactory")
        .implement(INTF_BLK_recipeSelector[1])
        .implement(INTF_BLK_recipeHandler[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({})
        .setMethod({


            write: function(wr) {
                this.self.ex_processData(wr);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.self.ex_processData(rd);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof B_baseFactory
             * @instance
             * @func
             * @return {TextureRegion|null}
             */
            ex_getRcIcon: function() {
                return this.delegee.rc == null || this.delegee.rc.icon == null ?
                    null :
                    this.delegee.rc.icon.getRegion();
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];


    /**
     * @override
     * @param {ExtendObject} obj
     * @return {Array<Class>}
     */
    module.exports[1].getParentIntfs = function(obj) {
        tmpIntfs.clear();
        if(LCVersionResolver.isV8) {
            if(obj.blk$isErekirHeatConsumer) {
                tmpIntfs.push(eval("HeatConsumer"));
            };
            if(obj.blk$isErekirHeatProducer) {
                tmpIntfs.push(eval("HeatBlock"));
            };
        };
        return tmpIntfs;
    };
