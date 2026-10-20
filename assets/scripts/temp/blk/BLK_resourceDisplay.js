/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_resourceDisplay>} BLKResourceDisplay
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_resourceDisplay>} BResourceDisplay
     * @prop {BLKResourceDisplay} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseLogicBlock");
    const INTF_BLK_contentSelector = require("lovec/temp/intf/INTF_BLK_contentSelector");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKResourceDisplay} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.group = BlockGroup.none;
        blk.priority = TargetPriority.base;
        blk.drawCached = false;
        blk.drawDynamic = true;

        blk.self.ex_addLogicF(LogicProp.config, b => b.delegee.ctTarget);
        blk.self.ex_addLogicControl(LogicProp.config, (b, param1) => {
            if(param1 instanceof UnlockableContent || typeof param1 === "string") {
                b.configure(param1);
            };
        });
    };


    /**
     * @private
     * @param {BLKResourceDisplay} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.topReg = fetchRegion(blk, "-top");
    };


    /**
     * @private
     * @param {BResourceDisplay} b
     * @return {void}
     */
    function comp_draw(b) {
        LCDrawf.baseBuildingDraw(b);
        LCDraw.content(b.x, b.y, b.delegee.ctTarget, b.block.size - b.block.delegee.ctRegPad / Vars.tilesize);
        Draw.rect(b.block.delegee.topReg, b.x, b.y);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * A block that displays icon of the selected resource.
         * @class BLK_resourceDisplay
         * @extends BLK_baseLogicBlock
         * @extends INTF_BLK_contentSelector
         */
        newClass()
        .extendClass(PARENT[0], "BLK_resourceDisplay")
        .implement(INTF_BLK_contentSelector[0])
        .initTemplate()
        .setParent(Wall)
        .setTags("blk-non-wall")
        .setParam({


            /**
             * `PARAM`: Padding between content icon and the edge region.
             * @memberof BLK_resourceDisplay
             * @instance
             * @type {number}
             */
            ctRegPad: 2.0,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_resourceDisplay
             * @instance
             * @type {TextureRegion}
             */
            topReg: null,


            /* <------------------------------ vanilla ------------------------------> */


            solid: false,
            underBullets: true,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_resourceDisplay
             * @instance
             * @func
             * @return {Array<Resource>}
             */
            ex_findSelectionTargets: function() {
                return GLB_varGen.allRss;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_resourceDisplay
         * @extends B_baseLogicBlock
         * @extends INTF_B_contentSelector
         */
        newClass()
        .extendClass(PARENT[1], "B_resourceDisplay")
        .implement(INTF_BLK_contentSelector[1])
        .initTemplate()
        .setParent(Wall.WallBuild)
        .setParam({})
        .setMethod({


            draw: function() {
                comp_draw(this);
            }
            .setProp({
                noSuper: true,
            }),


            write: function(wr) {
                this.self.ex_processData(wr);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.self.ex_processData(rd);
            },


        }),


    ];
