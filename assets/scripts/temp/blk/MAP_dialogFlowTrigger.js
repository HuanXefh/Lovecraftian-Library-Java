/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, MAP_dialogFlowTrigger>} MAPDialogFlowTrigger
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_dialogFlowTrigger>} BDialogFlowTrigger
     * @prop {MAPDialogFlowTrigger} block
     */


    const PARENT = require("lovec/temp/blk/MAP_flagTrigger");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {MAPDialogFlowTrigger} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.group = BlockGroup.none;
        blk.update = true;
        blk.configurable = true;

        blk.config(JAVA.string, (b, str) => {
            b.delegee.nameDialFlow = str;
        });
    };


    /**
     * @private
     * @param {BDialogFlowTrigger} b
     * @return {boolean}
     */
    function comp_configTapped(b) {
        Vars.ui.showTextInput(
            MDL_bundle.getInfo("lovec", "dial-enter-dialog-flow-name"),
            MDL_bundle.getInfo("lovec", "dial-enter-dialog-flow-name", true),
            255,
            b.delegee.nameDialFlow,
            false,
            str => {
                String(str) !== "SPEC: read" ?
                    b.configure(str) :
                    Vars.ui.showErrorMessage(MDL_bundle.getInfo("lovec", "reserved-read"));
            },
            Function.air,
        );
        return false;
    };


    /**
     * @private
     * @param {BDialogFlowTrigger} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        if(!Vars.state.isEditor()) return;
        LCDrawf.textSelect(b, b.delegee.nameDialFlow, true);
    };


    /**
     * @private
     * @param {BDialogFlowTrigger} b
     * @return {void}
     */
    function comp_ex_onFlagTriggered(b) {
        MDL_ui.createFlow(b.delegee.nameDialFlow);
        if(Vars.state.isCampaign() && UTIL_dialogFlow.getNameCtMap().containsKey(b.delegee.nameDialFlow)) {
            UTIL_dialogFlow.getNameCtMap().get(b.delegee.nameDialFlow).unlock();
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Used to trigger a dialog flow in game.
         * <br> For example, if you have a trigger with "lovec-test" as the dialog flow name, you can trigger it by adding flag named "DIALOG: lovec-test".
         * @class MAP_dialogFlowTrigger
         * @extends MAP_flagTrigger
         */
        newClass()
        .extendClass(PARENT[0], "MAP_dialogFlowTrigger")
        .initTemplate()
        .setParent("Wall")
        .setTags("blk-non-wall")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof MAP_dialogFlowTrigger
             * @instance
             * @type {boolean}
             */
            triggerOnlyOnce: true,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof MAP_dialogFlowTrigger
             * @instance
             * @func
             * @param {BDialogFlowTrigger} b
             * @return {string}
             */
            ex_getFlagStr: function(b) {
                return "DIALOG: " + b.delegee.nameDialFlow;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_dialogFlowTrigger
         * @extends B_flagTrigger
         */
        newClass()
        .extendClass(PARENT[1], "B_dialogFlowTrigger")
        .initTemplate()
        .setParent("Wall.WallBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_dialogFlowTrigger
             * @instance
             * @type {string}
             */
            nameDialFlow: "lovec-test",


        })
        .setMethod({


            configTapped: function() {
                return comp_configTapped(this);
            }
            .setProp({
                noSuper: true,
            }),


            shouldShowConfigure: function(pl) {
                return Vars.state.isEditor();
            }
            .setProp({
                noSuper: true,
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            },


            write: function(wr) {
                wr.str(this.delegee.nameDialFlow);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.delegee.nameDialFlow = rd.str();
            },


            /**
             * `REALIZED`
             * @override
             * @memberof B_dialogFlowTrigger
             * @instance
             * @func
             * @return {void}
             */
            ex_onFlagTriggered: function() {
                comp_ex_onFlagTriggered(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
