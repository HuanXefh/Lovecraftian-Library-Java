package lovec.graphics;

import arc.math.geom.Vec2;
import arc.scene.style.BaseDrawable;
import arc.scene.style.TextureRegionDrawable;
import arc.scene.style.TransformDrawable;
import arc.struct.Seq;
import arc.util.Log;
import arc.util.Nullable;
import jdk.dynalink.beans.StaticClass;

import java.util.Stack;

/**
 * Stacked version of {@link TextureRegionDrawable}.
 */
public class StackDrawable extends BaseDrawable implements TransformDrawable {


    protected Seq<TextureRegionDrawable> drawables = new Seq<>();
    protected Seq<Vec2> offsets = new Seq<>();
    protected float[] scls;
    protected float leftHw;
    protected float rightHw;
    protected float topHw;
    protected float bottomHw;
    protected float stackW;


    public StackDrawable(Seq<TextureRegionDrawable> drawables, @Nullable Seq<Vec2> offsets, @Nullable float[] scls) {
        this.scls = new float[drawables.size];
        for(int i = 0; i < drawables.size; i++) {
            this.drawables.add(drawables.get(i));
            this.offsets.add(offsets != null ? offsets.get(i) : new Vec2());
            this.scls[i] = scls != null ? scls[i] : 1f;
        };
        computeHw();
    };
    // Overload
    public StackDrawable(Seq<TextureRegionDrawable> drawables, Seq<Vec2> offsets) {
        this(drawables, offsets, null);
    };
    public StackDrawable(Seq<TextureRegionDrawable> drawables) {
        this(drawables, null);
    };
    public StackDrawable() {
        // Do nothing
    };


    protected void computeHw() {
        for(int i = 0; i < drawables.size; i++) {
            leftHw = Math.max(drawables.get(i).getRegion().width * 0.5f * scls[i] - offsets.get(i).x, leftHw);
            rightHw = Math.max(drawables.get(i).getRegion().width * 0.5f * scls[i] + offsets.get(i).x, rightHw);
            topHw = Math.max(drawables.get(i).getRegion().width * 0.5f * scls[i] + offsets.get(i).y, topHw);
            bottomHw = Math.max(drawables.get(i).getRegion().width * 0.5f * scls[i] - offsets.get(i).y, bottomHw);
        };
        stackW = Math.max(Math.max(leftHw, rightHw), Math.max(topHw, bottomHw)) * 2f;
        setMinWidth(stackW);
        setMinHeight(stackW);
    };


    @Override
    public float imageSize() {
        return stackW;
    };


    @Override
    public void draw(float x, float y, float w, float h) {
        for(int i = 0; i < drawables.size; i++) {
            TextureRegionDrawable drawable = drawables.get(i);
            float scl = scls[i];

            drawable.draw(
                x + offsets.get(i).x * w / 32f,
                y + offsets.get(i).y * w / 32f,
                drawable.getRegion().width / 2f,
                drawable.getRegion().height / 2f,
                w,
                h,
                scl,
                scl,
                0f
            );
        };
    };


    @Override
    public void draw(float x, float y, float oriX, float oriY, float w, float h, float sclX, float sclY, float ang) {
        for(int i = 0; i < drawables.size; i++) {
            TextureRegionDrawable drawable = drawables.get(i);
            drawable.draw(x, y, oriX, oriY, w, h, sclX, sclY, ang);
            float scl = scls[i];

            drawable.draw(
                x + offsets.get(i).x,
                y + offsets.get(i).y,
                oriX,
                oriY,
                w,
                h,
                sclX,
                sclY,
                ang
            );
        };
    };


};
