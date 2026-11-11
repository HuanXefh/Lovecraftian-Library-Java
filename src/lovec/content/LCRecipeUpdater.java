package lovec.content;

import arc.math.Mathf;
import arc.util.Nullable;
import lovec.utils.SLCScript;
import lovec.utils.SLCScriptUtil;
import lovec.utils.extend.SLCNativeArray;
import mindustry.type.Item;
import mindustry.type.Liquid;
import mindustry.world.blocks.production.GenericCrafter;
import rhino.NativeArray;
import rhino.NativeObject;

import static lovec.utils.SLCScript.FRAG_item;

public class LCRecipeUpdater extends LCContentUpdater<NativeObject> {


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

    protected Object[] ciArr;
    protected Object[] biArr;
    protected Object[] auxArr;
    protected Object[] optArr;
    protected Object[] coArr;
    protected Object[] boArr;
    protected Object[] foArr;
    protected Object[][] dumpArr;

    protected int lastResolvedId = -1;
    protected GenericCrafter blk;
    protected NativeObject consTmpObj;
    protected NativeObject prodTmpObj;
    protected float dumpTimeCur;


    public LCRecipeUpdater(NativeObject rc) throws NoSuchFieldException, IllegalAccessException {
        super(rc);
    };


    @Override
    protected void targetSetInit() {
        rcTimeScl = SLCScript.toFloat(target.get("rcTimeScl"));
        ignoreItemFullness = SLCScript.toBoolean(target.get("ignoreItemFullness"));
        ci = SLCScript.toArray(target.get("ci"));
        bi = SLCScript.toArray(target.get("bi"));
        aux = SLCScript.toArray(target.get("aux"));
        reqOpt = SLCScript.toBoolean(target.get("reqOpt"));
        opt = SLCScript.toArray(target.get("opt"));
        co = SLCScript.toArray(target.get("co"));
        bo = SLCScript.toArray(target.get("bo"));
        fo = SLCScript.toArray(target.get("fo"));
        hasAnyFldOutputIncludeAux = SLCScript.toBoolean(target.get("hasAnyFldOutputIncludeAux"));
        dumpTup = SLCScript.toArray(target.get("dumpTup"));

        ciArr = ci.toArray();
        biArr = bi.toArray();
        auxArr = aux.toArray();
        optArr = opt.toArray();
        coArr = co.toArray();
        boArr = bo.toArray();
        foArr = fo.toArray();
        dumpArr = new Object[][]{
            SLCScript.toArray(dumpTup.get(0)).toArray(),
            SLCScript.toArray(dumpTup.get(1)).toArray(),
        };
    };


