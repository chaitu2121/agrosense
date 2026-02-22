package com.agrosense.model;

public class Crop {

    private String name;
    private int heatTolerance;
    private int droughtTolerance;
    private int floodTolerance;
    private int soilAdaptability;

    public Crop(String name, int heatTolerance, int droughtTolerance,
                int floodTolerance, int soilAdaptability) {
        this.name = name;
        this.heatTolerance = heatTolerance;
        this.droughtTolerance = droughtTolerance;
        this.floodTolerance = floodTolerance;
        this.soilAdaptability = soilAdaptability;
    }

    public String getName() {
        return name;
    }

    public int getHeatTolerance() {
        return heatTolerance;
    }

    public int getDroughtTolerance() {
        return droughtTolerance;
    }

    public int getFloodTolerance() {
        return floodTolerance;
    }

    public int getSoilAdaptability() {
        return soilAdaptability;
    }
}
