package lovec.utils;

import arc.Core;
import arc.func.Cons;
import arc.func.Cons3;
import arc.math.Mathf;
import arc.math.geom.Geometry;
import arc.math.geom.Point2;
import arc.math.geom.Vec2;
import arc.util.Nullable;
import arc.util.Tmp;
import lovec.utils.extend.LCNativeArray;
import mindustry.Vars;
import mindustry.gen.Building;
import mindustry.gen.Unit;
import mindustry.type.Item;
import mindustry.world.Block;
import mindustry.world.Edges;
import mindustry.world.Tile;
import rhino.NativeArray;

/**
 * Handles position-related calculation and tile search.
 */
public class LCPos {


    public static Point2[][] sizeOffs = {
        {},
        {new Point2(0, 0)},
        {
            new Point2(0, 0), new Point2(1, 0),
            new Point2(0, 1), new Point2(1, 1),
        },
        {
            new Point2(-1, -1), new Point2(0, -1), new Point2(1, -1),
            new Point2(-1, 0), new Point2(0, 0), new Point2(1, 0),
            new Point2(-1, 1), new Point2(0, 1), new Point2(1, 1),
        },
        {
            new Point2(-1, -1), new Point2(0, -1), new Point2(1, -1), new Point2(2, -1),
            new Point2(-1, 0), new Point2(0, 0), new Point2(1, 0), new Point2(2, 0),
            new Point2(-1, 1), new Point2(0, 1), new Point2(1, 1), new Point2(2, 1),
            new Point2(-1, 2), new Point2(0, 2), new Point2(1, 2), new Point2(2, 2),
        },
        {
            new Point2(-2, -2), new Point2(-1, -2), new Point2(0, -2), new Point2(1, -2), new Point2(2, -2),
            new Point2(-2, -1), new Point2(-1, -1), new Point2(0, -1), new Point2(1, -1), new Point2(2, -1),
            new Point2(-2, 0), new Point2(-1, 0), new Point2(0, 0), new Point2(1, 0), new Point2(2, 0),
            new Point2(-2, 1), new Point2(-1, 1), new Point2(0, 1), new Point2(1, 1), new Point2(2, 1),
            new Point2(-2, 2), new Point2(-1, 2), new Point2(0, 2), new Point2(1, 2), new Point2(2, 2),
        },
    };


    /* <-------------------- basic --------------------> */


    /**
     * Converts integer position to world position.
     */
    public static int toIntCoord(float x) {
        return Math.round(x / Vars.tilesize);
    };


    /**
     * Converts world position to integer position.
     */
    public static float toFCoord(int tx, int size) {
        return tx * Vars.tilesize + (size % 2 == 0 ? (Vars.tilesize * 0.5f) : 0f);
    };
    // Overload
    public static float toFCoord(int tx) {
        return toFCoord(tx, 1);
    };


    /**
     * Gets rectangular width.
     */
    public static float calcRectW(float r, float size) {
        return (r * 2f + size) * Vars.tilesize;
    };


    /**
     * Gets rectangular half width.
     */
    public static float calcRectHW(float r, float size) {
        return (r + size * 0.5f) * Vars.tilesize;
    };


    /* <-------------------- distance --------------------> */


    /**
     * Calculates distance between tiles.
     */
    public static float calcTileDst(int tx1, int ty1, int tx2, int ty2) {
        return Mathf.dst(tx1, ty1, tx2, ty2) * Vars.tilesize;
    };
    // Overload
    public static float calcTileDst(@Nullable Tile t1, @Nullable Tile t2) {
        if(t1 == null || t2 == null) return Float.MAX_VALUE;

        return calcTileDst(t1.x, t1.y, t2.x, t2.y);
    };


    /* <-------------------- rotation --------------------> */


