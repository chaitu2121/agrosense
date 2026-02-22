package com.agrosense.model;

public class ScenarioInput {

    private double temperatureRise;   // in °C
    private double rainfallChange;    // % increase or decrease

    public ScenarioInput(double temperatureRise, double rainfallChange) {
        this.temperatureRise = temperatureRise;
        this.rainfallChange = rainfallChange;
    }

    public double getTemperatureRise() {
        return temperatureRise;
    }

    public double getRainfallChange() {
        return rainfallChange;
    }
}
