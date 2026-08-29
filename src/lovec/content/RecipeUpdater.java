package lovec.content;

import arc.math.Mathf;
import arc.util.Nullable;
import arc.util.Reflect;
import lovec.utils.LCScript;
import lovec.utils.LCScriptUtil;
import lovec.utils.extend.LCNativeArray;
import mindustry.type.Item;
import mindustry.type.Liquid;
import mindustry.world.Block;
import mindustry.world.blocks.production.GenericCrafter;
import rhino.NativeArray;
import rhino.NativeObject;

import static lovec.utils.LCScript.FRAG_item;

public class RecipeUpdater extends ContentUpdater<NativeObject> {


    protected float rcTimeScl;
    protected boolean ignoreItemFullness;
    protected NativeArray ci;
    protected NativeArray bi;
    protected NativeArray aux;
    protected boolean reqOpt;
    protected NativeArray opt;
    protected NativeArray co;
    protected NativeArray bo;
    protected NativeArray fo;
    protected boolean hasAnyFldOutputIncludeAux;
    protected NativeArray dumpTup;

    protected int lastResolvedId = -1;
    protected GenericCrafter blk;
    protected NativeObject consTmpObj;
    protected NativeObject prodTmpObj;


    public RecipeUpdater(NativeObject rc) throws NoSuchFieldException, IllegalAccessException {
        super(rc);
    };


    @Override
    protected void init() {
        rcTimeScl = LCScript.toFloat(target.get("rcTimeScl"));
        ignoreItemFullness = LCScript.toBoolean(target.get("ignoreItemFullness"));
        ci = LCScript.toArray(target.get("ci"));
        bi = LCScript.toArray(target.get("bi"));
        aux = LCScript.toArray(target.get("aux"));
        reqOpt = LCScript.toBoolean(target.get("reqOpt"));
        opt = LCScript.toArray(target.get("opt"));
        co = LCScript.toArray(target.get("co"));
        bo = LCScript.toArray(target.get("bo"));
        fo = LCScript.toArray(target.get("fo"));
        hasAnyFldOutputIncludeAux = LCScript.toBoolean(target.get("hasAnyFldOutputIncludeAux"));
        dumpTup = LCScript.toArray(target.get("dumpTup"));
    };


    protected void resolve(GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        if(lastResolvedId < 0 && b.id == lastResolvedId) return;

        lastResolvedId = b.id;
        blk = (GenericCrafter) b.block;
        consTmpObj = LCScript.toObject(get(b, "consTmpObj"));
        prodTmpObj = LCScript.toObject(get(b, "prodTmpObj"));
    };


    public boolean checkCanAdd(GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        resolve(b);
        int i ;
        long iCap;
        Object tmp;
        int intAmt;
        float fAmt;
        float p;

        // CO
        if(b.liquids != null) {
            boolean allFull = true;
            i = 0;
            iCap = co.getLength();
            while(i < iCap) {
                tmp = co.get(i);
                fAmt = LCScript.toFloat(co.get(i + 1));
                if(b.liquids.get((Liquid) tmp) / b.block.liquidCapacity <= 0.98f) {
                    allFull = false;
                } else if(!blk.ignoreLiquidFullness && !blk.dumpExtraLiquid && fAmt > 0f && !LCScriptUtil.checkCond("isAuxiliaryFluid", tmp)) {
                    return false;
                };
                i += 2;
            };
            if(allFull && hasAnyFldOutputIncludeAux && !blk.ignoreLiquidFullness) return false;
        };

        // BO
        i = 0;
        iCap = bo.getLength();
        while(i < iCap) {
            tmp = bo.get(i);
            intAmt = LCScript.toInt(bo.get(i + 1));
            fAmt = LCScript.toFloat(bo.get(i + 1));
            p = LCScript.toFloat(bo.get(i + 2));
            if(b.items != null && tmp instanceof Item itm) {
                if(intAmt > 0 && !ignoreItemFullness && b.items.get(itm) > b.getMaximumAccepted(itm) - intAmt * p) return false;
            };
            if(b.liquids != null && tmp instanceof Liquid liq) {
                if(fAmt > 0f && !blk.ignoreLiquidFullness && b.liquids.get(liq) / b.block.liquidCapacity > 0.98f) return false;
            };
            i += 3;
        };

        // FO
        if(b.items != null) {
            i = 0;
            iCap = fo.getLength();
            while(i < iCap) {
                tmp = fo.get(i);
                intAmt = LCScript.toInt(fo.get(i + 1));
                if(intAmt > 0 && !ignoreItemFullness && b.items.get((Item) tmp) > b.getMaximumAccepted((Item) tmp) - intAmt) return false;
                i += 3;
            };
        };

        return true;
    };


