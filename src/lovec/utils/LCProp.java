package lovec.utils;

import arc.math.Mathf;
import arc.util.Nullable;
import mindustry.Vars;
import mindustry.entities.bullet.BulletType;
import mindustry.entities.units.AIController;
import mindustry.gen.*;
import mindustry.graphics.Layer;
import mindustry.type.UnitType;
import mindustry.world.Block;

/**
 * Handles generalized properties.
 */
public class LCProp {


    /**
     * Gets size of some entity or its type (in block units).
     */
    public static float getSize(Object obj) {
        return getHitSize(obj) / Vars.tilesize;
    };


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
        };
        return 0f;
    };


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
        };
        return 0.0001f;
    };


    /**
     * Gets layer of some entity.
     */
    public static float getLayer(Object obj) {
        if(obj instanceof Unit unit) {
            return unit.elevation() > 0.5f || (unit.type.flying && unit.dead) ?
                    unit.type.flyingLayer :
                    (unit.type.groundLayer + Mathf.clamp(unit.hitSize() / 4000f, 0f, 0.01f));
        } else if(obj instanceof Block blk) {
            return blk.underBullets ?
                    Layer.blockUnder :
                    Layer.block;
        };
        return 0f;
    };


    /**
     * Gets health fraction of some entity.
     */
    public static float getHealthFrac(Object obj) {
        if(obj instanceof Healthc e) {
            return e.healthf();
        } else if(obj instanceof Bullet bul) {
            return bul.damage / bul.type.damage;
        };
        return 1f;
    };


    /**
     * Gets armor of some entity.
     */
    public static float getArmor(Object obj) {
        if(obj instanceof Building b) {
            return b.block.armor;
        } else if(obj instanceof Unit unit) {
            return unit.armorOverride() < 0.0 ? unit.armor : unit.armorOverride();
        };
        return 0f;
    };


    /**
     * Gets payload fraction of some entity.
     */
    public static float getPayloadFrac(Object obj, boolean nearCap) {
        if(obj instanceof Payloadc e) {
            // I don't think `Payloadc` can be cast to something other than unit, inform me if that happens
            return Mathf.clamp(e.payloadUsed() / Math.max(((Unit) e).type.payloadCapacity, 1f), 0f, nearCap ? 0.999f : 1f);
        };
        return 0f;
    };
    // Overload
    public static float getPayloadFrac(Object obj) {
        return getPayloadFrac(obj, false);
    };


    /**
     * Gets elevation of some entity.
     */
    public static float getElevation(Object obj) {
        if(obj instanceof Unit unit) {
            return Mathf.clamp(unit.elevation(), unit.type.shadowElevation, 1f) * unit.type.shadowElevationScl * (1f - unit.drownTime());
        };
        return 0f;
    };


    /**
     * Gets reload multiplier of some entity.
     */
    public static float getReloadMultiplier(Object obj, boolean isClamped) {
        float mtp = 1f;
        if(obj instanceof Unit unit) {
            mtp = unit.reloadMultiplier() * (unit.disarmed() ? 0f : 1f);
        } else if(obj instanceof Building b) {
            mtp = b.timeScale();
        };
        return !isClamped ?
            mtp :
            Mathf.clamp(mtp);
    };
    // Overload
    public static float getReloadMultiplier(Object obj) {
        return getReloadMultiplier(obj, false);
    };


    /**
     * Gets AI controller of some entity.
     * Null if controlled by player.
     */
    public static @Nullable AIController getAi(Object obj) {
        if(obj instanceof Unit unit) {
            return unit.isPlayer() ? null : (AIController) unit.controller();
        };
        return null;
    };


};
