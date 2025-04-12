import { readFile } from 'fs/promises';
import { join } from 'path';

interface TrainingData {
  features: number[][];
  labels: string[];
}

interface PredictionResult {
  prediction: string;
  confidence: number;
  alternatives: Array<{
    character: string;
    confidence: number;
  }>;
}

class KNNClassifier {
  private trainingData: TrainingData | null = null;
  private k: number = 5;

  constructor(k: number = 5) {
    this.k = k;
  }

  async loadTrainingData() {
    try {
      const dataPath = join(process.cwd(), 'data', 'training.json');
      const rawData = await readFile(dataPath, 'utf-8');
      this.trainingData = JSON.parse(rawData);
    } catch (error) {
      console.error('Error loading training data:', error);
      throw new Error('Failed to load training data');
    }
  }

  private calculateDistance(a: number[], b: number[]): number {
    return Math.sqrt(
      a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
    );
  }

  private getMostFrequent(arr: string[]): { value: string; count: number } {
    const counts = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    let maxCount = 0;
    let maxValue = '';

    for (const [value, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        maxValue = value;
      }
    }

    return { value: maxValue, count: maxCount };
  }

  async predict(features: number[]): Promise<PredictionResult> {
    if (!this.trainingData) {
      await this.loadTrainingData();
    }

    if (!this.trainingData || !this.trainingData.features.length) {
      throw new Error('No training data available');
    }

    // Calculate distances to all training examples
    const distances = this.trainingData.features.map((trainFeatures, index) => ({
      distance: this.calculateDistance(features, trainFeatures),
      label: this.trainingData!.labels[index]
    }));

    // Sort by distance and get k nearest neighbors
    const kNearest = distances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, this.k);

    // Get the most frequent label among k nearest neighbors
    const nearestLabels = kNearest.map(n => n.label);
    const { value: prediction, count } = this.getMostFrequent(nearestLabels);

    // Calculate confidence and alternatives
    const confidence = count / this.k;
    const alternatives = Array.from(new Set(nearestLabels))
      .filter(label => label !== prediction)
      .map(character => ({
        character,
        confidence: nearestLabels.filter(l => l === character).length / this.k
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);

    return {
      prediction,
      confidence,
      alternatives
    };
  }
}

// Export singleton instance
export const knnClassifier = new KNNClassifier();