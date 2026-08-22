package lovec.graphics.drawer.multiblock;

import arc.util.Nullable;
import arc.util.Tmp;
import lovec.annotation.JSONTypeClass;
import lovec.type.block.factory.MultiBlockLinkCenterBlockFrag;
import mindustry.Vars;
import mindustry.gen.Building;
import mindustry.type.Liquid;
import mindustry.world.Block;
import mindustry.world.blocks.liquid.LiquidBlock;

/**
 * Draws liquid tile for non-square structure.
 */
@JSONTypeClass
public class LCDrawMultiBlockLiquidTile extends LCDrawMultiBlock {


    public @Nullable Liquid drawLiquid;
    public float padding;
    public float padLeft = -1f;
    public float padRight = -1f;
    public float padTop = -1f;
    public float padBottom = -1f;
    public float alpha = 1f;

    protected int[] multiBlockSizes = new int[2];
    protected int liquidTileSize;
    protected float offPad;
    protected boolean vertical;


    public LCDrawMultiBlockLiquidTile() {
        super();

        rotate = true;
    };
    // Overload
    public LCDrawMultiBlockLiquidTile(Liquid drawLiquid) {
        this();

        this.drawLiquid = drawLiquid;
    };
    public LCDrawMultiBlockLiquidTile(Liquid drawLiquid, float padding) {
        this(drawLiquid);

        this.padding = padding;
    };


    @Override
    public void load(Block blk) {
        if(!blk.hasLiquids) throw new ClassCastException(blk.name + " has no liquid module!");

        super.load(blk);

        if(padLeft < 0) padLeft = padding;
        if(padRight < 0) padRight = padding;
        if(padTop < 0) padTop = padding;
        if(padBottom < 0) padBottom = padding;

        if(blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
            mblk.calcMaxSize(Tmp.p1, blk.size, 0);
            multiBlockSizes[0] = Tmp.p1.x;
            multiBlockSizes[1] = Tmp.p1.y;
            liquidTileSize = Math.max(Tmp.p1.x, Tmp.p1.y);
            vertical = Tmp.p1.x < Tmp.p1.y;
            offPad = Math.abs(Tmp.p1.x - Tmp.p1.y) * Vars.tilesize / 2f;
        } else {
            multiBlockSizes[0] = blk.size;
            multiBlockSizes[1] = blk.size;
            liquidTileSize = blk.size;
        };
    };


    @Override
    public void draw(Building b) {
        Liquid drawn = drawLiquid != null ? drawLiquid : b.liquids.current();
        float a = b.liquids.get(drawn) / b.block.liquidCapacity * alpha;
        calcMultiBlockOff(Tmp.v1, b.rotation).add(b).add(calcCenterOff(Tmp.v2, b.rotation));
        if(b.rotation % 2 == 0) {
            if(!vertical) {
                LiquidBlock.drawTiledFrames(liquidTileSize, Tmp.v1.x, Tmp.v1.y, padLeft, padRight, padTop + offPad, padBottom + offPad, drawn, a);
            } else {
                LiquidBlock.drawTiledFrames(liquidTileSize, Tmp.v1.x, Tmp.v1.y, padLeft + offPad, padRight + offPad, padTop, padBottom, drawn, a);
            };
        } else {
            if(!vertical) {
                LiquidBlock.drawTiledFrames(liquidTileSize, Tmp.v1.x, Tmp.v1.y, padTop + offPad, padBottom + offPad, padRight, padLeft, drawn, a);
            } else {
                LiquidBlock.drawTiledFrames(liquidTileSize, Tmp.v1.x, Tmp.v1.y, padTop, padBottom, padRight + offPad, padLeft + offPad, drawn, a);
            };
        };
    };


};