    protected void resolve(GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        if(lastResolvedId < 0 && b.id == lastResolvedId) return;

        lastResolvedId = b.id;
        blk = (GenericCrafter) b.block;
        consTmpObj = SLCScript.toObject(get(b, "consTmpObj"));
        prodTmpObj = SLCScript.toObject(get(b, "prodTmpObj"));
        dumpTimeCur = SLCScript.toFloat(get(b, "dumpTimeCur"));
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
            iCap = coArr.length;
            while(i < iCap) {
                tmp = coArr[i];
                fAmt = b.scaleOutput(SLCScript.toFloat(coArr[i + 1]));
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
        iCap = boArr.length;
        while(i < iCap) {
            tmp = boArr[i];
            intAmt = SLCScript.toInt(b.scaleOutput(SLCScript.toFloat(boArr[i + 1])));
            fAmt = b.scaleOutput(SLCScript.toFloat(boArr[i + 1]));
            p = SLCScript.toFloat(boArr[i + 2]);
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
            iCap = foArr.length;
            while(i < iCap) {
                tmp = foArr[i];
                intAmt = SLCScript.toInt(b.scaleOutput(SLCScript.toFloat(foArr[i + 1])));
                if(intAmt > 0 && !ignoreItemFullness && b.items.get((Item) tmp) > b.getMaximumAccepted((Item) tmp) - intAmt) return false;
                i += 3;
            };
        };

        return true;
    };


    public @Nullable NativeArray getOptTup(GenericCrafter.GenericCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
        if(b.items == null) return null;

        resolve(b);
        NativeArray tup = SLCScript.newArray("LCRecipeUpdater.getOptTup.newArr");
        int i = 0;
        long iCap = optArr.length;
        Item item;
        int amt;
        float p;
        float mtp;
        float tmpMtp = 0f;

        while(i < iCap) {
            item = (Item) optArr[i];
            amt = SLCScript.toInt(optArr[i + 1]);
            p = SLCScript.toFloat(optArr[i + 2]);
            mtp = SLCScript.toFloat(optArr[i + 3]);
            if(b.items.get(item) >= amt && mtp >= tmpMtp) {
                tmpMtp = mtp;
                SLCNativeArray.with(tup, item, amt, p, mtp);
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
        if(effc > 0f && optArr.length > 0) {
            NativeArray tup = getOptTup(b);
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
            iCap = ciArr.length;
            while(i < iCap) {
                if(effc < 0.0001f) return 0f;
                tmp = ciArr[i];
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
                    fAmt = SLCScript.toFloat(ciArr[i + 1]);
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
            iCap = biArr.length;
            while(i < iCap) {
                if(effc < 0.0001f) return 0f;
                tmp = biArr[i];
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
                    intAmt = SLCScript.toInt(biArr[i + 1]);
                    fAmt = SLCScript.toInt(biArr[i + 1]);
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
            iCap = auxArr.length;
            while(i < iCap) {
                if(effc < 0.0001f) return 0f;
                tmp = auxArr[i];
                fAmt = SLCScript.toFloat(auxArr[i + 1]);
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
        iCap = ciArr.length;
        while(i < iCap) {
            tmp = ciArr[i];
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
                amt = SLCScript.toFloat(ciArr[i + 1]);
                b.liquids.remove(liq, Math.min(amt * progIncLiq * rcTimeScl, b.liquids.get(liq)));
                SLCScript.set(liq.name, amt, consTmpObj);
            };
            i += 2;
        };

        // AUX
        i = 0;
        iCap = auxArr.length;
        while(i < iCap) {
            liq = (Liquid) auxArr[i];
            amt = SLCScript.toFloat(auxArr[i + 1]);
            b.liquids.remove(liq, Math.min(amt * progIncLiq * rcTimeScl, b.liquids.get(liq)));
            SLCScript.set(liq.name, amt, consTmpObj);
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
        iCap = biArr.length;
        while(i < iCap) {
            tmp = biArr[i];
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
                intAmt = SLCScript.toInt(biArr[i + 1]);
                fAmt = SLCScript.toFloat(biArr[i + 1]);
                p = SLCScript.toFloat(biArr[i + 2]);
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
        if(optArr.length > 0) {
            NativeArray tup = getOptTup(b);
            if(tup != null) {
                Item item = (Item) tup.get(0);
                intAmt = SLCScript.toInt(tup.get(1));
                p = SLCScript.toFloat(tup.get(2));
                SLCScript.invoke("consumeItem", FRAG_item, b, item, intAmt, p);
                SLCScript.set(item.name, intAmt * p, consTmpObj);
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
        iCap = coArr.length;
        while(i < iCap) {
            liq = (Liquid) coArr[i];
            amt = b.scaleOutput(SLCScript.toFloat(coArr[i + 1]));
            if(SLCScriptUtil.checkTimer("secTwo") && amt > 0f) {
                SLCScriptUtil.fireTrigger("fluidProduce", b, liq);
            };
            b.handleLiquid(b, liq, Math.min(amt * progIncLiq * rcTimeScl + 0.003f, b.block.liquidCapacity - b.liquids.get(liq)));
            SLCScript.set(liq.name, amt / b.timeScale(), prodTmpObj);
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
            iCap = boArr.length;
            while(i < iCap) {
                tmp = boArr[i];
                intAmt = SLCScript.toInt(b.scaleOutput(SLCScript.toFloat(boArr[i + 1])));
                fAmt = b.scaleOutput(SLCScript.toFloat(boArr[i + 1]));
                p = SLCScript.toFloat(boArr[i + 2]);
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
            iCap = foArr.length;
            Item item;
            while(i < iCap) {
                item = (Item) foArr[i];
                intAmt = SLCScript.toInt(b.scaleOutput(SLCScript.toFloat(foArr[i + 1])));
                p = SLCScript.toFloat(foArr[i + 2]);
                if(b.items.get(item) < b.getMaximumAccepted(item)) {
                    SLCScript.invoke("produceItem", FRAG_item, b, item, intAmt, p);
                    SLCScript.set(item.name, intAmt * p, prodTmpObj);
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

        if(b.liquids != null) {
            i = 0;
            iCap = coArr.length;
            int dir;
            while(i < iCap) {
                liq = (Liquid) coArr[i];
                dir = (blk.liquidOutputDirections.length > i / 2) ? blk.liquidOutputDirections[i / 2] : -1;
                b.dumpLiquid(liq, 2f, dir);
                i += 2;
            };

            i = 0;
            iCap = dumpArr[1].length;
            while(i < iCap) {
                b.dumpLiquid((Liquid) dumpArr[1][i], 2f);
                i++;
            };
        };

        if(b.items != null) {
            dumpTimeCur += b.timeScale();
            if(dumpTimeCur >= blk.dumpTime) {
                dumpTimeCur %= blk.dumpTime;
                i = 0;
                iCap = dumpArr[0].length;
                while(i < iCap) {
                    b.dump((Item) dumpArr[0][i]);
                    i++;
                };
            };
            set(b, "dumpTimeCur", dumpTimeCur);
        };
    };


};