    public @Nullable NativeArray getOptTup(GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        if(b.items == null) return null;

        resolve(b);
        NativeArray tup = LCScript.newArray("LCRecipeHandler.getOptTup.newArr");
        int i = 0;
        long iCap = opt.getLength();
        Item itm;
        int amt;
        float p;
        float mtp;
        float tmpMtp = 0f;

        while(i < iCap) {
            itm = (Item) opt.get(i);
            amt = LCScript.toInt(opt.get(i + 1));
            p = LCScript.toFloat(opt.get(i + 2));
            mtp = LCScript.toFloat(opt.get(i + 3));
            if(b.items.get(itm) >= amt && mtp >= tmpMtp) {
                tmpMtp = mtp;
                LCNativeArray.with(tup, itm, amt, p, mtp);
            };
            i += 4;
        };

        return tup.getLength() == 0 ? null : tup;
    };


    public float calcEffc(GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        if(b.cheating()) return 1f;

        resolve(b);
        int i;
        long iCap;
        int j;
        long jCap;
        Object tmp;
        Object tmp1;
        int intAmt;
        float fAmt;
        float p;
        boolean allAbsent;
        float effc = 1f;
        float mtp = 1f;

        if(b.power != null && !b.block.outputsPower) {
            effc *= b.power.status;
        };

        // OPT
        if(effc > 0f && opt.getLength() > 0) {
            NativeArray tup = getOptTup(b);
            if(reqOpt && tup == null) {
                LCScript.instanceSet(b, "lastOptEffc", 0f);
                return 0f;
            };
            if(tup != null) {
                float optEffc = LCScript.toFloat(tup.get(3));
                effc *= optEffc;
                LCScript.instanceSet(b, "lastOptEffc", optEffc);
                LCNativeArray.clear(tup);
            };
        };

        // CI
        if(b.liquids != null) {
            i = 0;
            iCap = ci.getLength();
            while(i < iCap) {
                if(effc < 0.0001f) return 0f;
                tmp = ci.get(i);
                if(tmp instanceof NativeArray arr) {
                    j = 0;
                    jCap = arr.getLength();
                    allAbsent = true;
                    while(j < jCap) {
                        if(b.liquids.get((Liquid) arr.get(j)) > 0.01f) {
                            fAmt = LCScript.toFloat(arr.get(j + 1));
                            mtp = b.efficiencyScale() < 0.0001f || LCScript.toFloat(LCScript.instanceGet(b, "lastOptEffc")) < 0.0001f ?
                                0f :
                                Math.min(b.liquids.get((Liquid) arr.get(j)) / fAmt / LCScript.toFloat(LCScript.instanceGet(b, "lastOptEffc")) * b.delta() * b.efficiencyScale(), 1f);
                            allAbsent = false;
                            break;
                        };
                        j += 2;
                    };
                    if(allAbsent) {
                        mtp = 0f;
                    };
                } else {
                    fAmt = LCScript.toFloat(ci.get(i + 1));
                    mtp = b.efficiencyScale() < 0.0001f || LCScript.toFloat(LCScript.instanceGet(b, "lastOptEffc")) < 0.0001f ?
                        0f :
                        fAmt < 0.0001f ?
                            1f:
                            Math.min(b.liquids.get((Liquid) tmp) / fAmt / LCScript.toFloat(LCScript.instanceGet(b, "lastOptEffc")) * b.delta() * b.efficiencyScale(), 1f);
                };
                effc *= mtp;
                i += 2;
            };
        };

        // BI
        if(b.items != null || b.liquids != null) {
            i = 0;
            iCap = bi.getLength();
            while(i < iCap) {
                if(effc < 0.0001f) return 0f;
                tmp = bi.get(i);
                if(tmp instanceof NativeArray arr) {
                    allAbsent = true;
                    j = 0;
                    jCap = arr.getLength();
                    while(j < jCap) {
                        if(!allAbsent) break;
                        tmp1 = arr.get(j);
                        intAmt = LCScript.toInt(arr.get(j + 1));
                        fAmt = LCScript.toFloat(arr.get(j + 1));
                        if(b.items != null && tmp1 instanceof Item itm) {
                            if(b.items.get(itm) >= intAmt) allAbsent = false;
                        };
                        if(b.liquids != null && tmp1 instanceof Liquid liq) {
                            if(b.liquids.get(liq) > fAmt - 0.0001f) allAbsent = false;
                        };
                        j += 3;
                    };
                    if(allAbsent) return 0f;
                } else {
                    intAmt = LCScript.toInt(bi.get(i + 1));
                    fAmt = LCScript.toInt(bi.get(i + 1));
                    if(b.items != null && tmp instanceof Item itm) {
                        if(b.items.get(itm) < intAmt) return 0f;
                    };
                    if(b.liquids != null && tmp instanceof Liquid liq) {
                        if(b.liquids.get(liq) < fAmt) return 0f;
                    };
                };
                i += 3;
            };
        };

        // AUX
        if(b.liquids != null) {
            i = 0;
            iCap = aux.getLength();
            while(i < iCap) {
                if(effc < 0.0001f) return 0f;
                tmp = aux.get(i);
                fAmt = LCScript.toFloat(aux.get(i + 1));
                mtp = b.efficiencyScale() < 0.0001f ?
                    0f :
                    fAmt < 0.0001f ?
                        1f :
                        Math.min(b.liquids.get((Liquid) tmp) / fAmt * b.delta() * b.efficiencyScale(), 1f);
                effc *= mtp;
                i += 2;
            };
        };

        return Mathf.maxZero(effc);
    };


