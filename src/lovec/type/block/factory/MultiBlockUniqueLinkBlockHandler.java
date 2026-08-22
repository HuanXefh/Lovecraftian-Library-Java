package lovec.type.block.factory;

import arc.Core;
import arc.func.Func2;
import lovec.content.LCMultiBlockHandler;
import mindustry.world.Block;

/**
 * For registration of unique link blocks.
 */
public interface MultiBlockUniqueLinkBlockHandler {


    String getUniqueLinkName();


    default MultiBlockLinkBlock[] getLinkBlocks() {
        return LCMultiBlockHandler.uniqueLinkBlockMap.get(getUniqueLinkName());
    };


    /**
     * Makes new unique link blocks.
     * Should be called inside a block's constructor.
     */
    default void requestUniqueLink(Block blk, Func2<Integer, Block, MultiBlockLinkBlock> linkBlkF) {
        Core.app.post(() -> {
            int maxSize = LCMultiBlockHandler.maxLinkBlockSize;
            boolean[] used = new boolean[maxSize];
            if(blk instanceof MultiBlockLinkCenterBlockFrag mblk) {
                int[] linkValues = mblk.getLinkValues();
                int tmpSize = 0;
                int sizeCur;
                for(int i = 0; i < linkValues.length; i += 3) {
                    sizeCur = linkValues[i + 2];
                    if(sizeCur > maxSize) continue;
                    tmpSize = Math.max(sizeCur, tmpSize);
                    used[sizeCur - 1] = true;
                };
                maxSize = tmpSize;
            };
            MultiBlockLinkBlock[] blks = new MultiBlockLinkBlock[maxSize];
            for(int i = 0; i < maxSize; i++) {
                if(!used[i]) continue;
                blks[i] = linkBlkF.get(i + 1, blk);
            };
            LCMultiBlockHandler.uniqueLinkBlockMap.put(getUniqueLinkName(), blks);
        });
    };


};
