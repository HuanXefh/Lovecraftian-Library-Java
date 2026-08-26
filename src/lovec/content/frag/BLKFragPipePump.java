package lovec.content.frag;

import arc.math.Mathf;
import arc.util.Nullable;
import arc.util.Time;
import lovec.content.BuildContentFrag;
import lovec.content.ContentFrag;
import lovec.type.block.factory.MultiBlockLinkBlock;
import lovec.utils.LCPos;
import lovec.utils.LCScript;
import lovec.utils.LCScriptUtil;
import mindustry.gen.Building;
import mindustry.type.Liquid;
import mindustry.world.blocks.production.GenericCrafter;

public class BLKFragPipePump extends ContentFrag<GenericCrafter, BLKFragPipePump> {




    public static class BFragPipePump extends BuildContentFrag<GenericCrafter.GenericCrafterBuild, GenericCrafter, BFragPipePump> {


        protected @Nullable Building pumpBackB;
        protected @Nullable Liquid pumpLiqCur;
        protected float presBase;


        @Override
        public void onResolved() {
            super.onResolved();
            pumpBackB = (Building) LCScript.instanceGet(lastThis, "pumpBackB");
            pumpLiqCur = (Liquid) LCScript.instanceGet(lastThis, "pumpLiqCur");
            presBase = LCScript.toFloat(LCScript.instanceGet(lastThis, "presBase"));
        };


        @FragMethod
        public void updateTile() {
            GenericCrafter.GenericCrafterBuild b = getThis();
            resolve();

            if(LCScriptUtil.checkTimer("sec")) {
                b.onProximityUpdate();
                float pumpPresCur = 0f;
                if(pumpBackB != null) {
                    if(pumpBackB instanceof MultiBlockLinkBlock.MultiBlockLinkBuild omb) {
                        pumpBackB = omb.linkedBuild;
                    };
                    if(LCScript.instanceHas(pumpBackB, "ex_getPres")) {
                        pumpPresCur = LCScript.toFloat(LCScript.instanceInvoke(pumpBackB, "ex_getPres"));
                    };
                    if(LCScriptUtil.checkTemplate(pumpBackB.block, "BLK_pipePump")) {
                        pumpPresCur = presBase;
                    };
                };
                LCScript.instanceSet(b, "pumpBackB", pumpBackB);
                LCScript.instanceSet(b, "pumpPresCur", pumpPresCur);
            };

            if(pumpLiqCur != null && b.liquids.get(pumpLiqCur) < 0.1f) {
                pumpLiqCur = null;
                LCScript.instanceSet(b, "pumpLiqCur", pumpLiqCur);
            };

            presBase -= Mathf.equal(presBase, 0f, 0.005f) ? presBase : (presBase / 60f * Time.delta);
            LCScript.instanceSet(b, "presBase", presBase);
        };


        @FragMethod(boolMode = "and")
        public boolean acceptLiquid(Building b_f, Liquid liq) {
            GenericCrafter.GenericCrafterBuild b = getThis();
            resolve();

            if(b.liquids.get(liq) / blk.liquidCapacity >= 0.98f) return false;
            if(blk.consumesLiquid(liq)) return true;
            if(LCScriptUtil.checkCond("isAuxiliaryFluid", liq)) return false;
            if(LCPos.getRotation(b_f, b) != b.rotation) return false;
            if(pumpLiqCur != null && liq != pumpLiqCur) return false;

            pumpLiqCur = liq;
            LCScript.instanceSet(b, "pumpLiqCur", pumpLiqCur);

            return true;
        };


    };


};
