/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<StorageBlock, BLK_coreRelay>} BLKCoreRelay
     */


    /**
     * @typedef {TemplateInstance<StorageBlock.StorageBuild, B_coreRelay>} BCoreRelay
     * @prop {BLKCoreRelay} block
     */


    const PARENT = require("lovec/temp/blk/BLK_container");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKCoreRelay} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.update = true;
    };


    /**
     * @private
     * @param {BLKCoreRelay} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.shootSe = fetchSound(blk.shootSe);
    };


    /**
     * @private
     * @param {BLKCoreRelay} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk-cd"), blk.delegee.itemSendCooldown / 60.0, StatUnit.seconds);
    };


    /**
     * @private
     * @param {BLKCoreRelay} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.addBar("lovec-cd", b => new Bar(
            prov(() => Core.bundle.format("bar.lovec-bar-cd-amt", Strings.fixed(b.delegee.itemSendCd / 60.0, 1) + " " + StatUnit.seconds.localized())),
            prov(() => GLB_color.ammo),
            () => (blk.delegee.itemSendCooldown - b.delegee.itemSendCd) / blk.delegee.itemSendCooldown,
        ));
    };


    /**
     * @private
     * @param {BCoreRelay} b
     * @return {void}
     */
    function comp_created(b) {
        b.delegee.itemSendCd = Mathf.random(b.block.delegee.itemSendCooldown);
    };


    /**
     * @private
     * @param {BCoreRelay} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.secTwo) {
            b.delegee.sendBCur = b.self.ex_findSendB();
        };
        if(b.delegee.sendBCur == null || !b.delegee.sendBCur.isAdded()) return;

        b.delegee.itemSendCd = Mathf.maxZero(b.delegee.itemSendCd - b.edelta());
        if(b.delegee.itemSendCd < 0.0001 && b.items.total() >= b.block.itemCapacity) {
            b.delegee.itemSendCd += b.block.delegee.itemSendCooldown;
            let amt_fi;
            b.items.each((item, amt) => {
                amt_fi = b.delegee.sendBCur.acceptStack(item, amt, b);
                if(amt_fi > 0) {
                    b.delegee.sendBCur.handleStack(item, amt_fi, b);
                    MDL_effect.line(b.x, b.y, null, b.delegee.sendBCur, item.color, 1.5, true, false);
                    MDL_effect.line(b.delegee.sendBCur.x, b.delegee.sendBCur.y, null, b, item.color, 1.5, true, true);
                    Fx.dynamicWave.at(b.x, b.y, b.block.size * Vars.tilesize * 0.75, item.color);
                    Fx.dynamicWave.at(b.delegee.sendBCur.x, b.delegee.sendBCur.y, b.delegee.sendBCur.block.size * Vars.tilesize * 0.75, item.color);
                    MDL_sound.playAt(b.x, b.y, b.block.delegee.shootSe);
                };
                b.items.remove(item, amt_fi);
            });
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * A container that actively puts items into nearest core.
         * @class BLK_coreRelay
         * @extends BLK_container
         */
        newClass()
        .extendClass(PARENT[0], "BLK_coreRelay")
        .initTemplate()
        .setParent("StorageBlock")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Cooldown between each round.
             * @memberof BLK_coreRelay
             * @instance
             * @type {number}
             */
            itemSendCooldown: 300.0,
            /**
             * `PARAM`: Sound played when items are sent.
             * @memberof BLK_coreRelay
             * @instance
             * @type {SoundGn}
             */
            shootSe: "se-shot-core-relay",


            /* <------------------------------ vanilla ------------------------------> */


            separateItemCapacity: false,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_coreRelay
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSwitchDisableTarget: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_coreRelay
         * @extends B_container
         */
        newClass()
        .extendClass(PARENT[1], "B_coreRelay")
        .initTemplate()
        .setParent("StorageBlock.StorageBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_coreRelay
             * @instance
             * @type {number}
             */
            itemSendCd: 0.0,
            /**
             * `INTERNAL`: Current target building to send items to.
             * @memberof B_coreRelay
             * @instance
             * @type {Building|null}
             */
            sendBCur: null,


        })
        .setMethod({


            created: function() {
                comp_created(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            /**
             * Gets target building.
             * @memberof B_coreRelay
             * @instance
             * @func
             * @return {Building|null}
             */
            ex_findSendB: function() {
                return this.closestCore();
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
