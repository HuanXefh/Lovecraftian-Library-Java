package lovec.utils;

import arc.graphics.Pixmap;
import arc.graphics.g2d.TextureRegion;
import arc.math.geom.Point2;
import arc.math.geom.Point3;
import arc.math.geom.Vec2;
import arc.math.geom.Vec3;
import arc.struct.ObjectMap;
import arc.struct.Seq;

/**
 * Stores various empty objects.
 */
public class LCAirObjects {


    public static final Seq seq = new Seq();
    public static final ObjectMap objectMap = new ObjectMap();

    public static final Point2 point2 = new Point2();
    public static final Point3 point3 = new Point3();
    public static final Vec2 vec2 = new Vec2();
    public static final Vec3 vec3 = new Vec3();

    public static final TextureRegion textureRegion = new TextureRegion();
    public static final Pixmap pixmap = new Pixmap(0, 0);


};
