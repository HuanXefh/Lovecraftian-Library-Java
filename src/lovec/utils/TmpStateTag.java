package lovec.utils;

import java.util.HashMap;
import java.util.Map;

public enum TmpStateTag {


    alias("!ALIAS"),
    customValue("!CUSTOM"),
    error("!ERR"),
    needReplace("!REPLACE"),
    pending("!PENDING"),
    undefined("!UNDEF");


    private final String nameTag;


    TmpStateTag(String nameTag) {
        this.nameTag = nameTag;
    };


    @Override
    public String toString() {
        return nameTag;
    };


};
