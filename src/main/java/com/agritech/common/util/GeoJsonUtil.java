package com.agritech.common.util;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.geojson.GeoJsonReader;
import org.locationtech.jts.io.geojson.GeoJsonWriter;

public class GeoJsonUtil {

    private static final GeometryFactory GEOMETRY_FACTORY = new GeometryFactory();
    private static final GeoJsonReader READER = new GeoJsonReader();
    private static final GeoJsonWriter WRITER = new GeoJsonWriter();

    private GeoJsonUtil() {
    }

    /** Convert a JTS Geometry (e.g. a field boundary) into a GeoJSON string for the frontend map. */
    public static String toGeoJson(Geometry geometry) {
        return WRITER.write(geometry);
    }

    /** Parse a GeoJSON string (e.g. from a frontend request) back into a JTS Geometry. */
    public static Geometry fromGeoJson(String geoJson) {
        try {
            return READER.read(geoJson);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid GeoJSON: " + e.getMessage(), e);
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