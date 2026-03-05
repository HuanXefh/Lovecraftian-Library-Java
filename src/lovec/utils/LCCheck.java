package lovec.utils;

import arc.Core;
import arc.math.Mathf;
import arc.util.Nullable;
import arc.util.Tmp;
import mindustry.Vars;
import mindustry.game.Team;
import mindustry.gen.*;
import mindustry.world.blocks.environment.EmptyFloor;

public class LCCheck {


    /* <-------------------- position --------------------> */


    /**
     * Whether (x, y) is in screen.
     */
    public static boolean checkPosVisible(float x, float y, float clipSize) {
        return Core.camera.bounds(Tmp.r1).overlaps(Tmp.r2.setCentered(x, y, clipSize));
    }
    // Overloading
    public static boolean checkPosVisible(float x, float y) {
        return checkPosVisible(x, y, 0.0001f);
    }


    /**
     * Whether a circular range at (x, y) has mouse.
     */
    public static boolean checkPosHovered(float x, float y, float rad) {
        return Mathf.dst(x, y, Core.input.mouseWorldX(), Core.input.mouseWorldY()) < rad;
    }


    /**
     * Whether a rectangular range at (x, y) has mouse.
     */
    public static boolean checkPosHoveredRect(float x, float y, float r, float size) {
        var hw = LCFormat.calcRectHW(r, size);
        return Math.abs(x - Core.input.mouseWorldX()) < hw && Math.abs(y - Core.input.mouseWorldY()) < hw;
    }
    // Overloading
    public static boolean checkPosHoveredRect(float x, float y) {
        return checkPosHoveredRect(x, y, 0f, 1f);
    }


    /**
     * Whether floor at (x, y) supports shadow.
     */
    public static boolean checkPosCanShadow(float x, float y) {
        var flr = Vars.world.floorWorld(x, y);
        return flr != null && flr.canShadow && !(flr instanceof EmptyFloor);
    }


    /* <-------------------- entity --------------------> */


    /**
     * Whether this entity is visible now.
     */
    public static boolean checkEntityVisible(Object obj) {
        if(obj instanceof Building b) {
            return checkPosVisible(b.x, b.y, LCGeneralizer.getClipSize(b));
        } else if(obj instanceof Unit unit) {
            return !unit.inFogTo(Vars.player.team()) && checkPosVisible(unit.x, unit.y, LCGeneralizer.getClipSize(unit));
        } else if(obj instanceof Bullet bul) {
            return checkPosVisible(bul.x, bul.y, LCGeneralizer.getClipSize(bul));
        }
        return true;
    }


    /**
     * Whether this entity is hostile to some team.
     */
    public static boolean checkHostile(Teamc e, @Nullable Team team) {
        return e.team() != Team.derelict && (team == null || e.team() != team);
    }


    /**
     * Whether this entity is now healable.
     */
    public static boolean checkHealable(Healthc e, @Nullable Team team) {
        return e.damaged() && (team == null || (!(e instanceof Teamc e1) || e1.team() == team)) && (!(e instanceof Building b) || !b.isHealSuppressed());
    }


}