    /**
     * Calculates rotation from two positions.
     */
    public static int getRotation(float x1, float y1, float x2, float y2) {
        boolean
            cond1 = x2 >= x2,
            cond2 = y2 >= y1,
            cond3 = Math.abs(x2 - x1) >= Math.abs(y2 - y1);

        return cond1 ?
            (cond3 ? 0 : (cond2 ? 1 : 3)) :
            (cond3 ? 2 : (cond2 ? 1 : 3));
    };
    // Overload
    public static int getRotation(Tile t_f, Tile t_t) {
        return getRotation(t_f.x, t_f.y, t_t.x, t_t.y);
    };
    public static int getRotation(Building b_f, Building b_t) {
        return getRotation(b_f.tile, b_t.tile);
    };


    /* <-------------------- coordination --------------------> */


    /**
     * Gets the back side position.
     */
    public static Vec2 getCoordsBack(Vec2 out, float x, float y, float size, int rot) {
        int rot_fi = Mathf.mod(rot, 4);
        float
            off = (size + 0.5f) * Vars.tilesize / 2f,
            tgX = x,
            tgY = y;

        switch(rot_fi) {
            case 0 -> tgX = x - off;
            case 1 -> tgY = y - off;
            case 2 -> tgX = x + off;
            case 3 -> tgY = y + off;
        };

        return out.set(tgX, tgY);
    };


    private static int calcRectRotCenterSign(int rot, boolean isY) {
        int rot_fi = Mathf.mod(rot, 4);
        switch(rot_fi) {
            case 0 -> {
                return isY ? 0 : 1;
            }
            case 1 -> {
                return isY ? 1 : 0;
            }
            case 2 -> {
                return isY ? 0 : -1;
            }
            case 3 -> {
                return isY ? -1 : 0;
            }
        };
        return 0;
    };


    /**
     * Gets rotated rectangle center position.
     */
    public static Vec2 getCoordsRectRotCenter(Vec2 out, float x, float y, float r, int rot, float size) {
        float off = (size / 2f + r) * Vars.tilesize;
        out.set(
            x + calcRectRotCenterSign(rot, false) * off,
            y + calcRectRotCenterSign(rot, true) * off
        );
        return out;
    };


    /**
     * Gets player position.
     */
    public static Vec2 getCoordsPlayer(Vec2 out) {
        Unit unit = Vars.player.unit();
        return out.set(
            unit == null ? Float.MAX_VALUE : unit.x,
            unit == null ? Float.MAX_VALUE : unit.y
        );
    };


    /**
     * Iterates through each point on a line.
     */
    public static void forEachLinePoint(float x1, float y1, float x2, float y2, Cons3 cons3, float segScl, boolean noStart, boolean noEnd) {
        int segAmt = Mathf.ceil(Mathf.dst(x1, y1, x2, y2) / segScl / 48f);
        int i = noStart ? 1 : 0;
        int iCap = noEnd ? segAmt : (segAmt + 1);
        float ang = Mathf.angle(x2 - x1, y2 - y1);
        float frac_i;
        while(i < iCap) {
            frac_i = (float) i / segAmt;
            cons3.get(x1 + (x2 - x1) * frac_i, y1 + (y2 - y1) * frac_i, ang);
            i++;
        };
    };


    /* <-------------------- tile --------------------> */


    /**
     * Gets a tile by rotation from original tile, with another tile as the center.
     */
    public static @Nullable Tile getTileRectCenterRot(@Nullable Tile t, @Nullable Tile tCenter, int rot, float size, float sizeCenter) {
        if(t == null || tCenter == null) return null;

        int rot_fi = Mathf.mod(rot, 4);
        float
            off = size % 2 == 0 ? 0.5f : 0f,
            offCenter = sizeCenter % 2 == 0 ? 0.5f : 0f;

        Tmp.v1.set(t.x + off - tCenter.x - offCenter, t.y + off - tCenter.y - offCenter);
        switch(rot_fi) {
            case 0 -> Tmp.v2.set(Tmp.v1);
            case 1 -> Tmp.v2.set(-Tmp.v1.y, Tmp.v1.x);
            case 2 -> Tmp.v2.set(-Tmp.v1.x, -Tmp.v1.y);
            case 3 -> Tmp.v2.set(Tmp.v1.y, -Tmp.v1.x);
        }

        return Vars.world.tile(
            (int) (tCenter.x + Tmp.v2.x - off + offCenter),
            (int) (tCenter.y + Tmp.v2.y - off + offCenter)
        );
    };


