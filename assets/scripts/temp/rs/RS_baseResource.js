/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Resource, RS_baseResource>} RSBaseResource
     */


    const PARENT = CLS_contentTemplate;


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {RSBaseResource} rs
     * @return {void}
     */
    function comp_init(rs) {
        // Ensure that some fields are loaded
        rs.self.ex_getShortName();
        rs.self.ex_getIntmdTags();

        // Don't show resources that have no use
        MDL_event.onLoadDelay(30.0, () => {
            if(!global.lovecUtil.prop.debug && !MDL_cond.hasAnyRecipe(rs)) {
                rs.hidden = true;
            };
        });
    };


    /**
     * @private
     * @param {RSBaseResource} rs
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(rs, stats) {
        let shortName = LCDBFileHandler.read("resource-short-name", rs);
        if(shortName != null) {
            stats.add(fetchStat("lovec", "rs-shortname"), shortName);
        };
        let formula = LCDBFileHandler.read("resource-chemical-formula", rs);
        if(formula != null) {
            stats.add(fetchStat("lovec", "rs-formula"), formula);
        };

        // TODO: Remove this when Anuke decides to add external stats modification support
        stats.add(fetchStat("lovec", "spec-fromto"), newStatValue(tb => {
            tb.row();
            MDL_table.btnSmall(tb, "?", () => fetchDialog("rcDict").ex_show(rs.localizedName, rs, false)).left().padLeft(28.0).row();
        }));
    };


    /**
     * @private
     * @param {RSBaseResource} rs
     * @return {void}
     */
    function comp_loadIcon(rs) {
        // Use a new texture region to keep "ohno" intact
        if(!rs.fullIcon.found()) {
            rs.fullIcon = rs.uiIcon = new TextureRegion();
        };

        // Nightmare
        if(global.lovecUtil.prop.secretEnchanted) {
            rs.fullIcon.set(Core.atlas.find("lovec-gen-enchant-book"));
            rs.uiIcon.set(Core.atlas.find("lovec-gen-enchant-book"));
            return;
        };

        // If recolored sprite is created, use it instead
        if(rs.delegee.recolorRegStr != null) {
            let reg = Core.atlas.find(rs.name + "-recolor");
            rs.fullIcon.set(reg);
            rs.uiIcon.set(reg);
        };

        if(rs.delegee.skipIconTagGen) return;
        let iCap = rs.delegee.alts;
        if(iCap === 0) return;

        // Set up icon tag-based sprites
        let
            regs = [!String.isEmpty(rs.delegee.parentRegStr) ? Core.atlas.find(rs.delegee.parentRegStr) : Core.atlas.find(rs.name)],
            regInd;
        iCap.each(i => {
            regs.push(Core.atlas.find(rs.name + "-t" + (i + 1)));
        });
        MDL_event.onUpdate(() => {
            regInd = !GLB_param.SHOULD_SHOW_FLIKERING_ICON_TAG ?
                1 :
                Math.floor((Time.globalTime / GLB_param.ICON_TAG_FLICKERING_INTERVAL) % regs.length);

            rs.fullIcon.set(regs[regInd]);
            rs.uiIcon.set(regs[regInd]);
        });
    };


    /**
     * @private
     * @param {RSBaseResource} rs
     * @param {PackContext} packer
     * @return {void}
     */
    function comp_createIcons(rs, packer) {
        // `rs.intmdParent` is still a string at this moment
        let parent = !rs.delegee.useParentReg ? null : tryVal(rs.delegee.intmdParent, null);
        if(parent != null && !packer.has(parent)) {
            console.warn("[LOVEC] Can't find parent texture region:" + parent);
        };
        // Set resource color based on sprite color
        if(!rs.delegee.skipColorAssign) {
            rs.color = MDL_color.getIconColor(rs.color, packer, tryVal(parent, rs));
        };

        let pixBase = packer.get(tryVal(parent, rs.name));

        if(rs.delegee.recolorRegStr != null && parent != null && global.lovecUtil.prop.useRecolorSpr) {
            // Generate recolored sprite
            let pix = MDL_texture.recolorPix(
                packer.get(rs.delegee.recolorRegStr),
                packer.get(parent),
            );
            LCVersionResolver.isV8 ?
                packer.add(eval("MultiPacker.PageType.main"), rs.name + "-recolor", pix) :
                packer.add(rs.name + "-recolor", pix);
            pix.dispose();
            pixBase = packer.get(rs.name + "-recolor");
        } else {
            rs.delegee.recolorRegStr = null;
        };

        if(rs.delegee.skipIconTagGen) return;
        let tags = rs.self.ex_getIntmdTags();
        if(tags.length === 0) return;

        // Generate icon tag-based sprites
        let alts = 0, pixCombine;

        if(parent != null) {
            if(rs.delegee.recolorRegStr == null) {
                // No base sprite used for this intermediate, free unused space in atlas
                LCVersionResolver.isV8 ?
                    packer.add(eval("MultiPacker.PageType.main"), rs.name, LCAirObjects.pixmap) :
                    packer.add(rs.name, LCAirObjects.pixmap);
                rs.delegee.parentRegStr = parent;
            } else {
                // The base sprite is a recolored version
                rs.delegee.parentRegStr = rs.name + "-recolor";
            };
        };

        if(rs.delegee.recolorRegStr != null && parent != null) {
            // For recolored sprites, always use parent as the icon tag
            pixCombine = MDL_texture.stackPixWithCt(packer, pixBase, parent);
            LCVersionResolver.isV8 ?
                packer.add(eval("MultiPacker.PageType.main"), rs.name + "-t1", pixCombine) :
                packer.add(rs.name + "-t1", pixCombine);
            pixCombine.dispose();
            alts++;
            // No need to add dust icon tag if the sprite is a recolored dust
            tags = Array.air;
        };

        // Use icon sprite as the icon tag if found, for each intermediate tag
        let nameMod = MDL_content.getMod(rs), pixTag;
        if(nameMod != null) {
            tags.forEachFast(tag => {
                if(!packer.has(nameMod + "-rs0tag-" + tag)) return;
                pixTag = packer.get(nameMod + "-rs0tag-" + tag);
                pixCombine = MDL_texture.stackPix(pixBase, pixTag);
                LCVersionResolver.isV8 ?
                    packer.add(eval("MultiPacker.PageType.main"), rs.name + "-t" + (alts + 1), pixCombine) :
                    packer.add(rs.name + "-t" + (alts + 1), pixCombine);
                pixCombine.dispose();
                alts++;
            }, true);
        };

        // Extra resource sprites as icon tags, if used
        rs.delegee.extraIntmdParents.forEachFast(nameRs => {
            pixCombine = MDL_texture.stackPixWithCt(packer, pixBase, nameRs);
            LCVersionResolver.isV8 ?
                packer.add(eval("MultiPacker.PageType.main"), rs.name + "-t" + (alts + 1), pixCombine) :
                packer.add(rs.name + "-t" + (alts + 1), pixCombine);
            pixCombine.dispose();
            alts++;
        }, true);

        rs.delegee.alts = alts;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Items and liquids are both resource.
     * Resource in Lovec does not support animated sprite by default to allow icon tags.
     * @class RS_baseResource
     * @extends CLS_contentTemplate
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_baseResource")
    .initTemplate()
    .setParent(null)
    .setTags()
    .setParam({


        /**
         * `PARAM`: Whether to skip color assignment based on sprite.
         * @memberof RS_baseResource
         * @instance
         * @type {boolean}
         */
        skipColorAssign: false,
        /**
         * `PARAM`: Whether to skip icon tag generation to allow vanilla animated sprite.
         * @memberof RS_baseResource
         * @instance
         * @type {boolean}
         */
        skipIconTagGen: false,
        /**
         * `PARAM`: Whether to skip automatic reaction assignment.
         * @memberof RS_baseResource
         * @instance
         * @type {boolean}
         */
        skipReactionAssign: false,
        /**
         * `PARAM`: Whether to clear unnecessary vanilla stats for the resource (e.g. flammability will be shown only when larger than 0.0).
         * @memberof RS_baseResource
         * @instance
         * @type {boolean}
         */
        setupVanillaStat: true,
        /**
         * `PARAM`: Whether to automatically set values of some vanilla properties.
         * @memberof RS_baseResource
         * @instance
         * @type {boolean}
         */
        setupVanillaProp: true,


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`: Amount of sprites generated for icon tag.
         * @memberof RS_baseResource
         * @instance
         * @type {number}
         */
        alts: 0,
        /**
         * `INTERNAL`: Name of parent region. Set during icon generation.
         * @memberof RS_baseResource
         * @instance
         * @type {string}
         */
        parentRegStr: "",
        /**
         * `INTERNAL`: Expected short name for this resource. Used in name generation of intermediates.
         * @memberof RS_baseResource
         * @instance
         * @type {String|null}
         */
        shortName: null,
        /**
         * `INTERNAL`: Parent resource. Used for intermediates.
         * @memberof RS_baseResource
         * @instance
         * @type {string|UnlockableContent|null}
         */
        intmdParent: null,
        /**
         * `INTERNAL`: Generated from template tags.
         * @memberof RS_baseResource
         * @instance
         * @type {Array<string>}
         */
        intmdTags: null,
        /**
         * `INTERNAL`
         * @memberof RS_baseResource
         * @instance
         * @type {TDynamic<Array<string>>}
         */
        extraIntmdParents: tprov(() => []),
        /**
         * `INTERNAL`: If false, icon generation based on intermediate parent will be skipped.
         * @memberof RS_baseResource
         * @instance
         * @type {boolean}
         */
        useParentReg: false,
        /**
         * `INTERNAL`: Sprite used to gererate recolored sprite. Null to disable generation.
         * @memberof RS_baseResource
         * @instance
         * @type {String|null}
         */
        recolorRegStr: null,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        setStats: function(stats) {
            comp_setStats(this, getCtStats(this, stats));
        },


        loadIcon: function() {
            comp_loadIcon(this);
        },


        createIcons: function(packer) {
            comp_createIcons(this, packer);
        },


        /**
         * Gets shortened name for this resource.
         * For example, "NaOH" for sodium hydroxide.
         * <br> `DB`: `resource-short-name`.
         * <br> `DB`: `resource-chemical-formula`.
         * @memberof RS_baseResource
         * @instance
         * @func
         * @return {string}
         */
        ex_getShortName: function() {
            if(this.delegee.shortName == null) {
                this.delegee.shortName = LCDBFileHandler.read("resource-short-name", this, LCDBFileHandler.read("resource-chemical-formula", this, this.localizedName));
            };
            return this.delegee.shortName;
        }
        .setProp({
            noSuper: true,
        }),


        /**
         * Used for intermediate name generation.
         * @memberof RS_baseResource
         * @instance
         * @func
         * @return {void}
         */
        ex_generateIntmdName: function() {
            if(Vars.headless || this.delegee.intmdParent == null || this.delegee.intmdTags.length === 0) return;

            let str;
            if(this.delegee.intmdTags.length === 1 && DB_item.db["intmd"]["insertName"].colIncludes(this.delegee.intmdTags[0], 2)) {
                // For a single name to insert, use "main (type)" format
                str = this.delegee.intmdParent.localizedName + MDL_text.getSpace() + "(${1})".format(DB_item.db["intmd"]["insertName"].read(this.delegee.intmdTags[0], TmpStateTag.error.toString()));
            } else {
                // For regular intermediate, use "type (insert/main/sub)" format
                str = String(this.self.ex_getLocalizedIntmdName());
                let strs1 = [];
                DB_item.db["intmd"]["insertName"].forEachRow(2, (tag, str1) => {
                    if(this.delegee.intmdTags.includes(tag)) {
                        strs1.push(str1);
                    };
                }, true);
                if(strs1.length > 0) {
                    let strs = str.split("(");
                    if(strs.length !== 1) {
                        str = strs[0];
                        strs1.forEachFast(str1 => str += str1 + "/", true);
                        str += strs[1];
                    };
                };
            };

            MDL_content.rename(this, str);
        }
        .setProp({
            noSuper: true,
        }),


        /**
         * Gets intermediate tags of this resource.
         * @memberof RS_baseResource
         * @instance
         * @func
         * @return {Array<string>}
         */
        ex_getIntmdTags: function() {
            if(this.delegee.intmdTags == null) {
                this.delegee.intmdTags = this.delegee.tempTags.filter(tag => DB_item.db["intmd"]["tag"].includes(tag));
                DB_item.db["intmd"]["tagCheck"].forEachRow(2, (tag, boolF) => {
                    if(boolF(this)) {
                        this.delegee.intmdTags.pushUnique(tag)
                    };
                }, true);
                // Should not be stored in template tags anymore, for better performance
                this.delegee.tempTags.pullAll(this.delegee.intmdTags);
            };
            return this.delegee.intmdTags;
        }
        .setProp({
            noSuper: true,
        }),


        /**
         * Standard way to get localized name for intermediates.
         * @memberof RS_baseResource
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedIntmdName: function() {
            return this.self.ex_getLocalizedMainName() + MDL_text.getSpace() + "(${1})".format(this.self.ex_getLocalizedSubName());
        }
        .setProp({
            noSuper: true,
        }),


        /**
         * Gets main name for name generation of intermediates.
         * <br> `LATER`
         * @memberof RS_baseResource
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-mixture");
        }
        .setProp({
            noSuper: true,
        }),


        /**
         * Gets subsidiary name for name generation of intermediates.
         * Will try short name if possible.
         * @memberof RS_baseResource
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedSubName: function() {
            let str = tryFun(this.delegee.intmdParent.ex_getShortName, this.delegee.intmdParent, this.delegee.intmdParent.localizedName);
            this.delegee.extraIntmdParents.forEachFast(rs => str += " / " + tryFun(rs.ex_getShortName, rs, rs.localizedName), true);
            return str;
        }
        .setProp({
            noSuper: true,
        }),


    });
