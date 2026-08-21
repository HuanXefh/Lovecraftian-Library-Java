package lovec.type.block.factory;

import arc.struct.Seq;
import mindustry.gen.Building;

/**
 * <code>DEDICATION</code>: Inspired by MultiBlockLib.
 */
public interface MultiBlockLinkCenterBuildFrag {


    boolean getIsLinkCreated();
    void setIsLinkCreated(boolean bool);
    boolean getIsLinkValid();
    Seq<Building> getLinkedBuilds();
    Seq<Building[]> getLinkedProximityMap();
    int getDumpIndex();
    void setDumpIndex(int num);


    void updateLinkedBuilds();
    void updateLinkProximity();


};
