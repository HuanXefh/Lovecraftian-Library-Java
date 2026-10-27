package lovec.content;

import arc.math.Mathf;
import arc.util.Nullable;
import arc.util.Reflect;
import lovec.utils.SLCScript;
import lovec.utils.SLCScriptUtil;
import lovec.utils.extend.SLCNativeArray;
import mindustry.type.Item;
import mindustry.type.Liquid;
import mindustry.world.Block;
import mindustry.world.blocks.production.GenericCrafter;
import rhino.NativeArray;
import rhino.NativeObject;

import static lovec.utils.SLCScript.*;

public class LCRecipeHandler {


    private static NativeObject lastRc;
    private static GenericCrafter blk;
    private static float rcTimeScl;
    private static boolean ignoreItemFullness;
    private static NativeArray ci;
    private static NativeArray bi;
    private static NativeArray aux;
    private static boolean reqOpt;
    private static NativeArray opt;
    private static NativeArray co;
    private static NativeArray bo;
    private static NativeArray fo;
    private static boolean hasAnyFldOutputIncludeAux;
    private static NativeArray dumpTup;
    private static NativeObject consTmpObj;
    private static NativeObject prodTmpObj;


    public static void resolve(NativeObject rc, GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        if(rc == lastRc) return;

        lastRc = rc;
        blk = (GenericCrafter) b.block;
        rcTimeScl = SLCScript.toFloat(rc.get("rcTimeScl"));
        ignoreItemFullness = SLCScript.toBoolean(rc.get("ignoreItemFullness"));
        ci = SLCScript.toArray(rc.get("ci"));
        bi = SLCScript.toArray(rc.get("bi"));
        aux = SLCScript.toArray(rc.get("aux"));
        reqOpt = SLCScript.toBoolean(rc.get("reqOpt"));
        opt = SLCScript.toArray(rc.get("opt"));
        co = SLCScript.toArray(rc.get("co"));
        bo = SLCScript.toArray(rc.get("bo"));
        fo = SLCScript.toArray(rc.get("fo"));
        hasAnyFldOutputIncludeAux = SLCScript.toBoolean(rc.get("hasAnyFldOutputIncludeAux"));
        dumpTup = SLCScript.toArray(rc.get("dumpTup"));
        consTmpObj = SLCScript.toObject(SLCScript.instanceGet(b, "consTmpObj"));
        prodTmpObj = SLCScript.toObject(SLCScript.instanceGet(b, "prodTmpObj"));
    };


    public static boolean checkCanAdd(NativeObject rc, GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        resolve(rc, b);
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
                fAmt = SLCScript.toFloat(co.get(i + 1));
                if(b.liquids.get((Liquid) tmp) / b.block.liquidCapacity <= 0.98f) {
                    allFull = false;
                } else if(!blk.ignoreLiquidFullness && !blk.dumpExtraLiquid && fAmt > 0f && !SLCScriptUtil.checkCond("isAuxiliaryFluid", tmp)) {
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
            intAmt = SLCScript.toInt(bo.get(i + 1));
            fAmt = SLCScript.toFloat(bo.get(i + 1));
            p = SLCScript.toFloat(bo.get(i + 2));
            if(b.items != null && tmp instanceof Item item) {
                if(intAmt > 0 && !ignoreItemFullness && b.items.get(item) > b.getMaximumAccepted(item) - intAmt * p) return false;
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
                intAmt = SLCScript.toInt(fo.get(i + 1));
                if(intAmt > 0 && !ignoreItemFullness && b.items.get((Item) tmp) > b.getMaximumAccepted((Item) tmp) - intAmt) return false;
                i += 3;
            };
        };

        return true;
    };


    public static @Nullable NativeArray getOptTup(NativeObject rc, GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        if(b.items == null) return null;

        resolve(rc, b);
        NativeArray tup = SLCScript.newArray("LCRecipeHandler.getOptTup.newArr");
        int i = 0;
        long iCap = opt.getLength();
        Item item;
        int amt;
        float p;
        float mtp;
        float tmpMtp = 0f;

        while(i < iCap) {
            item = (Item) opt.get(i);
            amt = SLCScript.toInt(opt.get(i + 1));
            p = SLCScript.toFloat(opt.get(i + 2));
            mtp = SLCScript.toFloat(opt.get(i + 3));
            if(b.items.get(item) >= amt && mtp >= tmpMtp) {
                tmpMtp = mtp;
                SLCNativeArray.with(tup, item, amt, p, mtp);
            };
            i += 4;
        };

        return tup.getLength() == 0 ? null : tup;
    };


