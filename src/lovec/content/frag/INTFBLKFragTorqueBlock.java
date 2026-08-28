package lovec.content.frag;

import arc.math.Mathf;
import arc.util.Time;
import lovec.content.BuildContentFrag;
import lovec.content.ContentFrag;
import lovec.content.LCCraftingHandler;
import lovec.utils.LCScript;
import lovec.utils.LCScriptUtil;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.blocks.sandbox.LiquidSource;
import rhino.NativeArray;

public class INTFBLKFragTorqueBlock extends ContentFrag<Block, INTFBLKFragTorqueBlock> {




    public static class INTFBFragTorqueBlock extends BuildContentFrag<Building, Block, INTFBFragTorqueBlock> {


        protected boolean skipTorFetch;
        protected boolean skipTorSupply;
        protected float torCur;
        protected float torCap;
        protected float rpmCur;
        protected NativeArray torFetchTgs;
        protected NativeArray torTransTgs;
        protected NativeArray torSupplyTgs;


        @Override
        public void onResolved() {
            super.onResolved();
            skipTorFetch = LCScript.toBoolean(LCScript.instanceGet(blk, "skipTorFetch"));
            skipTorSupply = LCScript.toBoolean(LCScript.instanceGet(blk, "skipTorSupply"));
            torCur = LCScript.toFloat(LCScript.instanceGet(lastThis, "torCur"));
            torCap = LCScript.toFloat(LCScript.instanceGet(lastThis, "torCap"));
            rpmCur = LCScript.toFloat(LCScript.instanceGet(lastThis, "rpmCur"));
            torFetchTgs = LCScript.toArray(LCScript.instanceGet(lastThis, "torFetchTgs"));
            torTransTgs = LCScript.toArray(LCScript.instanceGet(lastThis, "torTransTgs"));
            torSupplyTgs = LCScript.toArray(LCScript.instanceGet(lastThis, "torSupplyTgs"));
        };


        @FragMethod
        public void ex_updateTor() {
            Building b = getThis();
            resolve();

            Building ob;
            float rateAddNet = 0f;
            float amtTransTg;
            int i;
            long iCap;

            // Update current torque
            if(!skipTorFetch) {
                i = 0;
                iCap = torFetchTgs.getLength();
                while(i < iCap) {
                    ob = (Building) torFetchTgs.get(i);
                    rateAddNet += ob.efficiency * LCScript.toFloat(torFetchTgs.get(i + 1));
                    i += 2;
                };
            };
            if(!skipTorSupply) {
                i = 0;
                iCap = torSupplyTgs.getLength();
                while(i < iCap) {
                    ob = (Building) torSupplyTgs.get(i);
                    rateAddNet -= ob.efficiency * LCScript.toFloat(torSupplyTgs.get(i + 1));
                    i += 2;
                };
            };
            if(torCap >= 0f) {
                // Cap torque by transported RPM
                torCur = Mathf.clamp(torCur + rateAddNet * Time.delta, 0f, torCap);
            };

            // Transport torque
            i = 0;
            iCap = torTransTgs.getLength();
            while(i < iCap) {
                ob = (Building) torTransTgs.get(i);
                if((boolean) LCScript.instanceInvoke(b, "ex_checkTorTransValid", ob)) {
                    amtTransTg = (LCScript.toFloat(LCScript.instanceGet(ob, "torCur")) + torCur) / 2f;
                    LCScript.instanceSet(ob, "torCur", amtTransTg);
                    torCur = amtTransTg;
                };
                i++;
            };

            // Update current RPM
            if(LCScriptUtil.checkTimer("secQuarter")) {
                rpmCur = LCScript.toFloat(LCScript.instanceInvoke(b, "ex_calcRpmTg"));
                if(rpmCur < 0.25f) {
                    rpmCur = 0f;
                };
                LCScript.instanceSet(b, "rpmCur", rpmCur);
            };

            LCScript.instanceSet(b, "torCur", torCur);
        };


        @FragMethod
        public void ex_supplyTor() {
            Building b = getThis();
            resolve();

            if(torCur < 1f) return;

            Building ob;
            float torRate;
            float rpmRate;
            int i = 0;
            long iCap = torSupplyTgs.getLength();
            while(i < iCap) {
                ob = (Building) torSupplyTgs.get(i);
                torRate = Math.min(LCScript.toFloat(torSupplyTgs.get(i + 1)), torCur) + 0.0001f;
                rpmRate = rpmCur / 60f + 0.0001f;
                if(ob.acceptLiquid(b, LCScriptUtil.auxTor)) {
                    ob.handleLiquid(b, LCScriptUtil.auxTor, torRate * b.edelta());
                };
                if(ob.acceptLiquid(b, LCScriptUtil.auxRpm)) {
                    ob.handleLiquid(b, LCScriptUtil.auxRpm, rpmRate * b.edelta());
                };
                if(LCScriptUtil.checkTimer("secFive") && ob.block.consumesLiquid(LCScriptUtil.auxRpm)) {
                    LCScript.instanceInvoke(b, "ex_updateRpmDmg", ob, rpmRate, LCScriptUtil.getConsAmt(LCScriptUtil.auxRpm.name, ob));
                };
                i += 2;
            };
        };


        @FragMethod
        public float ex_calcRpmTg() {
            Building b = getThis();
            resolve();

            float rpmTg = 0f;
            Building ob;
            float amt;
            int i;
            long iCap;

            torCap = 0f;

            // Gain RPM from torque producers
            if(!skipTorFetch) {
                i = 0;
                iCap = torFetchTgs.getLength();
                float rpmFetched;
                while(i < iCap) {
                    ob = (Building) torFetchTgs.get(i);
                    if(ob.isAdded() && ob.enabled && !ob.isPayload()) {
                        amt = LCScript.toFloat(torFetchTgs.get(i + 1));
                        if(ob instanceof LiquidSource.LiquidSourceBuild ob1) {
                            if(ob1.source == LCScriptUtil.auxTor) {
                                rpmTg += 100f;
                                torCap += 100f;
                            };
                        } else {
                            rpmFetched = LCCraftingHandler.addLiquid(ob, ob, LCScriptUtil.auxTor, -amt / ob.timeScale() * 15f, true, true, true) * amt * 60f;
                            rpmTg += rpmFetched;
                            torCap += rpmFetched;
                        };
                    };
                    i += 2;
                };
            };

            // No torque source, gain RPM from toque transfer blocks
            if(rpmTg < 0.0001f) {
                i = 0;
                iCap = torTransTgs.getLength();
                while(i < iCap) {
                    ob = (Building) torTransTgs.get(i);
                    if(ob.isAdded() && ob.enabled && !ob.isPayload() && LCScript.instanceHas(ob, "ex_calcRpmTrans") && (boolean) LCScript.instanceInvoke(b, "ex_checkTorTransValid", ob)) {
                        float rpmTrans = LCScript.toFloat(LCScript.instanceInvoke(ob, "ex_calcRpmTrans", b));
                        rpmTg = Math.max(rpmTg, rpmTrans * LCScript.toFloat(LCScript.instanceInvoke(b, "ex_calcRpmAcceptScl", ob)));
                        torCap = Math.max(torCap, rpmTrans);
                    };
                    i++;
                };
            };

            LCScript.instanceSet(b, "torCap", torCap);

            return rpmTg;
        };


    };


};
