package com.agrosense.repository;

import com.agrosense.model.Crop;

import java.util.HashMap;
import java.util.Map;

public class CropRepository {

    private static final Map<String, Crop> crops = new HashMap<>();

    static {
        // Sample crops (we can expand to 200+ later)

        crops.put("maize", new Crop(
                "Maize",
                70,   // droughtTolerance
                65,   // heatTolerance
                40,   // floodTolerance
                60,   // marketVolatility
                55,   // fertilizerDependency
                60    // waterRequirement
        ));

        crops.put("rice", new Crop(
                "Rice",
                30,
                50,
                70,
                65,
                80,
                90
        ));

        crops.put("bajra", new Crop(
                "Bajra",
                85,
                80,
                40,
                40,
                30,
                35
        ));

        crops.put("soybean", new Crop(
                "Soybean",
                60,
                65,
                45,
                55,
                50,
                55
        ));
    }

    public static Crop getCropByName(String name) {
        return crops.get(name.toLowerCase());
    }

    public static Map<String, Crop> getAllCrops() {
        return crops;
    }
}
