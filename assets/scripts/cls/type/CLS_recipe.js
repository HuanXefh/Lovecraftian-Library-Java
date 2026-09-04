/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <---------- meta ----------> */


    /**
     * Parsed recipe data.
     * @class
     * @param {Block} blk
     * @param {RecipeModule} rcMdl
     * @param {string} rcHeader
     * @param {boolean|unset} [useAutoSelection]
     */
    const CLS_recipe = newClass().initClass();


    CLS_recipe.prototype.init = function(blk, rcMdl, rcHeader, useAutoSelection) {


        /** @type {Block} */
        this.owner = blk;
        /** @type {RecipeModule} */
        this.rcMdl = rcMdl;
        /** @type {string} */
        this.rcHeader = String(rcHeader);
        /** @type {string} */
        this.name = CLS_recipe.getName(this.owner, this.rcHeader);
        /** @type {boolean} */
        this.useAutoSelection = Boolean(useAutoSelection);

        /** @type {boolean} */
        this.hasInit = false;
        this.initData();

        /** @type {boolean} */
        this.__isEmptyRc__ = false;
        /** @type {ObjectMap<ResourceGn, boolean>} */
        this.inputRsBoolMap = new ObjectMap();
        /** @type {ObjectMap<ResourceGn, boolean>} */
        this.outputRsBoolMap = new ObjectMap();


        if(this.rcHeader === "SPEC: empty") {
            this.__isEmptyRc__ = true;
            blkEmptyRcMap.put(this.owner, this);
        } else {
            if(nameRcMap.containsKey(this.name)) {
                console.warn("[LOVEC] Recipe name ${1} already used!".format(this.name.color(Pal.accent)));
            };
            nameRcMap.put(this.name, this);
            if(!blkRcsMap.containsKey(this.owner)) {
                blkRcsMap.put(this.owner, []);
            };
            blkRcsMap.get(this.owner).push(this);
        };

        if(!blkCategHeaderObjMap.containsKey(this.owner)) {
            blkCategHeaderObjMap.put(this.owner, MDL_recipe.getCategHeaderObj(this.rcMdl));
        };


    };


    /** @type {ObjectMap<string, CLS_recipe>} */
    const nameRcMap = new ObjectMap();
    /** @type {ObjectMap<Block, Array<CLS_recipe>>} */
    const blkRcsMap = new ObjectMap();
    /** @type {ObjectMap<Block, CLS_recipe>} */
    const blkEmptyRcMap = new ObjectMap();
    /** @type {ObjectMap<Block, Object<string, string>>} */
    const blkCategHeaderObjMap = new ObjectMap();
    /** @type {Array<CLS_recipe>} */
    const incompleteRcs = [];
    /** @type {Array<CLS_recipe>} */
    const nodeLockedRcs = [];
    /** @type {ObjectMap<UnlockableContent, Array<CLS_recipe>>} */
    const nodeRcsMap = new ObjectMap();
    /** @type {number} */
    let rcCount = 0;
    /** @type {number} */
    let rcIncompleteCount = 0;


    MDL_event.onLoadDelayTask(VAR.delay.load.logRcRegis, () => {
        console.log("[LOVEC] Registered ${1} recipe(s) in total.".format(rcCount.color(Pal.accent)));
        if(rcIncompleteCount > 0) {
            console.log("[LOVEC] ${1} recipe(s) are incomplete!".format(rcIncompleteCount.color(Pal.accent)));
        };

        let str = new Date().toLocaleDateString();
        incompleteRcs.forEachFast(rc => {
            str += "\n\n\n";
            str += rc.name;
            str += "\n";
            rc.erroredNames.forEachFast(name => {
                str += "\n- " + name;
            }, true);
        }, true);
        MDL_file.commonCache.child("temp").child("incompleteRecipes.log").writeString(str);
    });


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


    /* <------------------------------ property ------------------------------ */

    /**
     * Gets recipe by recipe header.
     * @param {Block} blk
     * @param {string} rcHeader
     * @return {CLS_recipe}
     */
    CLS_recipe.get = function(blk, rcHeader) {
        rcHeader = String(rcHeader);
        if(rcHeader === "SPEC: empty" || !MDL_recipe.checkHeaderValid(blk.delegee.rcMdl, rcHeader)) {
            return CLS_recipe.getEmptyRc(blk);
        };
        let rc = nameRcMap.get(CLS_recipe.getName(blk, rcHeader));
        if(rc == null) throw new Error("Cannot find recipe with header ${1} in ${2}!".format(rcHeader, blk.name));
        return rc;
    };


    /**
     * Gets empty recipe for some block.
     * @param {Block} blk
     * @return {CLS_recipe}
     */
    CLS_recipe.getEmptyRc = function(blk) {
        let rc = blkEmptyRcMap.get(blk);
        if(rc == null) throw new Error("No empty recipe found for ${1}, it may be unregistered!".format(blk.name));
        return rc;
    };


    /**
     * Gets name for a recipe.
     * @param {Block} blk
     * @param {string} rcHeader
     * @return {string}
     */
    CLS_recipe.getName = function(blk, rcHeader) {
        return blk.name + " | " + rcHeader;
    };


    /**
     * Gets the name-recipe map.
     * @return {ObjectMap}
     */
    CLS_recipe.getNameRcMap = function() {
        return nameRcMap;
    };


    /**
     * Gets the block-names map.
     * @return {ObjectMap}
     */
    CLS_recipe.getBlkRcsMap = function() {
        return blkRcsMap;
    };


    /**
     * Gets the block-category-header-object map.
     * @return {ObjectMap}
     */
    CLS_recipe.getBlkCategHeaderObjMap = function() {
        return blkCategHeaderObjMap;
    };


    /**
     * Gets all incomplete recipes.
     * @return {Array<CLS_recipe>}
     */
    CLS_recipe.getIncompleteRcs = function() {
        return incompleteRcs;
    };


    /**
     * Gets all recipes locked by tech nodes. See {@link DBCT_techNodeContent}.
     * @return {Array<CLS_recipe>}
     */
    CLS_recipe.getNodeLockedRcs = function() {
        return nodeLockedRcs;
    };


    /**
     * Gets the tech node-recipes map.
     * @return {ObjectMap}
     */
    CLS_recipe.getNodeRcsMap = function() {
        return nodeRcsMap;
    };


    /* <------------------------------ condition ------------------------------ */


    /**
     * Whether some resource is an input material in given recipe.
     * @param {CLS_recipe} rc
     * @param {ResourceGn} rs_gn
     * @return {boolean}
     */
    CLS_recipe.checkInput = function(rc, rs_gn) {
        let rs = MDL_content.getCt(rs_gn, "rs");
        if(rs == null) return false;

        let
            i,
            iCap,
            j,
            jCap,
            tmp,
            tmp1;

        // CI
        i = 0;
        iCap = rc.ci.iCap();
        while(i < iCap) {
            tmp = rc.ci[i];
            if(tmp.id === rs.id) {
                return true;
            } else if(tmp instanceof Array) {
                j = 0;
                jCap = tmp.iCap();
                while(j < jCap) {
                    tmp1 = tmp[j];
                    if(tmp1.id === rs.id) return true;
                    j += 2;
                };
            };
            i += 2;
        };

        // BI
        i = 0;
        iCap = rc.bi.iCap();
        while(i < iCap) {
            tmp = rc.bi[i];
            if(tmp.id === rs.id) {
                return true;
            } else if(tmp instanceof Array) {
                j = 0;
                jCap = tmp.iCap();
                while(j < jCap) {
                    tmp1 = tmp[j];
                    if(tmp1.id === rs.id) return true;
                    j += 3;
                };
            };
            i += 3;
        };

        // AUX
        i = 0;
        iCap = rc.aux.iCap();
        while(i < iCap) {
            tmp = rc.aux[i];
            if(tmp.id === rs.id) return true;
            i += 2;
        };

        // OPT
        i = 0;
        iCap = rc.opt.iCap();
        while(i < iCap) {
            tmp = rc.opt[i];
            if(tmp.id === rs.id) return true;
            i += 4;
        };

        return false;
    };


    /**
     * Whether some resource is an output material in given recipe.
     * @param {CLS_recipe} rc
     * @param {ResourceGn} rs_gn
     * @return {boolean}
     */
    CLS_recipe.checkOutput = function(rc, rs_gn) {
        let rs = MDL_content.getCt(rs_gn, "rs");
        if(rs == null) return false;

        let
            i,
            iCap,
            tmp;

        // CO
        i = 0;
        iCap = rc.co.iCap();
        while(i < iCap) {
            tmp = rc.co[i];
            if(tmp.id === rs.id) return true;
            i += 2;
        };

        // BO
        i = 0;
        iCap = rc.bo.iCap();
        while(i < iCap) {
            tmp = rc.bo[i];
            if(tmp.id === rs.id) return true;
            i += 3;
        };

        // FO
        i = 0;
        iCap = rc.fo.iCap();
        while(i < iCap) {
            tmp = rc.fo[i];
            if(tmp.id === rs.id) return true;
            i += 3;
        };

        return false;
    };


    /**
     * Whether given recipe has any payload input.
     * @param {CLS_recipe} rc
     * @return {boolean}
     */
    CLS_recipe.checkAnyPayInput = function(rc) {
        return rc.payi.length > 0;
    };


    /**
     * Whether given recipe has any item output.
     * @param {CLS_recipe} rc
     * @return {boolean}
     */
    CLS_recipe.checkAnyItemOutput = function(rc) {
        let
            i,
            iCap;

        // FO
        if(rc.fo.length > 0) return true;

        // BO
        i = 0;
        iCap = rc.bo.iCap();
        while(i < iCap) {
            if(rc.bo[i] instanceof Item && rc.bo[i + 1] > 0) return true;
            i += 3;
        };

        return false;
    };


    /**
     * Whether given recipe has any liquid output.
     * @param {CLS_recipe} rc
     * @param {boolean|unset} [includeAux]
     * @return {boolean}
     */
    CLS_recipe.checkAnyFldOutput = function(rc, includeAux) {
        let
            i,
            iCap,
            tmp;

        // CO
        i = 0;
        iCap = rc.co.iCap();
        while(i < iCap) {
            tmp = rc.co[i];
            if(!MDL_cond.isAuxiliaryFluid(tmp)) {
                if(rc.co[i + 1] > 0.0) return true;
            } else {
                if(includeAux && rc.co[i + 1] > 0.0) return true;
            };
            i += 2;
        };

        // BO
        i = 0;
        iCap = rc.bo.iCap();
        while(i < iCap) {
            tmp = rc.bo[i];
            if(tmp instanceof Liquid) {
                if(!MDL_cond.isAuxiliaryFluid(tmp)) {
                    if(rc.bo[i + 1] > 0.0) return true;
                } else {
                    if(includeAux && rc.bo[i + 1] > 0.0) return true;
                };
            };
            i += 3;
        };

        return false;
    };



    /**
     * Whether given recipe has any payload output.
     * @param {CLS_recipe} rc
     * @return {boolean}
     */
    CLS_recipe.checkAnyPayOutput = function(rc) {
        return rc.payo.length > 0;
    };


    /* <------------------------------ util ------------------------------ */


    /**
     * Gets all fluids found in inputs.
     * @param {Array|unset} contArr
     * @param {CLS_recipe} rc
     * @return {Array<Liquid>}
     */
    CLS_recipe.getInputFlds = function(contArr, rc) {
        let arr = contArr != null ? contArr.clear() : [];
        let
            i,
            iCap,
            j,
            jCap,
            tmp,
            tmp1;

        // CI
        i = 0;
        iCap = rc.ci.iCap();
        while(i < iCap) {
            tmp = rc.ci[i];
            if(!(tmp instanceof Array)) {
                if(rc.ci[i + 1] > 0.0) arr.pushUnique(tmp);
            } else {
                j = 0;
                jCap = tmp.iCap();
                while(j < jCap) {
                    if(tmp[j + 1] > 0.0) arr.pushUnique(tmp[j]);
                    j += 2;
                };
            };
            i += 2;
        };

        // BI
        i = 0;
        iCap = rc.bi.iCap();
        while(i < iCap) {
            tmp = rc.bi[i];
            if(!(tmp instanceof Array)) {
                if(tmp instanceof Liquid && rc.bi[i + 1] > 0.0) arr.pushUnique(tmp);
            } else {
                j = 0;
                jCap = tmp.iCap();
                while(j < jCap) {
                    tmp1 = tmp[j];
                    if(tmp1 instanceof Liquid && tmp[j + 1] > 0.0) arr.pushUnique(tmp1);
                    j += 3;
                };
            };
            i += 3;
        };

        // AUX
        i = 0;
        iCap = rc.aux.iCap();
        while(i < iCap) {
            if(rc.aux[i + 1] > 0.0) arr.pushUnique(rc.aux[i]);
            i += 2;
        };

        return arr;
    };


    /**
     * Gets all fluids found in outputs.
     * @param {Array|unset} contArr
     * @param {CLS_recipe} rc
     * @return {Array<Liquid>}
     */
    CLS_recipe.getOutputFlds = function(contArr, rc) {
        let arr = contArr != null ? contArr.clear() : [];
        let
            i,
            iCap,
            tmp;

        // CO
        i = 0;
        iCap = rc.co.iCap();
        while(i < iCap) {
            if(rc.co[i + 1] > 0.0) arr.pushUnique(rc.co[i]);
            i += 2;
        };

        // BO
        i = 0;
        iCap = rc.bo.iCap();
        while(i < iCap) {
            tmp = rc.bo[i];
            if(tmp instanceof Liquid && rc.bo[i + 1] > 0.0) arr.pushUnique(tmp);
            i += 3;
        };

        return arr;
    };


    /**
     * Gets a 2-tuple of items and fluids to dump.
     * CO not included due to `liquidOutputDirections`.
     * @param {Array|unset} contTup
     * @param {CLS_recipe} rc
     * @return {[Array<Item>, Array<Liquid>]}
     */
    CLS_recipe.getDumpTup = function(contTup, rc) {
        let tup = contTup != null ? contTup : [[], []];
        tup[0].clear();
        tup[1].clear();

        let
            i,
            iCap,
            tmp;

        // BO
        i = 0;
        iCap = rc.bo.iCap();
        while(i < iCap) {
            tmp = rc.bo[i];
            if(rc.owner.hasItems && tmp instanceof Item) tup[0].pushUnique(tmp);
            if(rc.owner.hasLiquids && tmp instanceof Liquid) tup[1].pushUnique(tmp);
            i += 3;
        };

        // FO
        if(rc.owner.hasItems) {
            i = 0;
            iCap = rc.fo.iCap();
            while(i < iCap) {
                tup[0].pushUnique(rc.fo[i]);
                i += 3;
            };
        };

        return tup;
    };


    /**
     * Registers recipes in a multi-crafter block.
     * @param {Block} blk
     * @param {RecipeModule} rcMdl
     * @return {void}
     */
    CLS_recipe.register = function(blk, rcMdl) {
        MDL_event.onLoadPost(() => {
            MDL_recipe.initRc(blk.rcMdl, blk);
            new CLS_recipe(blk, rcMdl, "SPEC: empty");
            MDL_recipe.getRcHeaders(rcMdl).forEachFast(rcHeader => {
                new CLS_recipe(blk, rcMdl, rcHeader, blk.delegee.useAutoSelection);
                rcCount++;
            }, true);
        });
    };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


    /* <------------------------------ condition ------------------------------ */


    /**
     * Variant of {@link CLS_recipe.checkInput} for instances, faster.
     */
    CLS_recipe.prototype.checkInput = function(rs_gn) {
        let bool = this.inputRsBoolMap.get(rs_gn);
        if(bool != null) return bool;

        bool = CLS_recipe.checkInput(this, rs_gn);
        this.inputRsBoolMap.put(rs_gn, bool);

        return bool;
    };


    /**
     * Variant of {@link CLS_recipe.checkOutput} for instances, faster.
     */
    CLS_recipe.prototype.checkOutput = function(rs_gn) {
        let bool = this.outputRsBoolMap.get(rs_gn);
        if(bool != null) return bool;

        bool = CLS_recipe.checkOutput(this, rs_gn);
        this.outputRsBoolMap.put(rs_gn, bool);

        return bool;
    };


    /* <------------------------------ modification ------------------------------ */


    /**
     * Initialize recipe data.
     * @lovecPropGen {@link CLS_recipe}
     * @return {this}
     */
    CLS_recipe.prototype.initData = function() {
        if(this.hasInit) throw new Error("Double initialization!");
        this.hasInit = true;

        /* meta info */

        /** @type {boolean} */
        this.isGen = MDL_recipe.checkIsGen(this.rcMdl, this.rcHeader);
        /** @type {boolean} */
        this.isIncomplete = MDL_recipe.checkIsIncomplete(this.rcMdl, this.rcHeader);
        /** @type {Array<string>} */
        this.erroredNames = MDL_recipe.getRcVal(this.rcMdl, this.rcHeader, "erroredNames", Array.air);
        /** @type {string|null} */
        this.tt = MDL_recipe.getTooltip(this.rcMdl, this.rcHeader);

        /* icon */

        /** @type {TextureRegionDrawable|null} */
        this.icon = null;
        /** @type {TextureRegionDrawable|null} */
        this.lockedIcon = null;
        /** @type {TextureRegionDrawable|null} */
        this.altIcon = null;
        /** @type {string} */
        this.rcIconName = MDL_recipe.getIconName(this.rcMdl, this.rcHeader);

        if(!Vars.headless) {
            // This have to be delayed, WTF
            Time.runTask(70.0, () => {
                this.icon = MDL_recipe.makeIcon(this.rcMdl, this.rcHeader);
                this.lockedIcon = this.icon.tint(Color.darkGray);
                this.altIcon = new StackDrawable(
                    [new TextureRegionDrawable(this.owner.uiIcon), MDL_recipe.makeIcon(this.rcMdl, this.rcHeader)].toSeq(),
                    [new Vec2(0.0, 0.0), new Vec2(12.0, 12.0)].toSeq(),
                    [0.8, 0.5],
                );
            });
        };

        /* basic fields */

        /** @type {string} */
        this.categ = MDL_recipe.getCateg(this.rcMdl, this.rcHeader);
        /** @type {Array<UnlockableContent>} */
        this.lockedByCts = MDL_recipe.getLockedByCts(this.rcMdl, this.rcHeader, true);
        /** @type {number} */
        this.rcTimeScl = MDL_recipe.getTimeScl(this.rcMdl, this.rcHeader);
        /** @type {number} */
        this.pol = MDL_recipe.getPol(this.rcMdl, this.rcHeader);
        /** @type {boolean} */
        this.ignoreItemFullness = MDL_recipe.checkIgnoreItemFullness(this.rcMdl, this.rcHeader);
        /** @type {number} */
        this.erekirHeatReq = MDL_recipe.getErekirHeatReq(this.rcMdl, this.rcHeader);
        /** @type {number} */
        this.erekirHeatProd = MDL_recipe.getErekirHeatProd(this.rcMdl, this.rcHeader);

        /* attribute fields */

        let nameAttr = MDL_recipe.getAttr(this.rcMdl, this.rcHeader);
        /** @type {Attribute|null} */
        this.attr = nameAttr == null ?
            null :
            Attribute.getOrNull(nameAttr);
        /** @type {number} */
        this.attrMin = MDL_recipe.getAttrMin(this.rcMdl, this.rcHeader) * Math.pow(this.owner.size, 2);
        /** @type {number} */
        this.attrMax = MDL_recipe.getAttrMax(this.rcMdl, this.rcHeader) * Math.pow(this.owner.size, 2);
        /** @type {number} */
        this.attrBoostScl = MDL_recipe.getAttrBoostScl(this.rcMdl, this.rcHeader);
        /** @type {number} */
        this.attrBoostCap = MDL_recipe.getAttrBoostCap(this.rcMdl, this.rcHeader);

        /* I/O fields */

        /** @type {RecipeIo2Array} */
        this.ci = MDL_recipe.getCi(null, this.rcMdl, this.rcHeader);
        /** @type {RecipeIo2Array} */
        this.baseCi = MDL_recipe.getCi(null, this.rcMdl, "");
        /** @type {RecipeIo2Array} */
        this.ciNoBase = MDL_recipe.getCi(null, this.rcMdl, this.rcHeader, true);
        /** @type {RecipeIo3Array} */
        this.bi = MDL_recipe.getBi(null, this.rcMdl, this.rcHeader);
        /** @type {RecipeIo3Array} */
        this.baseBi = MDL_recipe.getBi(null, this.rcMdl, "");
        /** @type {RecipeIo3Array} */
        this.biNoBase = MDL_recipe.getBi(null, this.rcMdl, this.rcHeader, true);
        /** @type {RecipeIo2Array} */
        this.aux = MDL_recipe.getAux(null, this.rcMdl, this.rcHeader);
        /** @type {RecipeIo2Array} */
        this.baseAux = MDL_recipe.getAux(null, this.rcMdl, "");
        /** @type {RecipeIo2Array} */
        this.auxNoBase = MDL_recipe.getAux(null, this.rcMdl, this.rcHeader, true);
        /** @type {boolean} */
        this.reqOpt = MDL_recipe.getReqOpt(this.rcMdl, this.rcHeader);
        /** @type {RecipeIo4Array} */
        this.opt = MDL_recipe.getOpt(null, this.rcMdl, this.rcHeader);
        /** @type {RecipeIo4Array} */
        this.baseOpt = MDL_recipe.getOpt(null, this.rcMdl, "");
        /** @type {RecipeIo4Array} */
        this.optNoBase = MDL_recipe.getOpt(null, this.rcMdl, this.rcHeader, true);
        /** @type {RecipeIo2Array} */
        this.payi = MDL_recipe.getPayi(null, this.rcMdl, this.rcHeader);
        /** @type {RecipeIo2Array} */
        this.basePayi = MDL_recipe.getPayi(null, this.rcMdl, "");
        /** @type {RecipeIo2Array} */
        this.payiNoBase = MDL_recipe.getPayi(null, this.rcMdl, this.rcHeader, true);
        /** @type {RecipeIo2Array} */
        this.co = MDL_recipe.getCo(null, this.rcMdl, this.rcHeader);
        /** @type {RecipeIo2Array} */
        this.baseCo = MDL_recipe.getCo(null, this.rcMdl, "");
        /** @type {RecipeIo2Array} */
        this.coNoBase = MDL_recipe.getCo(null, this.rcMdl, this.rcHeader, true);
        /** @type {RecipeIo3Array} */
        this.bo = MDL_recipe.getBo(null, this.rcMdl, this.rcHeader);
        /** @type {RecipeIo3Array} */
        this.baseBo = MDL_recipe.getBo(null, this.rcMdl, "");
        /** @type {RecipeIo3Array} */
        this.boNoBase = MDL_recipe.getBo(null, this.rcMdl, this.rcHeader, true);
        /** @type {number} */
        this.failP = MDL_recipe.getFailP(this.rcMdl, this.rcHeader);
        /** @type {RecipeIo3Array} */
        this.fo = MDL_recipe.getFo(null, this.rcMdl, this.rcHeader);
        /** @type {RecipeIo3Array} */
        this.baseFo = MDL_recipe.getFo(null, this.rcMdl, "");
        /** @type {RecipeIo3Array} */
        this.foNoBase = MDL_recipe.getFo(null, this.rcMdl, this.rcHeader, true);
        /** @type {RecipeIo2Array} */
        this.payo = MDL_recipe.getPayo(null, this.rcMdl, this.rcHeader);
        /** @type {RecipeIo2Array} */
        this.basePayo = MDL_recipe.getPayo(null, this.rcMdl, "");
        /** @type {RecipeIo2Array} */
        this.payoNoBase = MDL_recipe.getPayo(null, this.rcMdl, this.rcHeader, true);

        /* event fields */

        /** @type {FFunction<Building, boolean>} */
        this.unlockedCheck = MDL_recipe.getUnlockedCheck(this.rcMdl, this.rcHeader);
        /** @type {FFunction<Building, boolean>} */
        this.validCheck = MDL_recipe.getFinalValidCheck(this.rcMdl, this.rcHeader);
        /** @type {Array<CFunction<Building>>} */
        this.scrTup = MDL_recipe.getScrTup(null, this.rcMdl, this.rcHeader);

        /* visual fields */

        /** @type {Effect} */
        this.failEff = MDL_recipe.getFailEff(this.rcMdl, this.rcHeader);
        /** @type {DrawBlock} */
        this.rcDrawer = MDL_recipe.getDrawer(this.rcMdl, this.rcHeader);

        /* extra fields */

        /** @type {number} */
        this.tempReq = MDL_recipe.getTempReq(this.rcMdl, this.rcHeader);
        /** @type {number} */
        this.tempAllowed = MDL_recipe.getTempAllowed(this.rcMdl, this.rcHeader);
        /** @type {number} */
        this.durabDecMtp = MDL_recipe.getDurabDecMtp(this.rcMdl, this.rcHeader);
        /** @type {number} */
        this.powProdMtp = MDL_recipe.getPowProdMtp(this.rcMdl, this.rcHeader);

        /* internal fields */

        if(this.useAutoSelection) {
            /** @type {ObjectMap<Item, string>} */
            this.keyItemHeaderMap = MDL_recipe.getKeyCtHeaderMap(null, this.rcMdl, RecipeKeyResourceModes.ITEM);
            /** @type {ObjectMap<Liquid, string>} */
            this.keyFldHeaderMap = MDL_recipe.getKeyCtHeaderMap(null, this.rcMdl, RecipeKeyResourceModes.FLUID);
            /** @type {ObjectMap<Block|UnitType, string>} */
            this.keyPayHeaderMap = MDL_recipe.getKeyCtHeaderMap(null, this.rcMdl, RecipeKeyResourceModes.PAYLOAD);
        };
        /** @type {Array<Liquid>} */
        this.inputFlds = CLS_recipe.getInputFlds(null, this);
        /** @type {Array<Liquid>} */
        this.outputFlds = CLS_recipe.getOutputFlds(null, this);
        /** @type {boolean} */
        this.hasAnyItemOutput = CLS_recipe.checkAnyItemOutput(this);
        /** @type {boolean} */
        this.hasAnyFldOutput = CLS_recipe.checkAnyFldOutput(this, false);
        /** @type {boolean} */
        this.hasAnyFldOutputIncludeAux = CLS_recipe.checkAnyFldOutput(this, true);
        /** @type {boolean} */
        this.hasPayInput = CLS_recipe.checkAnyPayInput(this);
        /** @type {boolean} */
        this.hasPayOutput = CLS_recipe.checkAnyPayOutput(this);
        /** @type {[Array<Item>, Array[Liquid]]} */
        this.dumpTup = CLS_recipe.getDumpTup(null, this);

        /** @type {boolean} */
        this.hasBaseIo = false;
        MDL_recipe.IO_ORDER_MAP.each((name, ord) => {
            if(this.hasBaseIo) return;
            if(this["base" + name.firstUpperCase()].length > 0) this.hasBaseIo = true;
        });

        /** @type {Array<UnlockableContent>} */
        this.techNodes = [];
        this.lockedByCts.forEachFast(ct => {
            if(checkSubInsOfTemp(ct, "DBCT_techNodeContent")) {
                this.techNodes.pushUnique(ct);
            };
        });
        if(this.techNodes.length > 0) {
            nodeLockedRcs.push(this);
            this.techNodes.forEachFast(node => {
                if(!nodeRcsMap.containsKey(node)) nodeRcsMap.put(node, []);
                nodeRcsMap.get(node).push(this);
            }, true);
        };

        /* final setup */

        if(this.isIncomplete) {
            incompleteRcs.push(this);
            rcIncompleteCount++;
        };

        Core.app.post(() => {
            /** @type {RecipeUpdater} */
            this.updater = new RecipeUpdater(this);
        });

        return this;
    };


    /* <------------------------------ display ------------------------------ */


    /**
     * Builds recipe I/O table for this recipe.
     * @param {Table} tb
     * @param {number} ord - Order of the recipe, use -1 to hide order box.
     * @param {boolean|unset} [noPane] - If true, no {@link ScrollPane} is used.
     * @param {boolean|unset} [showWinBtn] - If true, a button to create new window is added to order box.
     * @param {boolean|unset} [breakForStats] - If true, stats are displayed in another row.
     * @return {Cell}
     */
    CLS_recipe.prototype.display = function(tb, ord, noPane, showWinBtn, breakForStats) {
        return tb.table(Tex.whiteui, tb1 => {
            tb1.left().setColor(Pal.darkestGray);
            if(!breakForStats) {
                if(ord >= 0) {
                    this.displayOrder(tb1, ord, showWinBtn);
                };
                tb1.table(Styles.none, tb2 => {}).left().width(36.0).growY();
                this.displayInput(tb1, false, noPane);
                tb1.table(Styles.none, tb2 => {}).left().width(48.0).growX().growY();
                this.displayOutput(tb1, false);
                this.displayStats(tb1, noPane);
            } else {
                tb1.table(Styles.none, tb2 => {
                    tb2.left();
                    if(ord >= 0) {
                        this.displayOrder(tb2, ord, showWinBtn);
                    };
                    tb2.table(Styles.none, tb3 => {}).left().width(36.0).growY();
                    this.displayInput(tb2, false, noPane);
                    tb2.table(Styles.none, tb3 => {}).left().width(48.0).growX().growY();
                    this.displayOutput(tb2, false);
                }).left().row();
                MDL_table.br(tb1, 1);
                MDL_table.bar(tb1, Pal.accent, null, 2.0);
                this.displayStats(tb1, noPane, true);
            };
        })
        .left()
        .growX()
        .row();
    };


    /**
    * Builds recipe base I/O table for this recipe.
    * @param {Table} tb
    * @param {boolean|unset} [noPane]
    * @param {number|unset} [pad]
    * @return {Cell}
    */
    CLS_recipe.prototype.displayBase = function(tb, noPane, pad) {
        return tb.table(Tex.whiteui, tb1 => {
            tb1.left().setColor(Tmp.c1.set(Pal.accent).lerp(Color.black, 0.8));
            this.displayInput(tb1, true, noPane);
            tb1.table(Styles.none, tb2 => {}).left().width(48.0).growX().growY();
            this.displayOutput(tb1, true);
            tb1.table(Styles.none, tb2 => {}).left().width(48.0).growX().growY();
        })
        .left()
        .padLeft(tryVal(pad, 0.0))
        .padRight(tryVal(pad, 0.0))
        .growX()
        .row();
    };


    /**
     * Builds tooltip table for this recipe.
     * @param {Table} tb
     * @param {boolean|unset} [valid]
     * @param {string|unset} [title]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayTooltip = function(tb, valid, title) {
        if(valid == null) valid = true;

        return MDL_table.edge(tb, tb1 => {
            tb1.table(Tex.whiteui, tb2 => {
                tb2.left().setColor(Pal.darkestGray);
                MDL_table.margin(tb2);

                if(!valid) {
                    tb2.add(MDL_bundle.getInfo("lovec", "recipe-unavailable")).color(Pal.remove).row();
                } else {
                    if(title != null) {
                        tb2.add(title.plain().color(Pal.accent)).left().padLeft(12.0).fontScale(1.1).row();
                        MDL_table.bar(tb2, Pal.accent, null, 2.0);
                        MDL_table.br(tb2, 2);
                    };
                    if(this.tt != null) {
                        tb2.add(this.tt.color(Color.gray)).left().labelAlign(Align.left).wrap().padLeft(28.0).padRight(28.0).padTop(14.0).padBottom(14.0).grow().row();
                        MDL_table.br(tb2, 1);
                    };
                    if(this.hasBaseIo) {
                        MDL_table.br(tb2, 1);
                        this.displayBase(tb2, true, 28.0);
                        MDL_table.br(tb2, 1);
                        MDL_table.bar(tb2, Color.valueOf(Tmp.c1, "303030"), null, 3.0);
                    };
                    this.display(tb2, -1, true, false, true);
                };
            }).left();
        });
    };


    /**
     * Builds the container table for an I/O fragment.
     * @param {Table} tb
     * @param {string} name
     * @param {function(Table): void} tableM
     * @return {Cell}
     */
    CLS_recipe.prototype.displayIoFrag = function(tb, name, tableM) {
        return tb.table(Styles.none, tb1 => {
            tb1.left();
            MDL_table.margin(tb1);
            // `TABLE`: Title
            tb1.add("${1}:".format(name.toUpperCase())).left().tooltip(MDL_bundle.getTerm("lovec", name), true).row();
            // `TABLE`: I/O contents
            tb1.table(Styles.none, tableM);
        })
        .left()
        .marginRight(24.0);
    };


    /**
     * Builds the pane for alternative I/O fragment.
     * @param {Table} tb
     * @param {function(Table): void} tableM
     * @param {boolean|unset} [noPane]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayAltIoFrag = function(tb, tableM, noPane) {
        return tb.table(Styles.none, tb1 => {
            tb1.left();

            if(noPane) {
                tb1.table(Tex.whiteui, tb2 => {
                    tb2.left().setColor(Pal.darkerGray);
                    tableM(tb2);
                }).growX();
                return;
            };

            let pn = tb1.pane(pnTb => {
                pnTb.setBackground(Tex.whiteui);
                pnTb.setColor(Pal.darkerGray);
                pnTb.left();
                tableM(pnTb);
            })
            .growX()
            .get();
            pn.setOverscroll(false, false);
            pn.setScrollBarPositions(true, false);
        })
        .marginRight(16.0)
        .maxHeight(82.0);
    };


    /**
     * Builds the recipe order fragment.
     * @param {Table} tb
     * @param {number} ord
     * @param {boolean|unset} [showWinBtn]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayOrder = function(tb, ord, showWinBtn) {
        return tb.table(Styles.none, tb1 => {
            tb1.left();
            tb1.table(Styles.none, tb2 => {
                tb2.center();
                tb2.add("[" + Strings.fixed(ord, 0) + "]").color(Pal.accent).tooltip(this.rcHeader, true).row();
                MDL_table.br(tb2, 1);
                tb2.table(Styles.none, tb3 => {
                    tb3.button(this.icon, Styles.clearNonei, 28.0, () => {});
                    if(showWinBtn) {
                        tb3.button(VARGEN.icons.window, Styles.clearNonei, 28.0, () => {
                            new CLS_window(
                                "${1} (${2})".format(MDL_bundle.getTerm("lovec", "recipe"), this.owner.localizedName + " [${1}]".format(ord)),
                                tb4 => {
                                    if(this.hasBaseIo) {
                                        this.displayBase(tb4, false, 28.0);
                                        MDL_table.br(tb4, 1);
                                        MDL_table.bar(tb4, Color.valueOf(Tmp.c1, "303030"), null, 3.0);
                                    };
                                    this.display(tb4, -1, false, false);
                                },
                            ).add();
                        })
                        .tooltip(MDL_bundle.getTerm("lovec", "new-window"), true);
                    };
                });
            }).width(84.0);
            MDL_table.barV(tb1, Pal.accent);
        })
        .left()
        .growY();
    };


    /**
     * Builds the entire input fragment.
     * @param {Table} tb
     * @param {boolean|unset} [isBase]
     * @param {boolean|unset} [noPane]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayInput = function(tb, isBase, noPane) {
        return tb.table(Styles.none, tb1 => {
            tb1.left();
            if((isBase ? this.baseBi : this.biNoBase).length > 0) this.displayBi(tb1, isBase, noPane);
            if((isBase ? this.baseCi : this.ciNoBase).length > 0) this.displayCi(tb1, isBase, noPane);
            if((isBase ? this.baseAux : this.auxNoBase).length > 0) this.displayAux(tb1, isBase);
            if((isBase ? this.baseOpt : this.optNoBase).length > 0) this.displayOpt(tb1, isBase);
            if((isBase ? this.basePayi : this.payiNoBase).length > 0) this.displayPayi(tb1, isBase);
            tb1.table(Styles.none, tb2 => {}).left().width(18.0).growX().growY();
        })
        .left()
        .growY();
    };


    /**
     * Builds the entire output fragment.
     * @param {Table} tb
     * @param {boolean|unset} [isBase]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayOutput = function(tb, isBase) {
        return tb.table(Styles.none, tb1 => {
            tb1.left();
            if((isBase ? this.baseBo : this.boNoBase).length > 0) this.displayBo(tb1, isBase);
            if((isBase ? this.baseCo : this.coNoBase).length > 0) this.displayCo(tb1, isBase);
            if((isBase ? this.baseFo : this.foNoBase).length > 0) this.displayFo(tb1, isBase);
            if((isBase ? this.basePayo : this.payoNoBase).length > 0) this.displayPayo(tb1, isBase);
        })
        .left()
        .growY();
    };


    /**
     * Builds the recipe stats fragment.
     * @param {Table} tb
     * @param {boolean|unset} [noPane]
     * @param {boolean|unset} [breakForStats]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayStats = function thisFun(tb, noPane, breakForStats) {
        return tb.table(Styles.none, tb1 => {
            if(!breakForStats) {
                MDL_table.barV(tb1, Pal.accent);
                tb1.table(Styles.none, tb2 => {}).width(24.0);
            };
            tb1.table(Styles.none, tb2 => {
                tb2.left();
                if(breakForStats) {
                    MDL_table.margin(tb2);
                };
                let build = tb3 => {
                    // `TABLE`: Stats
                    thisFun.addStat(
                        tb3, this.isGen,
                        MDL_bundle.getTerm("lovec", "generated-recipe").color(Pal.gray),
                    );
                    if(this.isIncomplete) {
                        let str = MDL_bundle.getInfo("lovec", "tt-recipe-errored-names") + "\n";
                        this.erroredNames.forEachFast(name => str += ("\n- " + name).color(Pal.accent), true);
                        tb3.add(MDL_bundle.getTerm("lovec", "incomplete-recipe").color(Pal.remove)).left().tooltip(str, true).row();
                    };
                    thisFun.addStat(
                        tb3, true,
                        MDL_bundle.getTerm("lovec", "time-required"),
                        Strings.fixed(this.rcTimeScl, 1) + "x (" + (this.owner.craftTime * this.rcTimeScl).time(2) + ")",
                    );
                    if(this.lockedByCts.length > 0) {
                        tb3.table(Styles.none, tb4 => {
                            tb4.left();
                            tb4.add(MDL_text.getStat(MDL_bundle.getTerm("lovec", "require-unlocking"), "")).left();
                            this.lockedByCts.forEachFast(ct => MDL_table.ctIcon(tb4, ct, 28.0, 0.0, null, VAR.dialog.ct2), true);
                        })
                        .left()
                        .row();
                    };
                    thisFun.addStat(
                        tb3, !this.pol.fEqual(0.0),
                        fetchStat("lovec", "blk-pol").localized(),
                        (this.pol > 0.0 ? "+" : "-") + Math.abs(this.pol),
                        fetchStatUnit("lovec", "polunits").localized(),
                    );
                    thisFun.addStat(
                        tb3, this.erekirHeatReq > 0.0,
                        fetchStat("lovec", "blk-erekirheatreq").localized(),
                        this.erekirHeatReq,
                        StatUnit.heatUnits.localized(),
                    );
                    thisFun.addStat(
                        tb3, this.erekirHeatProd > 0.0,
                        fetchStat("lovec", "blk-erekirheatprod").localized(),
                        this.erekirHeatProd,
                        StatUnit.heatUnits.localized(),
                    );
                    thisFun.addStat(
                        tb3, this.reqOpt,
                        MDL_bundle.getTerm("lovec", "require-optional"),
                        MDL_bundle.getBase("yes"),
                    );
                    thisFun.addStat(
                        tb3, this.failP > 0.0,
                        MDL_bundle.getTerm("lovec", "chance-to-fail"),
                        this.failP.perc(1).color(this.failP > 0.25 ? Pal.remove : Pal.accent),
                    );
                    thisFun.addStat(
                        tb3, !this.powProdMtp.fEqual(1.0),
                        fetchStat("lovec", "blk0pow-powmtp").localized(),
                        this.powProdMtp.perc().color(this.powProdMtp < 1.0 ? Pal.remove : Pal.heal),
                    );
                    thisFun.addStat(
                        tb3, this.tempReq > 0.0,
                        fetchStat("lovec", "blk0heat-tempreq").localized(),
                        Strings.fixed(this.tempReq, 2),
                        fetchStatUnit("lovec", "heatunits").localized(),
                    );
                    thisFun.addStat(
                        tb3, isFinite(this.tempAllowed),
                        MDL_bundle.getTerm("lovec", "temperature-allowed"),
                        Strings.fixed(this.tempAllowed, 2),
                        fetchStatUnit("lovec", "heatunits").localized(),
                    );
                    thisFun.addStat(
                        tb3, !this.durabDecMtp.fEqual(1.0),
                        MDL_bundle.getTerm("lovec", "abrasion-multiplier"),
                        this.durabDecMtp.perc(),
                    );
                    if(this.attr != null) {
                        let attrCell = tb3.add(MDL_text.getStat(fetchStat("lovec", "blk-attrreq").localized(), MDL_attr.getAttrB(attr))).left();
                        MDL_table.tooltip(attrCell, tb => {
                            tb.table(Styles.black6, tb1 => {
                                MDL_table.margin(tb1);
                                MDL_table.setAttr(tb1, this.attr, null, this.attrBoostScl, 40.0, 5);
                            });
                        }).row();
                    };
                };

                if(noPane) {
                    tb2.table(Styles.none, tb3 => {
                        tb3.left();
                        build(tb3);
                    })
                    .padTop(20.0).padBottom(20.0)
                    .growX();
                } else {
                    tb2.pane(pnTb => {
                        pnTb.left();
                        build(pnTb);
                    })
                    .height(90.0)
                    .padTop(20.0).padBottom(20.0)
                    .growX();
                };
            })
            .left()
            .width(320.0)
            .growX();
            tb1.table(Styles.none, tb2 => {}).width(20.0);
        })
        .left()
        .growY();
    }
    .setProp({
        /**
         * `ARGS`: `Table` - tb, `boolean` - cond, `string` - str.
         * <br> `ARGS`: `Table`- tb, `boolean`- cond, `string` - titleStr, `string` - valStr.
         * <br> `ARGS`: `Table`- tb, `boolean`- cond, `string` - titleStr, `string` - valStr, `string` - unitStr.
         * @memberof CLS_recipe#displayStats
         * @return {void}
         */
        addStat: newMultiFunction(
            function(tb, cond, str) {
                if(cond) tb.add(str).left().row();
            },
            function(tb, cond, titleStr, valStr) {
                if(cond) tb.add(MDL_text.getStat(titleStr, valStr)).left().row();
            },
            function(tb, cond, titleStr, valStr, unitStr) {
                if(cond) tb.add(MDL_text.getStat(titleStr, valStr, unitStr)).left().row();
            },
        ),
    });


    /**
     * Builds BI fragment.
     * @param {Table} tb
     * @param {boolean|unset} [isBase]
     * @param {boolean|unset} [noPane]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayBi = function(tb, isBase, noPane) {
        return this.displayIoFrag(tb, "bi", tb1 => {
            (isBase ? this.baseBi : this.biNoBase).forEachRow(3, (tmp, amt, p) => {
                if(!(tmp instanceof Array)) {
                    MDL_table.rcCtIcon(tb1, tmp, amt, p, true, null, VAR.dialog.ct1);
                } else {
                    this.displayAltIoFrag(tb1, tb2 => {
                        tmp.forEachRow(3, (tmp1, amt, p) => {
                            MDL_table.rcCtIcon(tb2, tmp1, amt, p, true, null, VAR.dialog.ct1).row();
                        }, true);
                    }, noPane);
                };
            });
        });
    };


    /**
     * Builds CI fragment.
     * @param {Table} tb
     * @param {boolean|unset} [isBase]
     * @param {boolean|unset} [noPane]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayCi = function(tb, isBase, noPane) {
        return this.displayIoFrag(tb, "ci", tb1 => {
            (isBase ? this.baseCi : this.ciNoBase).forEachRow(2, (tmp, amt) => {
                if(!(tmp instanceof Array)) {
                    MDL_table.rcCtIcon(tb1, tmp, amt, null, false, null, VAR.dialog.ct1);
                } else {
                    this.displayAltIoFrag(tb1, tb2 => {
                        tmp.forEachRow(2, (tmp1, amt) => {
                            MDL_table.rcCtIcon(tb2, tmp1, amt, null, false, null, VAR.dialog.ct1).row();
                        }, true);
                    }, noPane);
                };
            });
        });
    };


    /**
     * Builds AUX fragment.
     * @param {Table} tb
     * @param {boolean|unset} [isBase]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayAux = function(tb, isBase) {
        return this.displayIoFrag(tb, "aux", tb1 => {
            (isBase ? this.baseAux : this.auxNoBase).forEachRow(2, (tmp, amt) => {
                MDL_table.rcCtIcon(tb1, tmp, amt, null, false, null, VAR.dialog.ct1);
            }, true);
        });
    };


    /**
     * Builds OPT fragment.
     * @param {Table} tb
     * @param {boolean|unset} [isBase]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayOpt = function(tb, isBase) {
        return this.displayIoFrag(tb, "opt", tb1 => {
            tb1.button("?", () => fetchDialog("rcOpt").ex_show(MDL_bundle.getTerm("lovec", "opt"), (isBase ? this.baseOpt : this.optNoBase))).size(34.0).pad(3.0);
        });
    };


    /**
     * Builds PAYI fragment.
     * @param {Table} tb
     * @param {boolean|unset} [isBase]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayPayi = function(tb, isBase) {
        return this.displayIoFrag(tb, "payi", tb1 => {
            (isBase ? this.basePayi : this.payiNoBase).forEachRow(2, (name, amt) => {
                MDL_table.rcCtIcon(tb1, MDL_content.getCt(name, null, true), amt, 1.0, true, null, VAR.dialog.ct1);
            }, true);
        });
    };


    /**
     * Builds BO fragment.
     * @param {Table} tb
     * @param {boolean|unset} [isBase]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayBo = function(tb, isBase) {
        return this.displayIoFrag(tb, "bo", tb1 => {
            (isBase ? this.baseBo : this.boNoBase).forEachRow(3, (tmp, amt, p) => {
                MDL_table.rcCtIcon(tb1, tmp, amt, p, true, null, VAR.dialog.ct1);
            }, true);
        });
    };


    /**
     * Builds CO fragment.
     * @param {Table} tb
     * @param {boolean|unset} [isBase]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayCo = function(tb, isBase) {
        return this.displayIoFrag(tb, "co", tb1 => {
            (isBase ? this.baseCo : this.coNoBase).forEachRow(2, (tmp, amt) => {
                MDL_table.rcCtIcon(tb1, tmp, amt, null, false, null, VAR.dialog.ct1);
            }, true);
        });
    };


    /**
     * Builds FO fragment.
     * @param {Table} tb
     * @param {boolean|unset} [isBase]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayFo = function(tb, isBase) {
        return this.displayIoFrag(tb, "fo", tb1 => {
            (isBase ? this.baseFo : this.foNoBase).forEachRow(3, (tmp, amt, p) => {
                MDL_table.rcCtIcon(tb1, tmp, amt, p, true, null, VAR.dialog.ct1);
            }, true);
        });
    };


    /**
     * Builds PAYO fragment.
     * @param {Table} tb
     * @param {boolean|unset} [isBase]
     * @return {Cell}
     */
    CLS_recipe.prototype.displayPayo = function(tb, isBase) {
        return this.displayIoFrag(tb, "payo", tb1 => {
            (isBase ? this.basePayo : this.payoNoBase).forEachRow(2, (name, amt) => {
                MDL_table.rcCtIcon(tb1, MDL_content.getCt(name, null, true), amt, 1.0, true, null, VAR.dialog.ct1);
            }, true);
        });
    };


    /* <------------------------------ application ------------------------------ */


    /**
     * Whether a multi-crafter can add resource anymore.
     * @param {Building} b
     * @return {boolean}
     */
    CLS_recipe.prototype.checkCanAdd = function(b) {
        return this.updater.checkCanAdd(b);
    };


    /**
     * Gets a 4-tuple of preferred optional input.
     * Returns null if no optional input.
     * @param {Building} b
     * @return {[Item, number, number, number]|null} `TUPLE`: item, amt, p, mtp.
     */
    CLS_recipe.prototype.getOptTup = function(b) {
        return this.updater.getOptTup(b);
    };


    /**
     * Calculates current efficiency of a multi-crafter.
     * @param {Building} b
     * @return {number}
     */
    CLS_recipe.prototype.calcEffc = function(b) {
        return this.updater.calcEffc(b);
    };


    /**
     * Changes recipe of a multi-crafter if its key content has changed.
     * @param {Building} b
     * @return {void}
     */
    CLS_recipe.prototype.updateAutoSelection = function thisFun(b) {
        if(!this.useAutoSelection || b.delegee.keyCt == null || b.delegee.lastKeyCt === b.delegee.keyCt) return;

        b.delegee.lastKeyCt = b.delegee.keyCt;
        thisFun.lastHeader = (
            b.delegee.keyCt instanceof Item ?
                this.keyItemHeaderMap :
                b.delegee.keyCt instanceof Liquid ?
                    this.keyFldHeaderMap :
                    this.keyPayHeaderMap
        ).get(b.delegee.keyCt);

        if(thisFun.lastHeader != null) {
            b.configure(thisFun.lastHeader);
        };
    }
    .setProp({
        /**
         * @type {string|null}
         * @memberof CLS_recipe#updateAutoSelection
         */
        lastHeader: null,
    });


    /**
     * Updates state of Erekir heat in a multi-crafter.
     * @param {Building} b
     * @return {void}
     */
    CLS_recipe.prototype.updateErekirHeat = function(b) {
        if(this.erekirHeatReq > 0.0) {
            b.delegee.erekirHeatI = b.calculateHeat(b.delegee.erekirSideHeats);
            b.delegee.erekirHeatEffc = Mathf.clamp(b.delegee.erekirHeatI / this.erekirHeatReq);
        };
        if(this.erekirHeatProd > 0.0) {
            b.delegee.erekirHeatO = Mathf.approachDelta(b.delegee.erekirHeatO, this.erekirHeatProd * b.efficiency, b.block.delegee.erekirHeatWarmupRate * b.delta());
        };
    };


    /**
     * Lets a multi-crafter consume items.
     * @param {Building} b
     * @return {void}
     */
    CLS_recipe.prototype.consumeBatch = function(b) {
        this.updater.consumeBatch(b);
    };


    /**
     * Lets a multi-crafter consume liquids.
     * @param {Building} b
     * @param {number} progIncLiq
     * @return {void}
     */
    CLS_recipe.prototype.consumeContinuous = function(b, progIncLiq) {
        this.updater.consumeContinuous(b, progIncLiq);
    };


    /**
     * Lets a multi-crafter produce items.
     * @param {Building} b
     * @param {number} failP
     * @return {void}
     */
    CLS_recipe.prototype.craftBatch = function(b, failP) {
        let failed = syncChance("crafter", failP);
        this.updater.craftBatch(b, failed);
        if(!failed) {
            MDL_effect.showAt(b.x, b.y, b.block.craftEffect, 0.0);
        } else {
            MDL_effect.showAt(b.x, b.y, b.ex_getFailEff(), 0.0);
            b.ex_onRcFail();
        };
    };


    /**
     * Lets a multi-crafter produce liquids.
     * @param {Building} b
     * @param {number} progIncLiq
     * @return {void}
     */
    CLS_recipe.prototype.craftContinuous = function(b, progIncLiq) {
        this.updater.craftContinuous(b, progIncLiq);
    };


    /**
     * Consumes and produces payload in a multi-crafter.
     * @param {Building} b
     * @return {void}
     */
    CLS_recipe.prototype.craftPay = function(b) {
        let
            i,
            iCap;

        if(b.delegee.hasPayInput) {
            i = 0;
            iCap = this.payi.iCap();
            while(i < iCap) {
                Object.mapIncre(b.delegee.payReqObj, this.payi[i], -this.payi[i + 1]);
                i += 2;
            };
        };
        if(b.delegee.hasPayOutput) {
            i = 0;
            iCap = this.payo.iCap();
            while(i < iCap) {
                Object.mapIncre(b.delegee.payStockObj, this.payo[i], this.payo[i + 1]);
                i += 2;
            };
        };
    };


    /**
     * Lets a multi-crafter dump resource in it.
     * @param {Building} b
     * @return {void}
     */
    CLS_recipe.prototype.dump = function(b) {
        this.updater.dump(b);
    };


    /**
     * Calculates attribute efficiency at given sum.
     * @param {number} attrSum
     * @return {number}
     */
    CLS_recipe.prototype.calcAttrEffc = function(attrSum) {
        return this.attr == null ?
            1.0 :
            MDL_attr.calcAttrEffc(attrSum + this.attr.env(), this.attrMin, this.attrMax, this.attrBoostScl, this.attrBoostCap);
    };




module.exports = CLS_recipe;
