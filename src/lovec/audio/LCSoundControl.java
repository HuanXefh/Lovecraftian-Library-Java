package lovec.audio;

import arc.Core;
import arc.Events;
import arc.audio.Music;
import arc.func.Boolp;
import arc.util.Nullable;
import mindustry.Vars;
import mindustry.game.EventType;

/**
 * Used to mute vanilla sound control and play custom music.
 */
public class LCSoundControl {


    protected static Music musCur;
    protected static boolean isActive = false;
    protected static Boolp endF;
    protected static Boolp pauseF;


    public static void load() {
        Events.run(EventType.Trigger.update, LCSoundControl::update);
    };


    /**
     * Updates status of custom music.
     */
    public static void update() {
        if(isActive) {
            Vars.control.sound.stop();
        } else {
            if(musCur != null) {
                musCur.stop();
                musCur = null;
            };
        };

        if(endF != null && endF.get()) {
            stop();
        };

        if(musCur != null && pauseF != null) {
            musCur.pause(pauseF.get());
        };
    };


    /**
     * Stops custom music.
     */
    public static void stop() {
        isActive = false;
        endF = null;
        pauseF = null;
    };


    /**
     * Sets current music.
     */
    public static void setMusic(Music mus, @Nullable Boolp newEndF, @Nullable Boolp newPauseF) {
        if(musCur != null) {
            musCur.stop();
        };
        musCur = mus;
        musCur.play();
        isActive = true;
        musCur.setVolume(Core.settings.getInt("musicvol") / 100f);
        musCur.setLooping(true);

        if(newEndF != null) {
            endF = newEndF;
        };
        if(newPauseF != null) {
            pauseF = newPauseF;
        };
    };
    // Overload
    public static void setMusic(Music mus, @Nullable Boolp newEndF) {
        setMusic(mus, newEndF, null);
    };
    public static void setMusic(Music mus) {
        setMusic(mus, null);
    };


};
