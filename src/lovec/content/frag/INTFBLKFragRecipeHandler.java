package lovec.content.frag;

import lovec.content.BuildContentFrag;
import lovec.content.ContentFrag;
import lovec.utils.LCScript;
import lovec.utils.LCScriptUtil;
import mindustry.type.Liquid;
import mindustry.world.blocks.production.GenericCrafter;
import rhino.NativeArray;
import rhino.NativeObject;

public class INTFBLKFragRecipeHandler extends ContentFrag<GenericCrafter> {




    public static class INTFBFragRecipeHandler extends BuildContentFrag<GenericCrafter.GenericCrafterBuild, GenericCrafter> {


        NativeObject rc;
        float rcTimeScl;
        NativeArray co;


        @Override
        public void onResolved() {
            super.onResolved();
            rc = LCScript.toObject(LCScript.instanceGet(lastThis, "rc"));
            rcTimeScl = LCScript.toFloat(rc.get("rcTimeScl"));
            co = LCScript.toArray(rc.get("co"));
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
                        if(!LCScriptUtil.checkCond("_isAuxiliaryFluid", liq)) {
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