    /**
     * Gets closest ore tile.
     */
    public static @Nullable Tile getTileOre(float x, float y, Item itm) {
        return Vars.indexer.findClosestOre(x, y, itm);
    };


    /**
     * Gets tile under mouse.
     */
    public static @Nullable Tile getTileMouse() {
        return Vars.headless ?
            null :
            Vars.world.tileWorld(Core.input.mouseWorldX(), Core.input.mouseWorldY());
    };


    /* <-------------------- tile list --------------------> */


    /**
     * Gets tiles on an edge.
     */
    public static NativeArray getTilesRot(@Nullable NativeArray contArr, @Nullable Tile t, int rot, int size) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCPos.getTilesRot.newArr");
        if(t == null) return arr;

        int iBase, iCap;
        if(size % 2 == 0) {
            iBase = (size / 2 - 1) * -1;
            iCap = size / 2 + 1;
        } else {
            iBase = (size - 1) / -2;
            iCap = (size - 1) / 2 + 1;
        };
        int px = 0, py = 0;
        int rot_fi = Mathf.mod(rot, 4);
        int i = iBase;
        if(size % 2 == 0) {
            while(i < iCap) {
                switch(rot_fi) {
                    case 0 -> {px = size / 2 + 1; py = i;}
                    case 1 -> {px = i; py = size / 2 + 1;}
                    case 2 -> {px = size / -2; py = i;}
                    case 3 -> {px = i; py = size / -2;}
                };
                LCNativeArray.pushUnique(arr, t.nearby(px, py));
                i++;
            };
        } else {
            while(i < iCap) {
                switch(rot_fi) {
                    case 0 -> {px = (size + 1) / 2; py = i;}
                    case 1 -> {px = i; py = (size + 1) / 2;}
                    case 2 -> {px = (size + 1) / -2; py = i;}
                    case 3 -> {px = i; py = (size + 1) / -2;}
                };
                LCNativeArray.pushUnique(arr, t.nearby(px, py));
                i++;
            };
        };

