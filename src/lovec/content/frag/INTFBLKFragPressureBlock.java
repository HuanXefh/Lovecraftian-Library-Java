package lovec.content.frag;

import arc.math.Mathf;
import arc.util.Log;
import arc.util.Time;
import lovec.content.BuildContentFrag;
import lovec.content.ContentFrag;
import lovec.content.LCCraftingHandler;
import lovec.type.block.factory.MultiBlockLinkBlock;
import lovec.utils.LCScript;
import lovec.utils.LCScriptUtil;
import lovec.utils.extend.LCNativeArray;
import lovec.utils.extend.LCNumber;
import mindustry.gen.Building;
import mindustry.type.Item;
import mindustry.type.Liquid;
import mindustry.world.Block;
import mindustry.world.blocks.distribution.ChainedBuilding;
import rhino.NativeArray;

import static lovec.utils.LCScript.VAR;

public class INTFBLKFragPressureBlock extends ContentFrag<Block, INTFBLKFragPressureBlock> {




    public static class INTFBFragPressureBlock extends BuildContentFrag<Building, Block, INTFBFragPressureBlock> {

        public static final float presResAllowRange = 0.5f;
        public static final float presThrAllowRange = 0.15f;
        public static final float presOverSupplyAmt = 5.5f / 60f;

        protected float presThr;
        protected boolean skipPresSupply;
        protected float presRes;
        protected float vacRes;
        protected float presBase;
        protected float presTmp;
        protected float presTg;
        protected float presExtra;
        protected NativeArray presFetchTgs;
        protected NativeArray presSupplyTgs;
        protected int presSupplyIncre;


        @Override
        public void onResolved() {
            super.onResolved();
            presThr = LCScript.toFloat(LCScript.instanceGet(blk, "presThr"));
            skipPresSupply = LCScript.toBoolean(LCScript.instanceGet(blk, "skipPresSupply"));
            presRes = LCScript.toFloat(LCScript.instanceGet(blk, "presRes"));
            vacRes = LCScript.toFloat(LCScript.instanceGet(blk, "vacRes"));
            presBase = LCScript.toFloat(LCScript.instanceGet(lastThis, "presBase"));
            presTmp = LCScript.toFloat(LCScript.instanceGet(lastThis, "presTmp"));
            presTg = LCScript.toFloat(LCScript.instanceGet(lastThis, "presTg"));
            presExtra = LCScript.toFloat(LCScript.instanceGet(lastThis, "presExtra"));
            presFetchTgs = LCScript.toArray(LCScript.instanceGet(lastThis, "presFetchTgs"));
            presSupplyTgs = LCScript.toArray(LCScript.instanceGet(lastThis, "presSupplyTgs"));
            presSupplyIncre = LCScript.toInt(LCScript.instanceGet(lastThis, "presSupplyIncre"));
        };


