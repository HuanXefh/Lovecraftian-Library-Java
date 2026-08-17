package lovec.graphics.drawer;

import arc.Core;
import arc.func.Floatf;
import arc.func.Func;
import arc.func.Intf;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.graphics.g2d.TextureRegion;
import arc.math.Angles;
import arc.math.Mathf;
import lovec.graphics.LCDraw;
import mindustry.gen.Building;
import mindustry.type.Item;
import mindustry.world.Block;
import mindustry.world.draw.DrawBlock;

/**
 * Draws piled items.
 * <br> <code>DEDICATION</code>: Inspired by Psammos.
 */
public class LCDrawItemPile extends DrawBlock {


    public float radius = 8f;
    public float itemWidth = 7f;
    public float z = -1f;
    public Item item;
    public Func<Building, Item> itemF;
    public float frac = -1f;
    public Floatf<Building> fracF;
    public int amount = -1;
    public Intf<Building> amountF;

    protected TextureRegion shaReg;


    @Override
    public void load(Block blk) {
        shaReg = Core.atlas.find("circle-shadow");

        if(item != null) {
            itemF = b -> item;
        };
        if(frac >= 0f) {
            fracF = b -> frac;
        } else if(itemF != null && blk.hasItems) {
            fracF = b -> (float) b.items.get(itemF.get(b)) / blk.itemCapacity;
        } else {
            fracF = b -> 1f;
        };
        if(amount >= 0) {
            amountF = b -> amount;
        };
    };


    @Override
    public void draw(Building b) {
        if(itemF == null) return;
        Item item0 = itemF.get(b);
        if(item0 == null) return;

        LCDraw.processZ(z >= 0f ? z : (Draw.z() + 0.5f));
        Angles.randLenVectors(b.id, Math.round(Mathf.maxZero(amountF.get(b) * fracF.get(b))), radius, (dx, dy) -> {
            Draw.color(Color.black, 0.4f);
            Draw.rect(shaReg, b.x + dx, b.y + dy, itemWidth * 1.6f, itemWidth * 1.6f);
            Draw.color();
            Draw.rect(item0.fullIcon, b.x + dx, b.y + dy, itemWidth, itemWidth, Mathf.randomSeed((long) (b.pos() + dx + dy * 10000), 0f, 360f));
        });
        LCDraw.processZ(-1f);
    };


};
