/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_rawOreBlock>} BLKRawOreBlock
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_rawOreBlock>} BRawOreBlock
     * @prop {BLKRawOreBlock} block
     */


    const PARENT = require("lovec/temp/blk/BLK_partsBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKRawOreBlock} blk
     * @return {void}
     */
    function comp_loadIcon(blk) {
        blk.fullIcon = blk.uiIcon = fetchRegion(blk);
    };


    /**
     * @private
     * @param {BLKRawOreBlock} blk
     * @param {PackContext} packer
     * @return {void}
     */
    function comp_createIcons(blk, packer) {
        if(blk.delegee.recolorRegStr == null) return;
        let parent = blk.delegee.oreParent != null ?
            blk.delegee.oreParent :
            Object.keyByVal(LCDBFileHandler.getDataObj("item-payload-block"), blk.name, null);
        if(parent == null) return;

        let pix = MDL_texture.recolorPix(
            packer.get(blk.delegee.recolorRegStr),
            packer.get(parent),
        );
        SLCVersionResolver.isV8 ?
            packer.add(eval("MultiPacker.PageType.main"), blk.name, pix) :
            packer.add(blk.name, pix);
        pix.dispose();
    };


    /**
     * @private
     * @param {BLKRawOreBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.requirements.length !== 1) throw new Error("Raw ore block should have only one item material!");

        if(blk.delegee.oreParent == null) {
            let oreParent = Object.keyByVal(LCDBFileHandler.getDataObj("item-payload-block"), blk.name, null);
            if(oreParent != null) blk.delegee.oreParent = oreParent;
        };
        blk.delegee.oreParent = MDL_content.getCt(blk.delegee.oreParent, ContentGetModes.RS);

        if(blk.delegee.oreParent != null) {
            MDL_content.rename(blk, blk.delegee.oreParent.localizedName);
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Ore as payload block, usually produced by a drill.
         * See {@link BLK_baseDrill#shouldDropPay}.
         * <br> `NAMEGEN`
         * @class BLK_rawOreBlock
         * @extends BLK_partsBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_rawOreBlock")
        .initTemplate()
        .setParent("Wall")
        .setTags("blk-non-wall")
        .setParam({


            /**
             * `PARAM`: Ore item parent. If unset, this will be automatically set according to DB file.
             * <br> `DB`: item-payload-block.
             * @memberof BLK_rawOreBlock
             * @instance
             * @type {ContentGn}
             */
            oreParent: null,
            /**
             * `PARAM`: See {@link RS_baseResource#recolorRegStr}. Set this to null to disable sprite generation.
             * @memberof BLK_rawOreBlock
             * @instance
             * @type {String|null}
             */
            recolorRegStr: "lovec-gen-raw-ore-1",


            /* <------------------------------ vanilla ------------------------------> */


            placeSound: fetchSound("se-place-rock"),
            breakSound: fetchSound("SOUNDS: rockBreak"),


        })
        .setMethod({


            loadIcon: function() {
                comp_loadIcon(this);
            },


            createIcons: function(packer) {
                comp_createIcons(this, packer);
            },


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class B_rawOreBlock
         * @extends B_partsBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_rawOreBlock")
        .initTemplate()
        .setParent("Wall.WallBuild")
        .setParam({})
        .setMethod({}),


    ];