        return arr;
    };


    /**
     * Gets tiles on all four edges.
     */
    public static NativeArray getTilesEdge(@Nullable NativeArray contArr, @Nullable Tile t, int size, boolean isInnerEdge) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCPos.getTilesEdge.newArr");
        if(t == null) return arr;

        Point2[] pons = isInnerEdge ? Edges.getInsideEdges(size) : Edges.getEdges(size);
        int i = 0;
        int iCap = size * 4;
        while(i < iCap) {
            LCNativeArray.pushNonNull(arr, t.nearby(pons[i]));
            i++;
        };

        return arr;
    };
    // Overload
    public static NativeArray getTilesEdge(@Nullable NativeArray contArr, @Nullable Tile t, int size) {
        return getTilesEdge(contArr, t, size, false);
    };


    /**
     * Gets tiles in a rectangular range.
     */
    public static NativeArray getTilesRect(@Nullable NativeArray contArr, @Nullable Tile t, int r, int size) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCPos.getTilesRect.newArr");
        if(t == null) return arr;

        int iBase, iCap;
        if(size % 2 == 0) {
            iBase = -(size / 2 - 1 + r);
            iCap = -iBase + 2;
        } else {
            iBase = -((size - 1) / 2 + r);
            iCap = -iBase + 1;
        };
        int i;
        int j = iBase;
        while(j < iCap) {
            i = iBase;
            while(i < iCap) {
                LCNativeArray.pushNonNull(arr, t.nearby(i, j));
                i++;
            };
            j++;
        };

        return arr;
    };


    /**
     * Gets tiles that some block will occupy.
     */
    public static NativeArray getTilesBlock(@Nullable NativeArray contArr, Block blk, int tx, int ty) {
        return getTilesRect(contArr, Vars.world.tile(tx, ty), 0, blk.size);
    };


    /**
     * Gets tiles that some building occupies.
     */
    public static NativeArray getTilesBuild(@Nullable NativeArray contArr, Building b) {
        return getTilesRect(contArr, b.tile, 0, b.block.size);
    };


    /**
     * Variant of {@link #getTilesRect} where the rectangle is rotated.
     */
    public static NativeArray getTilesRectRotCenter(@Nullable NativeArray contArr, @Nullable Tile t, int r, int rot, int size) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCPos.getTilesRectRotCenter.newArr");
        if(t == null) return arr;

        getCoordsRectRotCenter(Tmp.v1, toFCoord(t.x, size), toFCoord(t.y, size), r, rot, size).scl(1f / Vars.tilesize).sub(r, r).add(0.5f, 0.5f);
        int tx = LCScript.toInt(Tmp.v1.x);
        int ty = LCScript.toInt(Tmp.v1.y);
        if(Vars.world.tile(tx, ty) == null) return arr;

        int i;
        int iCap = r * 2;
        int j = 0;
        while(j < iCap) {
            i = 0;
            while(i < iCap) {
                LCNativeArray.pushNonNull(arr, Vars.world.tile(tx + i, ty + j));
                i++;
            };
            j++;
        };

        return arr;
    };


    /**
     * Gets tiles in a circular range.
     * <br> TODO: This is dumb and should be improved someday.
     */
    public static NativeArray getTilesCircle(@Nullable NativeArray contArr, @Nullable Tile t, int r, int size) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCPos.getTilesCircle.newArr");
        if(t == null) return arr;

        int
            w = Vars.world.width(),
            h = Vars.world.height();

        if(size % 2 != 0) {
            Geometry.circle(t.x, t.y, w, h, r, (tx, ty) -> {
               Tile ot = Vars.world.tile(tx, ty);
               if(ot != null) {
                   LCNativeArray.push(arr, ot);
               };
            });
        } else {
            Tile ot0;
            for(int i = 0; i < 4; i++) {
                ot0 = t.nearby(sizeOffs[2][i]);
                if(ot0 == null) continue;
                Geometry.circle(ot0.x, ot0.y, w, h, r, (tx, ty) -> {
                   Tile ot = Vars.world.tile(tx, ty);
                   if(ot != null && !LCNativeArray.includes(arr, ot)) {
                       LCNativeArray.push(arr, ot);
                   };
                });
            };
        };

        return arr;
    };


    /**
     * Gets tiles in range by Manhattan distance.
     */
    public static NativeArray getTilesDstManhattan(@Nullable NativeArray contArr, @Nullable Tile t, int r) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCPos.getTilesDstManhattan.newArr");
        if(t == null) return arr;

        int
            iBase = -r,
            iCap = r + 1,
            jBase,
            jCap;

        for(int i = iBase; i < iCap; i++) {
            jBase = -(r - Math.abs(i));
            jCap = -jBase + 1;
            for(int j = jBase; j < jCap; j++) {
                LCNativeArray.pushNonNull(arr, t.nearby(i, j));
            };
        };

        return arr;
    };


    /**
     * Gets linked tiles of some tile.
     */
    public static NativeArray getTilesLinked(@Nullable NativeArray contArr, @Nullable Tile t) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCPos.getTilesLinked.newArr");
        if(t == null) return arr;

        t.getLinkedTiles(ot -> LCNativeArray.push(arr, ot));

        return arr;
    };


    /**
     * Iterates through linked tiles of some tile.
     */
    public static void eachTileLinked(@Nullable Tile t, Cons<Tile> cons) {
        if(t == null) return;

        t.getLinkedTiles(cons);
    };


};
