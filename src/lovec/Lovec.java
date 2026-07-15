package lovec;

import arc.Events;
import arc.util.*;
import lovec.utils.LCJavaScript;
import mindustry.game.EventType;
import mindustry.mod.*;

public class Lovec extends Mod{


    public Lovec() {
        Log.info("[LOVEC] Loaded Java classes.");
    };


    @Override
    public void init() {
        LCJavaScript.init();
    };


};
