package lovec.content;

import lovec.type.block.factory.MultiBlockLinkBlock;
import lovec.type.block.factory.MultiBlockLinkConstructBlock;

public class LCMultiBlockHandler {


    public static final int maxLinkBlockSize = 4;
    public static MultiBlockLinkBlock[] linkBlocks = new MultiBlockLinkBlock[maxLinkBlockSize];
    public static MultiBlockLinkBlock[] linkLiquidBlocks = new MultiBlockLinkBlock[maxLinkBlockSize];
    public static MultiBlockLinkConstructBlock[] linkConstructBlocks = new MultiBlockLinkConstructBlock[maxLinkBlockSize];


    public static void loadBlock() {
        for(int i = 0; i < maxLinkBlockSize; i++) {
            int size_i = i + 1;
            linkBlocks[i] = new MultiBlockLinkBlock("multiblock-link-block-" + size_i) {{
                size = size_i;
            }};
            linkLiquidBlocks[i] = new MultiBlockLinkBlock("multiblock-link-liquid-block-" + size_i) {{
                size = size_i;
                outputsLiquid = true;
            }};
            linkConstructBlocks[i] = new MultiBlockLinkConstructBlock("multiblock-link-construct-block-" + size_i) {{
                size = size_i;
            }};
        };
    };


};
