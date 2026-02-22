// =============================================
// AGROSENSE MASTER DECISION ENGINE v2
// SCALABLE DATABASE MODEL
// =============================================


// ============================
// GLOBAL CROP DATABASE
// ============================

const CROP_DATABASE = {

    rice: {
        climate: { tropical: 90, arid: 40, temperate: 70 },
        water: { rain: 50, borewell: 85, drip: 90 },
        soil: { clay: 90, loamy: 80, sandy: 50, black: 75 },
        economic: 70,
        risk: 60
    },

    wheat: {
        climate: { tropical: 60, arid: 55, temperate: 85 },
        water: { rain: 65, borewell: 85, drip: 88 },
        soil: { loamy: 90, black: 85, sandy: 60 },
        economic: 75,
        risk: 70
    },

    bajra: {
        climate: { tropical: 70, arid: 90, temperate: 60 },
        water: { rain: 85, borewell: 80, drip: 90 },
        soil: { sandy: 85, loamy: 75, black: 70 },
        economic: 85,
        risk: 85
    },

    maize: {
        climate: { tropical: 80, arid: 65, temperate: 75 },
        water: { rain: 70, borewell: 82, drip: 88 },
        soil: { loamy: 85, black: 80, sandy: 65 },
        economic: 78,
        risk: 72
    },

    sugarcane: {
        climate: { tropical: 85, arid: 45, temperate: 65 },
        water: { rain: 40, borewell: 80, drip: 88 },
        soil: { black: 85, loamy: 80 },
        economic: 60,
        risk: 55
    }

};


// ============================
// MASTER SCORE ENGINE
// ============================

function calculateMasterScore(data){

    const cropData = CROP_DATABASE[data.crop];

    if(!cropData){
        return { error: "Crop not found in database." };
    }

    const climateScore = cropData.climate[data.climate] || 65;
    const waterScore = cropData.water[data.water] || 70;
    const soilScore = cropData.soil[data.soil] || 65;

    let economicScore = cropData.economic;
    let riskScore = cropData.risk;

    if(data.budget === "low") economicScore -= 10;
    if(data.budget === "high") economicScore += 5;

    if(data.riskTolerance === "low") riskScore -= 10;
    if(data.riskTolerance === "high") riskScore += 5;

    const finalScore =
        (climateScore * 0.25) +
        (waterScore * 0.25) +
        (soilScore * 0.15) +
        (economicScore * 0.20) +
        (riskScore * 0.15);

    return {
        climateScore,
        waterScore,
        soilScore,
        economicScore,
        riskScore,
        finalScore: Math.round(finalScore)
    };
}
