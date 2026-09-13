/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Various methods which are mostly wrapped {@link extend} designed for content templates.
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ base ------------------------------ */


    /**
     * Stores contents created with {@link extendBase} and its variants.
     * @global
     */
    LCContentHandler = {


        /** @type {ObjectMap<string, UnlockableContent>} */
        __nameMap__: new ObjectMap(),
        /** @type {Object<string, ObjectMap<string, UnlockableContent>>} */
        __typeMaps__: {},


        /**
         * Adds a content to the storage.
         * @param {UnlockableContent} ct
         * @return {void}
         */
        add(ct) {
            if(!checkCreatedByTemp(ct)) throw new NotCreatedByTemplateError(ct);
            LCContentHandler.__nameMap__.put(ct.name, ct);
            if(LCContentHandler.__typeMaps__[ct.getContentType().toString()] !== undefined) {
                LCContentHandler.__typeMaps__[ct.getContentType().toString()].put(ct.name, ct);
            } else {
                LCContentHandler.__typeMaps__[ct.getContentType().toString()] = new ObjectMap();
            };
        },


        /**
         * Gets a content from the storage.
         * Usually {@link fetchContent} is used instead.
         * @param {string} nameCt
         * @param {ContentType|unset} [ctType]
         * @return {UnlockableContent|null}
         */
        fetch: newMultiFunction(
            function(nameCt) {return LCContentHandler.__nameMap__.get(nameCt)},
            function(nameCt, ctType) {return LCContentHandler.__typeMaps__[ctType].get(nameCt)},
        ),


    };


    /**
     * Gets a content that is created with {@link extendBase} or its variants.
     * This method is meant to replace {@link require} for cross-mod compatibility, do not abuse this after INIT!
     * @global
     * @param {string} nameCt
     * @param {ContentType|unset} [ctType]
     * @return {UnlockableContent}
     */
    fetchContent = function(nameCt, ctType) {
        let ct = ctType == null ?
            LCContentHandler.fetch(nameCt) :
            LCContentHandler.fetch(nameCt, ctType);
        if(ct == null) throw new NotCreatedByTemplateError(nameCt);
        return ct;
    };


    /**
     * Generalized version of {@link Vars.content.byName}.
     * Does not give warning when content not found.
     * Do not abuse this, use {@link MDL_content.getCt} if possible.
     * @global
     * @param {ContentGn} ct_gn
     * @return {UnlockableContent|null}
     * @lovecTypeSensitive
     */
    findContent = function(ct_gn) {
        return ct_gn == null ?
            null :
            ct_gn instanceof UnlockableContent ?
                ct_gn :
                Vars.content.byName(ct_gn);
    };


    /**
     * Used to temporarily switch current mod to null or other mod.
     * Should always be called twice!
     * @global
     * @param {Mods.LoadedMod|unset} [mod]
     * @return {void}
     */
    processModCur = function(mod) {
        if(!processModCur.isTail) {
            processModCur.modPrev = Reflect.get(ContentLoader, Vars.content, "currentMod");
            Reflect.set(ContentLoader, Vars.content, "currentMod", tryVal(mod, null));
        } else {
            Reflect.set(ContentLoader, Vars.content, "currentMod", processModCur.modPrev);
        };
        processModCur.isTail = !processModCur.isTail;
    };
    /** @type {boolean} */
    processModCur.isTail = false;
    /** @type {Mods.LoadedMod|null} */
    processModCur.modPrev = null;


    /**
     * Temporarily changes class loader, so that {@link extendBase} can be applied on mod Java classes.
     * Should always be called twice!
     * @global
     * @param {java.lang.ClassLoader|unset} [clsLoader]
     * @param {number|unset} [ind]
     * @return {void}
     */
    processClassLoader = function(clsLoader, ind) {
        if(!processClassLoader.tailBools[tryVal(ind, 0)]) {
            CONTEXT.setApplicationClassLoader(tryVal(clsLoader, Vars.mods.mainLoader()));
        } else {
            CONTEXT.setApplicationClassLoader(processClassLoader.defLoader);
        };
        processClassLoader.tailBools[ind] = !processClassLoader.tailBools[ind];
    };
    /** @type {Array<boolean>} */
    processClassLoader.tailBools = [
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
    ];
    /** @type {java.lang.ClassLoader} */
    processClassLoader.defLoader = CONTEXT.getApplicationClassLoader();


    /* <------------------------------ extend ------------------------------ */


    /**
     * Variant of {@link extend} that can be safely used on mod classes.
     * <br> `ARGS`: javaCls, arg1, arg2, arg3, ..., obj.
     * @global
     * @template T
     * @param {Class<T>} javaCls
     * @return {T}
     */
    extendSafe = function(javaCls) {
        processClassLoader(null, VAR.extendInd.safe);
        let ins = extend.apply(this, arguments);
        processClassLoader(null, VAR.extendInd.safe);
        return ins;
    };


    /**
     * Lovec version of {@link extend} using content templates.
     * Significantly simplifies content codes.
     * @global
     * @param {ContentTemplate} temp
     * @param {string} nameCt
     * @param {ExtendObject|unset} [obj]
     * @return {UnlockableContent}
     */
    extendBase = function(temp, nameCt, obj) {
        processClassLoader(null, VAR.extendInd.base);
        obj = extendBase.setupObj(temp, obj);
        // Can't implement interfaces with `extend`, that's why `new JavaAdapter(...)` is used
        // You cannot pass an array as arguments to a constructor function directly, here it's wrapped in `ctorCall`
        let ct = ctorCall(JavaAdapter, extendBase.setupArgs(temp, obj, nameCt));
        extendBase.setupFields(ct, obj);
        temp.initContent(ct);
        LCContentHandler.add(ct);
        processClassLoader(null, VAR.extendInd.base);
        return ct;
    };
    /**
     * @param {ContentTemplate} temp
     * @param {ExtendParamObject|unset} [obj]
     * @return {ExtendObject}
     */
    extendBase.setupObj = function(temp, obj) {
        // If `obj` not given, build it from template with default values
        return obj != null ? obj : temp.build();
    };
    /**
     * `ARGS`: temp, obj, arg1, arg2, arg3, ...
     * @param {ContentTemplate} temp
     * @param {ExtendObject} obj
     * @return {Arguments} `ARGS`: javaCls, javaIntf1, javaIntf2, javaIntf3, ..., obj, arg1, arg2, arg3, ...
     */
    extendBase.setupArgs = function(temp, obj) {
        let args = [temp.getParent()];
        if(args[0] == null) throw new Error("${1} has no parent Java class!".format(temp.clsName));
        args.pushAll(temp.getParentIntfs(obj));
        args.push(obj);

        let restArgs = Array.from(arguments);
        restArgs.splice(0, 2);
        args.pushAll(restArgs);

        return args;
    };
    /**
     * @template T
     * @param {T} ins
     * @param {ExtendObject} obj
     * @return {T}
     */
    extendBase.setupFields = function(ins, obj) {
        // Java adapter only copies methods, I almost forgot this
        for(let key in obj) {
            if(obj[key] instanceof Function) continue;
            ins[key] = obj[key];
        };
        return ins;
    };


    /**
     * Variant of {@link extendBase} for blocks.
     * @global
     * @param {[ContentTemplate, ContentTemplate]} temp - Block template and building template.
     * @param {string} nameBlk
     * @param {ExtendObject|unset} [objBlk]
     * @param {ExtendObject|unset} [objB]
     * @return {Block}
     */
    extendBlock = function(temp, nameBlk, objBlk, objB) {
        processClassLoader(null, VAR.extendInd.block);
        let obj = extendBase.setupObj(temp[0], objBlk);
        if(obj.forceUseDrawer) {
            let load = obj.load;
            obj.load = function() {
                this.super$load();
                if(load != null) {
                    load();
                };
                this.drawer.load(this);
            };
            obj.drawPlanRegion = function(bPlan, bPlans) {
                this.drawer.drawPlan(this, bPlan, bPlans);
            };
            obj.getRegionsToOutline = function(regSeqOut) {
                this.drawer.getRegionsToOutline(this, regSeqOut);
            };
            obj.drawPlanConfig = function(bPlan, bPlans) {
                // Do nothing
            };
        };

        /** @type {Block} */
        let blk = ctorCall(JavaAdapter, extendBase.setupArgs(temp[0], obj, nameBlk));
        extendBase.setupFields(blk, obj);
        blk.buildType = () => {
            processClassLoader(null, VAR.extendInd.build);
            let obj1 = extendBase.setupObj(temp[1], objB);
            if(obj.forceUseDrawer) {
                obj1.draw = function() {
                    this.block.delegee == null ?
                        this.block.drawer.draw(this) :
                        this.block.delegee.drawer.draw(this);
                    this.drawTeamTop();
                };
                obj1.drawLight = function() {
                    this.block.delegee == null ?
                        this.block.drawer.drawLight(this) :
                        this.block.delegee.drawer.drawLight(this);
                };
            };
            // Building field "blk$xxx" will copy value from block field "xxx" before being used, this is required for edge cases
            Object.eachPair(obj1, (key, val) => {
                if(!key.startsWith("blk$")) return;
                obj1[key] = obj[key.replace("blk$", "")];
            });

            /** @type {Building} */
            let b = ctorCall(JavaAdapter, extendBase.setupArgs(temp[1], obj1, blk));
            extendBase.setupFields(b, obj1);
            temp[1].initContent(b);
            processClassLoader(null, VAR.extendInd.build);
            return b;
        };
        temp[0].initContent(blk);
        LCContentHandler.add(blk);
        processClassLoader(null, VAR.extendInd.block);
        return blk;
    };


    /**
     * Variant of {@link extendBase} for unit types.
     * @global
     * @param {ContentTemplate} temp
     * @param {string} nameUtp
     * @param {ExtendObject|unset} [objUtp]
     * @return {UnitType}
     */
    extendUnit = function(temp, nameUtp, objUtp) {
        processClassLoader(null, VAR.extendInd.unit);
        objUtp = extendBase.setupObj(temp, objUtp);
        /** @type {UnitType} */
        let utp = ctorCall(JavaAdapter, extendBase.setupArgs(temp, objUtp, nameUtp));
        extendBase.setupFields(utp, objUtp);
        temp.initContent(utp);
        LCContentHandler.add(utp);
        processClassLoader(null, VAR.extendInd.unit);
        return utp;
    };


    /**
     * Variant of {@link extendBase} for planets.
     * @global
     * @param {ContentTemplate} temp
     * @param {string} namePla
     * @param {number} sectorSize
     * @param {ExtendObject|unset} [objPla]
     * @return {Planet}
     */
    extendPlanet = function(temp, namePla, sectorSize, objPla) {
        processClassLoader(null, VAR.extendInd.planet);
        objPla = extendBase.setupObj(temp, objPla);
        /** @type {Planet} */
        let pla = ctorCall(JavaAdapter, extendBase.setupArgs(temp, objPla, namePla, null, 1.0, sectorSize));
        extendBase.setupFields(temp, objPla);
        temp.initContent(pla);
        LCContentHandler.add(pla);
        processClassLoader(null, VAR.extendInd.planet);
        return pla;
    };