        @FragMethod
        public void updateTile() {
            Building b = getThis();
            resolve(true);

            if(LCScriptUtil.getParamCond("UPDATE_SUPPRESSED")) return;

            // Update smooth pressure
            if(LCScriptUtil.checkTimer("secQuarter")) {
                LCScript.instanceInvoke(b, "ex_updatePresTg");
                presTmp = (presTmp + presTg) / 2f;
                if(Mathf.equal(presTmp, 0f, 0.005f)) {
                    presTmp = 0f;
                };
                LCScript.instanceSet(b, "presTmp", presTmp);
            };

            boolean hasPres = !Mathf.equal(presTmp, 0f);

            if(hasPres) {
                b.noSleep();
                if(b instanceof ChainedBuilding cb && cb.next() != null) {
                    cb.next().noSleep();
                };
            };

            if(LCScriptUtil.checkTimer("sec") && hasPres) {
                LCScript.instanceInvoke(b, "ex_updatePresSupplyTgs");
            };

            // Apply damage if over limit
            if(!LCScriptUtil.getParamCond("UPDATE_DEEP_SUPPRESSED") && LCScriptUtil.checkTimer("secQuarter") && LCScriptUtil.syncChance("pressure", 0.25f)) {
                float presTotal = presTmp + presExtra;
                boolean overLimit = presTotal > 0f ?
                    presTotal > (presRes + presResAllowRange) :
                    presTotal < (vacRes - presResAllowRange);
                if(overLimit) {
                    float dmg = (b.maxHealth * LCScript.toFloat(LCScript.search(VAR, "param", "presDmgFrac")) + LCScript.toFloat(LCScript.search(VAR, "param", "presDmgMin"))) * (
                        presTmp > 0f ?
                            (presTmp / Math.max(presRes, 0.0001f)) :
                            (-presTmp / Math.max(-vacRes, 0.0001f))
                    );
                    b.damagePierce(dmg);
                };
            };

            // Base pressure spontaneously drops
            if(Mathf.equal(presBase, 0f, 0.005f)) {
                presBase = 0f;
            } else {
                presBase -= presBase / 60f * Time.delta;
            };
            LCScript.instanceSet(b, "presBase", presBase);

            // Supply auxiliary fluid
            if(!skipPresSupply && hasPres && presSupplyTgs.getLength() > 0) {
                presSupplyIncre++;
                LCScript.instanceSet(b, "presSupplyIncre", presSupplyIncre);
                Building b_t = (Building) presSupplyTgs.get(presSupplyIncre % presSupplyTgs.getLength());
                if(b_t.isAdded() && b_t.enabled && !b_t.isPayload()) {
                    Liquid aux = presTmp >= 0f ? LCScriptUtil.auxPres : LCScriptUtil.auxVac;
                    float addAmt = Math.abs(LCNumber.roundFixed(presTmp, 0)) / 60f;
                    float consAmt = LCScriptUtil.getConsAmt(aux.name, b_t);
                    LCCraftingHandler.addLiquid(b_t, null, aux, addAmt, false, false, true);
                    // Deal damage if too much supplied
                    if(consAmt > 0f && addAmt - consAmt > presOverSupplyAmt) {
                        float dmg = (b_t.maxHealth * LCScript.toFloat(LCScript.search(VAR, "param", "presDmgFrac")) + LCScript.toFloat(LCScript.search(VAR, "param", "presDmgMin"))) / 5f;
                        b_t.damagePierce(dmg);
                    };
                };
            };
        };


        @FragMethod
        public boolean acceptItem(Building b_f, Item itm) {
            Building b = getThis();
            resolve();

            if(Mathf.equal(presThr, 0f)) return true;
            return presThr > 0f ?
                presTmp >= presThr - presThrAllowRange :
                presTmp <= presThr + presThrAllowRange;
        };


        @FragMethod
        public boolean acceptLiquid(Building b_f, Liquid liq) {
            Building b = getThis();
            resolve();

            if(Mathf.equal(presThr, 0f)) return true;
            return presThr > 0f ?
                presTmp >= presThr - presThrAllowRange :
                presTmp <= presThr + presThrAllowRange;
        };


        @FragMethod
        public void ex_updatePresTg() {
            Building b = getThis();
            resolve();

            presTg = presBase;
            Building ob;
            float scl;
            int i = 0;
            long iCap = presFetchTgs.getLength();
            while(i < iCap) {
                ob = (Building) presFetchTgs.get(i);
                if(ob.isAdded() && ob.enabled && !ob.isPayload() && LCScript.instanceHas(ob, "ex_getPres")) {
                    scl = 1f;
                    if(LCScript.instanceHas(ob, "ex_getPresTransScl")) {
                        scl = LCScript.toFloat(LCScript.instanceInvoke(ob, "ex_getPresTransScl", b));
                    };
                    presTg += LCScript.toFloat(LCScript.instanceInvoke(ob, "ex_getPres")) * scl;
                };
                i++;
            };

            LCScript.instanceSet(b, "presTg", presTg);
        };


        @FragMethod
        public void ex_updatePresSupplyTgs() {
            Building b = getThis();
            resolve();

            LCNativeArray.clear(presSupplyTgs);
            Liquid aux = presTmp >= 0f ? LCScriptUtil.auxPres : LCScriptUtil.auxVac;
            b.proximity.each(ob -> {
                ob = ob.getLiquidDestination(b, aux);
                if(ob == null) return;
                if(ob instanceof MultiBlockLinkBlock.MultiBlockLinkBuild omb) {
                    ob = omb.linkedBuild;
                };
                if(ob.acceptLiquid(b, aux) && (boolean) LCScript.instanceInvoke(b, "ex_checkPresSupplyValid", ob)) {
                    LCNativeArray.push(presSupplyTgs, ob);
                };
            });
        };


    };


};