    public void consumeContinuous(GenericCrafter.GenericCrafterBuild b, float progIncLiq) throws NoSuchFieldException, IllegalAccessException {
        if(b.liquids == null) return;

        resolve(b);
        int i;
        long iCap;
        int j;
        long jCap;
        Object tmp;
        Liquid liq;
        float amt;

        // CI
        i = 0;
        iCap = ci.getLength();
        while(i < iCap) {
            tmp = ci.get(i);
            if(tmp instanceof NativeArray arr) {
                j = 0;
                jCap = arr.getLength();
                while(j < jCap) {
                    liq = (Liquid) arr.get(j);
                    if(b.liquids.get(liq) > 0.01f) {
                        amt = LCScript.toFloat(arr.get(j + 1));
                        b.liquids.remove(liq, Math.min(amt * progIncLiq * rcTimeScl, b.liquids.get(liq)));
                        LCScript.set(liq.name, amt, consTmpObj);
                        break;
                    };
                    j += 2;
                };
            } else {
                liq = (Liquid) tmp;
                amt = LCScript.toFloat(ci.get(i + 1));
                b.liquids.remove(liq, Math.min(amt * progIncLiq * rcTimeScl, b.liquids.get(liq)));
                LCScript.set(liq.name, amt, consTmpObj);
            };
            i += 2;
        };

        // AUX
        i = 0;
        iCap = aux.getLength();
        while(i < iCap) {
            liq = (Liquid) aux.get(i);
            amt = LCScript.toFloat(aux.get(i + 1));
            b.liquids.remove(liq, Math.min(amt * progIncLiq * rcTimeScl, b.liquids.get(liq)));
            LCScript.set(liq.name, amt, consTmpObj);
            i += 2;
        };
    };


    public void consumeBatch(GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        if(b.items == null && b.liquids == null) return;

        resolve(b);
        int i;
        long iCap;
        int j;
        long jCap;
        Object tmp;
        Object tmp1;
        int intAmt;
        float fAmt;
        float p;

        // BI
        i = 0;
        iCap = bi.getLength();
        while(i < iCap) {
            tmp = bi.get(i);
            if(tmp instanceof NativeArray arr) {
                j = 0;
                jCap = arr.getLength();
                while(j < jCap) {
                    tmp1 = arr.get(j);
                    intAmt = LCScript.toInt(arr.get(j + 1));
                    fAmt = LCScript.toFloat(arr.get(j + 1));
                    p = LCScript.toFloat(arr.get(j + 2));
                    if(b.items != null && tmp1 instanceof Item itm && (boolean) LCScript.invoke("consumeItem", FRAG_item, b, itm, intAmt, p)) {
                        LCScript.set(itm.name, intAmt * p, consTmpObj);
                        break;
                    };
                    if(b.liquids != null && tmp1 instanceof Liquid liq && LCCraftingHandler.addLiquidBatch(b, b, liq, -fAmt) > 0f) {
                        LCScript.set(liq.name, fAmt, consTmpObj);
                        break;
                    };
                    j += 3;
                };
            } else {
                intAmt = LCScript.toInt(bi.get(i + 1));
                fAmt = LCScript.toFloat(bi.get(i + 1));
                p = LCScript.toFloat(bi.get(i + 2));
                if(b.items != null && tmp instanceof Item itm) {
                    LCScript.invoke("consumeItem", FRAG_item, b, itm, intAmt, p);
                    LCScript.set(itm.name, intAmt * p, consTmpObj);
                };
                if(b.liquids != null && tmp instanceof Liquid liq) {
                    LCCraftingHandler.addLiquidBatch(b, b, liq, -fAmt);
                    LCScript.set(liq.name, fAmt, consTmpObj);
                };
            };
            i += 3;
        };

        // OPT
        if(opt.getLength() > 0) {
            NativeArray tup = getOptTup(b);
            if(tup != null) {
                Item itm = (Item) tup.get(0);
                intAmt = LCScript.toInt(tup.get(1));
                p = LCScript.toFloat(tup.get(2));
                LCScript.invoke("consumeItem", FRAG_item, b, itm, intAmt, p);
                LCScript.set(itm.name, intAmt * p, consTmpObj);
            };
        };
    };


