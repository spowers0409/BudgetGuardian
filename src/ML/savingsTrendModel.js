import * as tf from "@tensorflow/tfjs";

let trainedModel = null;

export async function trainSavingsModel(pastSavings) {
    if (pastSavings.length < 3) {
        console.warn("Not enough data to train the model.");
        return [];
    }

    // Dispose of previous model before training a new one
    if (trainedModel) {
        console.log("🧹 Cleaning up old model...");
        trainedModel.dispose();
        trainedModel = null;
    }

    console.log("Training new model...");

    // Prepare training data
    const xs = pastSavings.slice(0, -1);
    const ys = pastSavings.slice(1);

    // Convert data to tensors
    const xsTensor = tf.tensor2d(xs.map((v, i) => [i]), [xs.length, 1]);
    const ysTensor = tf.tensor2d(ys, [ys.length, 1]);

    console.log("Training Data Shapes:");
    console.log("  ➤ xsTensor shape:", xsTensor.shape);
    console.log("  ➤ ysTensor shape:", ysTensor.shape);

    // Define and compile the model
    trainedModel = tf.sequential();
    trainedModel.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    trainedModel.compile({ loss: "meanSquaredError", optimizer: "sgd" });

    // Train the model
    await trainedModel.fit(xsTensor, ysTensor, { epochs: 100 });

    console.log("Model training complete.");

    // Predict 6 months savings
    const nextMonths = Array.from({ length: 6 }, (_, i) => pastSavings.length + i);
    const nextMonthsTensor = tf.tensor2d(nextMonths.map(m => [m]), [nextMonths.length, 1]);

    console.log("Prediction Input Shape:", nextMonthsTensor.shape);

    try {
        const predictions = trainedModel.predict(nextMonthsTensor);
        const predictedSavings = await predictions.data();

        console.log("Predicted Savings:", predictedSavings);

        return Array.from(predictedSavings);
    } catch (error) {
        console.error("Error during prediction:", error);
        return [];
    }
}
