package lovec.utils;

import mindustry.Vars;
import mindustry.entities.bullet.BulletType;
import mindustry.gen.Building;
import mindustry.gen.Bullet;
import mindustry.gen.Healthc;
import mindustry.gen.Unit;
import mindustry.type.UnitType;
import mindustry.world.Block;

public class LCGeneralizer {


    /**
     * Gets size of some entity or its type (in block units).
     */
    public static float getSize(Object obj) {
        return getHitSize(obj) / Vars.tilesize;
    }


    /**
     * Gets hit size of some entity or its type.
     */
    public static float getHitSize(Object obj) {
        if(obj instanceof Building b) {
            return b.hitSize();
        } else if(obj instanceof Block blk) {
            return blk.size * Vars.tilesize;
        } else if(obj instanceof Unit unit) {
            return unit.hitSize;
        } else if(obj instanceof UnitType utp) {
            return utp.hitSize;
        } else if(obj instanceof Bullet bul) {
            return bul.hitSize;
        } else if(obj instanceof BulletType btp) {
            return btp.hitSize;
        }
        return 0f;
    }


    /**
     * Gets clip size of some entity or its type.
     */
    public static float getClipSize(Object obj) {
        if(obj instanceof Building b) {
            return b.block.clipSize;
        } else if(obj instanceof Block blk) {
            return blk.clipSize;
        } else if(obj instanceof Unit unit) {
            return unit.clipSize();
        } else if(obj instanceof UnitType utp) {
            return utp.clipSize;
        } else if(obj instanceof Bullet bul) {
            return bul.type.drawSize;
        } else if(obj instanceof BulletType btp) {
            return btp.drawSize;
        }
        return 0.0001f;
    }


    /**
     * Gets health fraction of some entity.
     */
    public static float getHealthFrac(Object obj) {
        if(obj instanceof Healthc e) {
            return e.healthf();
        } else if(obj instanceof Bullet bul) {
            return bul.damage / bul.type.damage;
        }
        return 1f;
    }


    /**
     * Gets armor of some entity.
     */
    public static float getArmor(Object obj) {
        if(obj instanceof Building b) {
            return b.block.armor;
        } else if(obj instanceof Unit unit) {
            return unit.armorOverride() < 0.0 ? unit.armor : unit.armorOverride();
        }
        return 0f;
    }


}