    public void craftContinuous(GenericCrafter.GenericCrafterBuild b, float progIncLiq) throws NoSuchFieldException, IllegalAccessException {
        if(b.liquids == null) return;

        resolve(b);
        int i;
        long iCap;
        Liquid liq;
        float amt;

        // CO
        i = 0;
        iCap = co.getLength();
        while(i < iCap) {
            liq = (Liquid) co.get(i);
            amt = LCScript.toFloat(co.get(i + 1));
            if(LCScriptUtil.checkTimer("secTwo") && amt > 0f) {
                LCScriptUtil.fireTrigger("fluidProduce", b, liq);
            };
            b.handleLiquid(b, liq, Math.min(amt * progIncLiq * rcTimeScl, b.block.liquidCapacity - b.liquids.get(liq)));
            LCScript.set(liq.name, amt / b.timeScale(), prodTmpObj);
            i += 2;
        };
    };


    public void craftBatch(GenericCrafter.GenericCrafterBuild b, boolean failed) throws NoSuchFieldException, IllegalAccessException {
        resolve(b);
        int i;
        long iCap;
        Object tmp;
        int intAmt;
        float fAmt;
        float p;

        // BO
        if(!failed) {
            i = 0;
            iCap = bo.getLength();
            while(i < iCap) {
                tmp = bo.get(i);
                intAmt = LCScript.toInt(bo.get(i + 1));
                fAmt = LCScript.toFloat(bo.get(i + 1));
                p = LCScript.toFloat(bo.get(i + 2));
                if(b.items != null && tmp instanceof Item itm && b.items.get(itm) < b.getMaximumAccepted(itm)) {
                    LCScript.invoke("produceItem", FRAG_item, b, itm, intAmt, p);
                    LCScript.set(itm.name, intAmt * p, prodTmpObj);
                };
                if(b.liquids != null && tmp instanceof Liquid liq) {
                    LCCraftingHandler.addLiquidBatch(b, b, liq, fAmt, true);
                    LCScript.set(liq.name, fAmt, prodTmpObj);
                };
                i += 3;
            };
        };

        // FO
        if(b.items != null && failed) {
            i = 0;
            iCap = fo.getLength();
            Item itm;
            while(i < iCap) {
                itm = (Item) fo.get(i);
                intAmt = LCScript.toInt(fo.get(i + 1));
                p = LCScript.toFloat(fo.get(i + 2));
                if(b.items.get(itm) < b.getMaximumAccepted(itm)) {
                    LCScript.invoke("produceItem", FRAG_item, b, itm, intAmt, p);
                    LCScript.set(itm.name, intAmt * p, prodTmpObj);
                };
                i += 3;
            };
        };
    };


    public void dump(GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        resolve(b);
        int i;
        long iCap;
        Liquid liq;
        NativeArray dumpArr;

        if(b.liquids != null) {
            i = 0;
            iCap = co.getLength();
            int dir;
            while(i < iCap) {
                liq = (Liquid) co.get(i);
                dir = (blk.liquidOutputDirections.length > i / 2) ? blk.liquidOutputDirections[i / 2] : -1;
                b.dumpLiquid(liq, 2f, dir);
                i += 2;
            };

            dumpArr = LCScript.toArray(dumpTup.get(1));
            i = 0;
            iCap = dumpArr.getLength();
            while(i < iCap) {
                b.dumpLiquid((Liquid) dumpArr.get(i), 2f);
                i++;
            };
        };

        if(b.items != null && b.timer(Reflect.get(Block.class, blk, "timerDump"), blk.dumpTime / b.timeScale())) {
            dumpArr = LCScript.toArray(dumpTup.get(0));
            i = 0;
            iCap = dumpArr.getLength();
            while(i < iCap) {
                b.dump((Item) dumpArr.get(i));
                i++;
            };
        };
    };


};