    public static float calcEffc(NativeObject rc, GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        if(b.cheating()) return 1f;

        resolve(rc, b);
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
            NativeArray tup = getOptTup(rc, b);
            if(reqOpt && tup == null) {
                SLCScript.instanceSet(b, "lastOptEffc", 0f);
                return 0f;
            };
            if(tup != null) {
                float optEffc = SLCScript.toFloat(tup.get(3));
                effc *= optEffc;
                SLCScript.instanceSet(b, "lastOptEffc", optEffc);
                SLCNativeArray.clear(tup);
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
                            fAmt = SLCScript.toFloat(arr.get(j + 1));
                            mtp = b.efficiencyScale() < 0.0001f || SLCScript.toFloat(SLCScript.instanceGet(b, "lastOptEffc")) < 0.0001f ?
                                0f :
                                Math.min(b.liquids.get((Liquid) arr.get(j)) / fAmt / SLCScript.toFloat(SLCScript.instanceGet(b, "lastOptEffc")) * b.delta() * b.efficiencyScale(), 1f);
                            allAbsent = false;
                            break;
                        };
                        j += 2;
                    };
                    if(allAbsent) {
                        mtp = 0f;
                    };
                } else {
                    fAmt = SLCScript.toFloat(ci.get(i + 1));
                    mtp = b.efficiencyScale() < 0.0001f || SLCScript.toFloat(SLCScript.instanceGet(b, "lastOptEffc")) < 0.0001f ?
                        0f :
                        fAmt < 0.0001f ?
                            1f:
                            Math.min(b.liquids.get((Liquid) tmp) / fAmt / SLCScript.toFloat(SLCScript.instanceGet(b, "lastOptEffc")) * b.delta() * b.efficiencyScale(), 1f);
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
                        intAmt = SLCScript.toInt(arr.get(j + 1));
                        fAmt = SLCScript.toFloat(arr.get(j + 1));
                        if(b.items != null && tmp1 instanceof Item item) {
                            if(b.items.get(item) >= intAmt) allAbsent = false;
                        };
                        if(b.liquids != null && tmp1 instanceof Liquid liq) {
                            if(b.liquids.get(liq) > fAmt - 0.0001f) allAbsent = false;
                        };
                        j += 3;
                    };
                    if(allAbsent) return 0f;
                } else {
                    intAmt = SLCScript.toInt(bi.get(i + 1));
                    fAmt = SLCScript.toInt(bi.get(i + 1));
                    if(b.items != null && tmp instanceof Item item) {
                        if(b.items.get(item) < intAmt) return 0f;
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
                fAmt = SLCScript.toFloat(aux.get(i + 1));
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


    public static void consumeContinuous(NativeObject rc, GenericCrafter.GenericCrafterBuild b, float progIncLiq) throws NoSuchFieldException, IllegalAccessException {
        if(b.liquids == null) return;

        resolve(rc, b);
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
                        amt = SLCScript.toFloat(arr.get(j + 1));
                        b.liquids.remove(liq, Math.min(amt * progIncLiq * rcTimeScl, b.liquids.get(liq)));
                        SLCScript.set(liq.name, amt, consTmpObj);
                        break;
                    };
                    j += 2;
                };
            } else {
                liq = (Liquid) tmp;
                amt = SLCScript.toFloat(ci.get(i + 1));
                b.liquids.remove(liq, Math.min(amt * progIncLiq * rcTimeScl, b.liquids.get(liq)));
                SLCScript.set(liq.name, amt, consTmpObj);
            };
            i += 2;
        };

        // AUX
        i = 0;
        iCap = aux.getLength();
        while(i < iCap) {
            liq = (Liquid) aux.get(i);
            amt = SLCScript.toFloat(aux.get(i + 1));
            b.liquids.remove(liq, Math.min(amt * progIncLiq * rcTimeScl, b.liquids.get(liq)));
            SLCScript.set(liq.name, amt, consTmpObj);
            i += 2;
        };
    };


    public static void consumeBatch(NativeObject rc, GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        if(b.items == null && b.liquids == null) return;

        resolve(rc, b);
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
                    intAmt = SLCScript.toInt(arr.get(j + 1));
                    fAmt = SLCScript.toFloat(arr.get(j + 1));
                    p = SLCScript.toFloat(arr.get(j + 2));
                    if(b.items != null && tmp1 instanceof Item item && (boolean) SLCScript.invoke("consumeItem", FRAG_item, b, item, intAmt, p)) {
                        SLCScript.set(item.name, intAmt * p, consTmpObj);
                        break;
                    };
                    if(b.liquids != null && tmp1 instanceof Liquid liq && SLCCraftingHandler.addLiquidBatch(b, b, liq, -fAmt) > 0f) {
                        SLCScript.set(liq.name, fAmt, consTmpObj);
                        break;
                    };
                    j += 3;
                };
            } else {
                intAmt = SLCScript.toInt(bi.get(i + 1));
                fAmt = SLCScript.toFloat(bi.get(i + 1));
                p = SLCScript.toFloat(bi.get(i + 2));
                if(b.items != null && tmp instanceof Item item) {
                    SLCScript.invoke("consumeItem", FRAG_item, b, item, intAmt, p);
                    SLCScript.set(item.name, intAmt * p, consTmpObj);
                };
                if(b.liquids != null && tmp instanceof Liquid liq) {
                    SLCCraftingHandler.addLiquidBatch(b, b, liq, -fAmt);
                    SLCScript.set(liq.name, fAmt, consTmpObj);
                };
            };
            i += 3;
        };

        // OPT
        if(opt.getLength() > 0) {
            NativeArray tup = getOptTup(rc, b);
            if(tup != null) {
                Item item = (Item) tup.get(0);
                intAmt = SLCScript.toInt(tup.get(1));
                p = SLCScript.toFloat(tup.get(2));
                SLCScript.invoke("consumeItem", FRAG_item, b, item, intAmt, p);
                SLCScript.set(item.name, intAmt * p, consTmpObj);
            };
        };
    };


    public static void craftContinuous(NativeObject rc, GenericCrafter.GenericCrafterBuild b, float progIncLiq) throws NoSuchFieldException, IllegalAccessException {
        if(b.liquids == null) return;

        resolve(rc, b);
        int i;
        long iCap;
        Liquid liq;
        float amt;

        // CO
        i = 0;
        iCap = co.getLength();
        while(i < iCap) {
            liq = (Liquid) co.get(i);
            amt = SLCScript.toFloat(co.get(i + 1));
            if(SLCScriptUtil.checkTimer("secTwo") && amt > 0f) {
                SLCScriptUtil.fireTrigger("fluidProduce", b, liq);
            };
            b.handleLiquid(b, liq, Math.min(amt * progIncLiq * rcTimeScl, b.block.liquidCapacity - b.liquids.get(liq)));
            SLCScript.set(liq.name, amt / b.timeScale(), prodTmpObj);
            i += 2;
        };
    };


    public static void craftBatch(NativeObject rc, GenericCrafter.GenericCrafterBuild b, boolean failed) throws NoSuchFieldException, IllegalAccessException {
        resolve(rc, b);
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
                intAmt = SLCScript.toInt(bo.get(i + 1));
                fAmt = SLCScript.toFloat(bo.get(i + 1));
                p = SLCScript.toFloat(bo.get(i + 2));
                if(b.items != null && tmp instanceof Item item && b.items.get(item) < b.getMaximumAccepted(item)) {
                    SLCScript.invoke("produceItem", FRAG_item, b, item, intAmt, p);
                    SLCScript.set(item.name, intAmt * p, prodTmpObj);
                };
                if(b.liquids != null && tmp instanceof Liquid liq) {
                    SLCCraftingHandler.addLiquidBatch(b, b, liq, fAmt, true);
                    SLCScript.set(liq.name, fAmt, prodTmpObj);
                };
                i += 3;
            };
        };

        // FO
        if(b.items != null && failed) {
            i = 0;
            iCap = fo.getLength();
            Item item;
            while(i < iCap) {
                item = (Item) fo.get(i);
                intAmt = SLCScript.toInt(fo.get(i + 1));
                p = SLCScript.toFloat(fo.get(i + 2));
                if(b.items.get(item) < b.getMaximumAccepted(item)) {
                    SLCScript.invoke("produceItem", FRAG_item, b, item, intAmt, p);
                    SLCScript.set(item.name, intAmt * p, prodTmpObj);
                };
                i += 3;
            };
        };
    };


    public static void dump(NativeObject rc, GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        resolve(rc, b);
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

            dumpArr = SLCScript.toArray(dumpTup.get(1));
            i = 0;
            iCap = dumpArr.getLength();
            while(i < iCap) {
                b.dumpLiquid((Liquid) dumpArr.get(i), 2f);
                i++;
            };
        };

        if(b.items != null && b.timer(Reflect.get(Block.class, blk, "timerDump"), blk.dumpTime / b.timeScale())) {
            dumpArr = SLCScript.toArray(dumpTup.get(0));
            i = 0;
            iCap = dumpArr.getLength();
            while(i < iCap) {
                b.dump((Item) dumpArr.get(i));
                i++;
            };
        };
    };


};
