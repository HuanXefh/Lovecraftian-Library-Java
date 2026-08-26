package lovec.content.frag;

import arc.struct.ObjectMap;
import arc.util.Nullable;
import lovec.content.BuildContentFrag;
import lovec.content.ContentFrag;
import lovec.utils.LCScript;
import lovec.utils.LCScriptUtil;
import mindustry.ctype.UnlockableContent;
import mindustry.gen.Building;
import mindustry.type.Item;
import mindustry.type.Liquid;
import mindustry.world.blocks.distribution.DirectionalUnloader;
import mindustry.world.blocks.production.GenericCrafter;
import mindustry.world.blocks.storage.Unloader;
import rhino.NativeArray;
import rhino.NativeObject;

public class INTFBLKFragRecipeHandler extends ContentFrag<GenericCrafter, INTFBLKFragRecipeHandler> {




    public static class INTFBFragRecipeHandler extends BuildContentFrag<GenericCrafter.GenericCrafterBuild, GenericCrafter, INTFBFragRecipeHandler> {


        protected NativeObject rc;
        protected float rcTimeScl;
        protected NativeArray co;
        protected @Nullable ObjectMap keyItmHeaderMap;
        protected @Nullable ObjectMap keyFldHeaderMap;
        protected @Nullable UnlockableContent keyCt;
        protected NativeArray itmAcceptCacheArr;
        protected NativeArray liqAcceptCacheArr;
        protected boolean blk$useAutoSelection;


        @Override
        @SuppressWarnings("ConstantConditions")
        public void onResolved() {
            super.onResolved();
            rc = LCScript.toObject(LCScript.instanceGet(lastThis, "rc"));
            rcTimeScl = LCScript.toFloat(rc.get("rcTimeScl"));
            co = LCScript.toArray(rc.get("co"));
            keyItmHeaderMap = (ObjectMap) rc.get("keyItmHeaderMap");
            keyFldHeaderMap = (ObjectMap) rc.get("keyFldHeaderMap");
            keyCt = (UnlockableContent) LCScript.instanceGet(lastThis, "keyCt");
            itmAcceptCacheArr = LCScript.toArray(LCScript.instanceGet(lastThis, "itmAcceptCacheArr"));
            liqAcceptCacheArr = LCScript.toArray(LCScript.instanceGet(lastThis, "liqAcceptCacheArr"));
            blk$useAutoSelection = LCScript.toBoolean(LCScript.instanceGet(lastThis, "blk$useAutoSelection"));
        };


        @SuppressWarnings("SimplifiableConditionalExpression")
        private boolean checkUnloader(Building b) {
            return b instanceof Unloader.UnloaderBuild ub ?
                ub.sortItem != null :
                b instanceof DirectionalUnloader.DirectionalUnloaderBuild ub ?
                    ub.unloadItem != null :
                    true;
        };


        @FragMethod(boolMode = "and")
        @SuppressWarnings("CollectionAddedToSelf")
        public boolean acceptItem(Building b_f, Item itm) {
            GenericCrafter.GenericCrafterBuild b = getThis();
            resolve();

            if(b.items == null || b.items.get(itm) >= b.getMaximumAccepted(itm)) return false;
            if(blk$useAutoSelection && keyItmHeaderMap != null && itm != keyCt && b_f != b && checkUnloader(b_f) && keyItmHeaderMap.containsKey(itm) && !LCScript.toBoolean(LCScript.protoInvoke("checkOutput", rc, itm))) {
                keyCt = itm;
                LCScript.instanceSet(b, "keyCt", keyCt);
            };

            LCScript.ensureLength(itmAcceptCacheArr, itm.id + 1);
            if(itmAcceptCacheArr.get(itm.id) == null) {
                itmAcceptCacheArr.put(itm.id, itmAcceptCacheArr, LCScript.protoInvoke("checkInput", rc, itm));
            };

            return (boolean) itmAcceptCacheArr.get(itm.id);
        };


        @FragMethod(boolMode = "and")
        @SuppressWarnings("CollectionAddedToSelf")
        public boolean acceptLiquid(Building b_f, Liquid liq) {
            GenericCrafter.GenericCrafterBuild b = getThis();
            resolve();

            if(b.liquids == null || b.liquids.get(liq) / b.block.liquidCapacity >= 0.98f) return false;
            if(blk$useAutoSelection && keyFldHeaderMap != null && liq != keyCt && b_f != b && keyFldHeaderMap.containsKey(liq) && !LCScript.toBoolean(LCScript.protoInvoke("checkOutput", rc, liq))) {
                keyCt = liq;
                LCScript.instanceSet(b, "keyCt", keyCt);
            };

            LCScript.ensureLength(liqAcceptCacheArr, liq.id + 1);
            if(liqAcceptCacheArr.get(liq.id) == null) {
                liqAcceptCacheArr.put(liq.id, liqAcceptCacheArr, LCScript.protoInvoke("checkInput", rc, liq));
            };

            return (boolean) liqAcceptCacheArr.get(liq.id);
        };


        @FragMethod
        public float ex_calcProgInc(float time) {
            GenericCrafter.GenericCrafterBuild b = getThis();

            resolve();
            float inc;
            if(blk.ignoreLiquidFullness) {
                inc = b.edelta() / time / rcTimeScl;
            } else {
                float val = 1f;
                float scl = 1f;
                boolean cond = false;
                long iCap = co.getLength();
                if(b.liquids != null && iCap > 0) {
                    val = 0f;
                    int i = 0;
                    Liquid liq;
                    float amt;
                    float tmpVal;
                    while(i < iCap) {
                        liq = (Liquid) co.get(i);
                        amt = LCScript.toFloat(co.get(i + 1));
                        tmpVal = amt < 0.0001f ? 1f : (blk.liquidCapacity - b.liquids.get(liq)) / (amt * b.edelta());
                        val = Math.max(val, tmpVal);
                        if(!LCScriptUtil.checkCond("isAuxiliaryFluid", liq)) {
                            scl = Math.min(scl, tmpVal);
                        };
                        cond = true;
                        i += 2;
                    };
                };
                if(!cond) val = 1f;
                inc = b.edelta() / time * (blk.dumpExtraLiquid ? Math.min(val, 1f) : scl) / rcTimeScl;
            };

            return Float.isNaN(inc) ?
                0f :
                inc;
        };


    };


};
