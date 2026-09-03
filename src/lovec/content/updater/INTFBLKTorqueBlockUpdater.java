package lovec.content.updater;

import arc.math.Mathf;
import arc.util.Time;
import lovec.content.ContentUpdater;
import lovec.content.LCCraftingHandler;
import lovec.content.BuildUpdater;
import lovec.utils.LCScript;
import lovec.utils.LCScriptUtil;
import mindustry.gen.Building;
import mindustry.world.Block;
import mindustry.world.blocks.sandbox.LiquidSource;
import rhino.NativeArray;

import java.lang.reflect.InvocationTargetException;

public class INTFBLKTorqueBlockUpdater extends ContentUpdater<Block> {


    protected boolean skipTorFetch;
    protected boolean skipTorSupply;


    public INTFBLKTorqueBlockUpdater(Block blk) throws NoSuchFieldException, IllegalAccessException {
        super(blk);
    };


    @Override
    protected void resolve() throws NoSuchFieldException, IllegalAccessException {
        skipTorFetch = LCScript.toBoolean(get("skipTorFetch"));
        skipTorSupply = LCScript.toBoolean(get("skipTorSupply"));
    };




    public class INTFBTorqueBlockUpdater extends BuildUpdater<Building, Block> {


        protected float torCur;
        protected float torCap;
        protected float rpmCur;
        protected NativeArray torFetchTargets;
        protected NativeArray torTransTargets;
        protected NativeArray torSupplyTargets;


        public INTFBTorqueBlockUpdater(Building b) throws NoSuchFieldException, IllegalAccessException {
            super(b);
        };


        @Override
        protected void targetSetInit() throws NoSuchFieldException, IllegalAccessException {
            torFetchTargets = LCScript.toArray(get("torFetchTargets"));
            torTransTargets = LCScript.toArray(get("torTransTargets"));
            torSupplyTargets = LCScript.toArray(get("torSupplyTargets"));
        };


        @Override
        public void resolve() throws NoSuchFieldException, IllegalAccessException {
            torCur = LCScript.toFloat(get("torCur"));
            torCap = LCScript.toFloat(get("torCap"));
            rpmCur = LCScript.toFloat(get("rpmCur"));
        };


        @FragMethod
        public void ex_updateTor() throws NoSuchFieldException, IllegalAccessException, InvocationTargetException, NoSuchMethodException {
            resolve();

            Building ob;
            float rateAddNet = 0f;
            float amtTransTarget;
            int i;
            long iCap;

            // Update current torque
            if(!skipTorFetch) {
                i = 0;
                iCap = torFetchTargets.getLength();
                while(i < iCap) {
                    ob = (Building) torFetchTargets.get(i);
                    rateAddNet += ob.efficiency * LCScript.toFloat(torFetchTargets.get(i + 1));
                    i += 2;
                };
            };
            if(!skipTorSupply) {
                i = 0;
                iCap = torSupplyTargets.getLength();
                while(i < iCap) {
                    ob = (Building) torSupplyTargets.get(i);
                    rateAddNet -= ob.efficiency * LCScript.toFloat(torSupplyTargets.get(i + 1));
                    i += 2;
                };
            };
            if(torCap >= 0f) {
                // Cap torque by transported RPM
                torCur = Mathf.clamp(torCur + rateAddNet * Time.delta, 0f, torCap);
            };

            // Transport torque
            i = 0;
            iCap = torTransTargets.getLength();
            while(i < iCap) {
                ob = (Building) torTransTargets.get(i);
                if((boolean) invoke("ex_checkTorTransValid", ob)) {
                    amtTransTarget = (LCScript.toFloat(get(ob, "torCur")) + torCur) / 2f;
                    set(ob, "torCur", amtTransTarget);
                    torCur = amtTransTarget;
                };
                i++;
            };

            // Update current RPM
            if(LCScriptUtil.checkTimer("secQuarter")) {
                rpmCur = LCScript.toFloat(invoke("ex_calcRpmTarget"));
                if(rpmCur < 0.25f) {
                    rpmCur = 0f;
                };
                set("rpmCur", rpmCur);
            };

            set("torCur", torCur);
        };


        @FragMethod
        public void ex_supplyTor() throws NoSuchFieldException, IllegalAccessException, InvocationTargetException, NoSuchMethodException {
            resolve();

            if(torCur < 1f) return;

            Building ob;
            float torRate;
            float rpmRate;
            int i = 0;
            long iCap = torSupplyTargets.getLength();
            while(i < iCap) {
                ob = (Building) torSupplyTargets.get(i);
                torRate = Math.min(LCScript.toFloat(torSupplyTargets.get(i + 1)), torCur) + 0.0001f;
                rpmRate = rpmCur / 60f + 0.0001f;
                if(ob.acceptLiquid(b, LCScriptUtil.auxTor)) {
                    ob.handleLiquid(b, LCScriptUtil.auxTor, torRate * b.edelta());
                };
                if(ob.acceptLiquid(b, LCScriptUtil.auxRpm)) {
                    ob.handleLiquid(b, LCScriptUtil.auxRpm, rpmRate * b.edelta());
                };
                if(LCScriptUtil.checkTimer("secFive") && ob.block.consumesLiquid(LCScriptUtil.auxRpm)) {
                    invoke("ex_updateRpmDmg", ob, rpmRate, LCScriptUtil.getConsAmt(LCScriptUtil.auxRpm.name, ob));
                };
                i += 2;
            };
        };


        @FragMethod
        public float ex_calcRpmTarget() throws NoSuchFieldException, IllegalAccessException, InvocationTargetException, NoSuchMethodException {
            resolve();

            float rpmTarget = 0f;
            Building ob;
            float amt;
            int i;
            long iCap;

            torCap = 0f;

            // Gain RPM from torque producers
            if(!skipTorFetch) {
                i = 0;
                iCap = torFetchTargets.getLength();
                float rpmFetched;
                while(i < iCap) {
                    ob = (Building) torFetchTargets.get(i);
                    if(ob.isAdded() && ob.enabled && !ob.isPayload()) {
                        amt = LCScript.toFloat(torFetchTargets.get(i + 1));
                        if(ob instanceof LiquidSource.LiquidSourceBuild ob1) {
                            if(ob1.source == LCScriptUtil.auxTor) {
                                rpmTarget += 100f;
                                torCap += 100f;
                            };
                        } else {
                            rpmFetched = LCCraftingHandler.addLiquid(ob, ob, LCScriptUtil.auxTor, -amt * ob.efficiency / ob.timeScale() * 15f, true, true, true) * amt * 60f;
                            rpmTarget += rpmFetched;
                            torCap += rpmFetched;
                        };
                    };
                    i += 2;
                };
            };

            // No torque source, gain RPM from toque transfer blocks
            if(rpmTarget < 0.0001f) {
                i = 0;
                iCap = torTransTargets.getLength();
                while(i < iCap) {
                    ob = (Building) torTransTargets.get(i);
                    if(ob.isAdded() && ob.enabled && !ob.isPayload() && has(ob, "ex_calcRpmTrans") && (boolean) invoke("ex_checkTorTransValid", ob)) {
                        float rpmTrans = LCScript.toFloat(invoke(ob, "ex_calcRpmTrans", b));
                        rpmTarget = Math.max(rpmTarget, rpmTrans * LCScript.toFloat(invoke("ex_calcRpmAcceptScl", ob)));
                        torCap = Math.max(torCap, rpmTrans);
                    };
                    i++;
                };
            };

            set("torCap", torCap);

            return rpmTarget;
        };


    };


};
