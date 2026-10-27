package lovec.content.updater;

import arc.math.Mathf;
import arc.util.Nullable;
import arc.util.Time;
import lovec.content.LCBuildUpdater;
import lovec.content.LCContentUpdater;
import lovec.type.block.factory.MultiBlockCrafter;
import lovec.type.block.factory.MultiBlockLinkBlock;
import lovec.utils.SLCPos;
import lovec.utils.SLCScript;
import lovec.utils.SLCScriptUtil;
import mindustry.gen.Building;
import mindustry.type.Liquid;

import java.lang.reflect.InvocationTargetException;

public class BLKPipePumpUpdater extends LCContentUpdater<MultiBlockCrafter> {


    public BLKPipePumpUpdater(MultiBlockCrafter blk) throws NoSuchFieldException, IllegalAccessException {
        super(blk);
    };




    public class BPipePumpUpdater extends LCBuildUpdater<MultiBlockCrafter.MultiBlockCrafterBuild, MultiBlockCrafter> {


        protected @Nullable Building pumpBackB;
        protected @Nullable Liquid pumpLiqCur;
        protected float presBase;


        public BPipePumpUpdater(MultiBlockCrafter.MultiBlockCrafterBuild b) throws NoSuchFieldException, IllegalAccessException {
            super(b);
        };


        @Override
        protected void resolve() throws NoSuchFieldException, IllegalAccessException {
            pumpBackB = (Building) get("pumpBackB");
            pumpLiqCur = (Liquid) get("pumpLiqCur");
            presBase = SLCScript.toFloat(get("presBase"));
        };


        @FragMethod
        public void updateTile() throws NoSuchFieldException, IllegalAccessException, InvocationTargetException, NoSuchMethodException {
            resolve();

            if(SLCScriptUtil.checkTimer("sec")) {
                b.onProximityUpdate();
                float pumpPresCur = 0f;
                if(pumpBackB != null) {
                    if(pumpBackB instanceof MultiBlockLinkBlock.MultiBlockLinkBuild omb) {
                        pumpBackB = omb.linkedBuild;
                    };
                    if(has(pumpBackB, "ex_getPres")) {
                        pumpPresCur = SLCScript.toFloat(invoke(pumpBackB, "ex_getPres"));
                    };
                    if(SLCScriptUtil.checkTemplate(pumpBackB.block, "BLK_pipePump")) {
                        pumpPresCur = presBase;
                    };
                };
                set("pumpBackB", pumpBackB);
                set("pumpPresCur", pumpPresCur);
            };

            if(pumpLiqCur != null && b.liquids.get(pumpLiqCur) < 0.1f) {
                pumpLiqCur = null;
                set("pumpLiqCur", pumpLiqCur);
            };

            presBase -= Mathf.equal(presBase, 0f, 0.005f) ? presBase : (presBase / 60f * Time.delta);
            set("presBase", presBase);
        };


        @FragMethod(boolMode = "and")
        public boolean acceptLiquid(Building b_f, Liquid liq) throws NoSuchFieldException, IllegalAccessException {
            if(b.liquids.get(liq) / blk.liquidCapacity >= 0.98f) return false;
            if(blk.consumesLiquid(liq)) return true;
            if(SLCScriptUtil.checkCond("isAuxiliaryFluid", liq)) return false;
            if(SLCPos.getRotation(b_f, b) != b.rotation) return false;

            pumpLiqCur = (Liquid) get("pumpLiqCur");
            if(pumpLiqCur != null && liq != pumpLiqCur) return false;

            pumpLiqCur = liq;
            set("pumpLiqCur", pumpLiqCur);

            return true;
        };


    };


};
