export class SolarAnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SolarAnalysisError';
  }
}