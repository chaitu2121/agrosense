package com.agrosense;

import com.agrosense.model.Crop;
import com.agrosense.model.ScenarioInput;
import com.agrosense.engine.ClimateEngine;
import com.agrosense.repository.CropRepository;

public class Main {

    public static void main(String[] args) {

        // Get crop from repository
        Crop crop = CropRepository.getAllCrops().get(0);

        // Create future climate scenario
        ScenarioInput scenario = new ScenarioInput(
                3.0,   // temperature rise
                -30    // rainfall change
        );

        // Run climate engine
        ClimateEngine climateEngine = new ClimateEngine();
        int climateScore = climateEngine.calculateClimateScore(crop, scenario);

        System.out.println("Crop: " + crop.getName());
        System.out.println("Climate Score: " + climateScore);
    }
}
