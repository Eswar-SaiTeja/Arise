// ==============================================================================
// PROJECT ASCEND / KINETIX WORKOUT ENGINE
// Pure biomechanical and volume calculations
// ==============================================================================

export interface SetMetric {
  weightKg: number;
  completedReps: number;
  rpe?: number;
}

export const WORKOUT_CALCULATIONS = {
  // Brzycki 1RM Estimation Formula: Weight * (36 / (37 - Reps))
  calculateEstimated1RM(weightKg: number, reps: number): number {
    if (reps <= 0 || weightKg <= 0) return 0;
    if (reps === 1) return weightKg;
    if (reps > 20) reps = 20; // Brzycki accuracy drops above 20 reps
    const oneRM = weightKg * (36 / (37 - reps));
    return Math.round(oneRM * 10) / 10;
  },

  // Total Volume (Tonnage): Sum of (weight * reps)
  calculateTotalVolume(sets: SetMetric[]): number {
    return sets.reduce((acc, set) => acc + (set.weightKg * set.completedReps), 0);
  },

  // Calculate Reps In Reserve from RPE
  convertRPEtoRIR(rpe: number): number {
    return Math.max(0, 10 - rpe);
  },

  // Intensity percentage from 1RM
  calculateIntensityPercentage(workingWeightKg: number, oneRMKg: number): number {
    if (oneRMKg <= 0) return 0;
    return Math.round((workingWeightKg / oneRMKg) * 100);
  }
};
