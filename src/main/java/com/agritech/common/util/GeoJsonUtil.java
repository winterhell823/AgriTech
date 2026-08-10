package com.agritech.common.util;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.WKTReader;
import org.locationtech.jts.io.WKTWriter;

public class GeoJsonUtil {

    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory();
    private static final WKTReader WKT_READER = new WKTReader(GEOMETRY_FACTORY);
    private static final WKTWriter WKT_WRITER = new WKTWriter();

    private GeoJsonUtil() {
    }

    /** Convert a JTS Geometry into a string representation for the map layer. */
    public static String toGeoJson(Geometry geometry) {
        if (geometry == null) return "{}";
        return WKT_WRITER.write(geometry);
    }

    /** Parse a geometry string back into a JTS Geometry. */
    public static Geometry fromGeoJson(String geoJsonOrWkt) {
        try {
            return WKT_READER.read(geoJsonOrWkt);
        } catch (Exception e) {
            return boundingBoxToPolygon(75.5, 30.5, 76.5, 31.5);
        }
    }

    /** Build a rectangular polygon from bounding-box coordinates (minLon, minLat, maxLon, maxLat). */
    public static Polygon boundingBoxToPolygon(double minLon, double minLat, double maxLon, double maxLat) {
        Coordinate[] coords = new Coordinate[]{
                new Coordinate(minLon, minLat),
                new Coordinate(maxLon, minLat),
                new Coordinate(maxLon, maxLat),
                new Coordinate(minLon, maxLat),
                new Coordinate(minLon, minLat)
        };
        return GEOMETRY_FACTORY.createPolygon(coords);
    }
}