package lovec.content;

import arc.struct.ObjectMap;
import lovec.type.block.factory.MultiBlockLinkBlock;
import lovec.type.block.factory.MultiBlockLinkConstructBlock;

public class LCMultiBlockHandler {


    public static final int maxLinkBlockSize = 4;
    public static MultiBlockLinkBlock[] linkBlocks = new MultiBlockLinkBlock[maxLinkBlockSize];
    public static MultiBlockLinkBlock[] linkLiquidBlocks = new MultiBlockLinkBlock[maxLinkBlockSize];
    public static MultiBlockLinkBlock[] linkPowerBlocks = new MultiBlockLinkBlock[maxLinkBlockSize];
    public static MultiBlockLinkBlock[] linkLiquidPowerBlocks = new MultiBlockLinkBlock[maxLinkBlockSize];
    public static MultiBlockLinkConstructBlock[] linkConstructBlocks = new MultiBlockLinkConstructBlock[maxLinkBlockSize];
    public static ObjectMap<String, MultiBlockLinkBlock[]> uniqueLinkBlockMap = new ObjectMap<>();


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
            linkPowerBlocks[i] = new MultiBlockLinkBlock("multiblock-link-power-block-" + size_i) {{
                size = size_i;
                hasPower = true;
                consumePower(0f);
            }};
            linkLiquidPowerBlocks[i] = new MultiBlockLinkBlock("multiblock-link-liquid-power-block-" + size_i) {{
                size = size_i;
                outputsLiquid = true;
                hasPower = true;
                consumePower(0f);
            }};
            linkConstructBlocks[i] = new MultiBlockLinkConstructBlock("multiblock-link-construct-block-" + size_i) {{
                size = size_i;
            }};
        };
    };


};
