export interface Pope {
  id: string;
  name: string;
  birthName: string;
  birthDate: string;
  elected: string;
  pontificateEnd: string | null;
}

export type PontificateInput = Pick<Pope, "elected" | "pontificateEnd">;

export type PopeAgeInput = PontificateInput & Pick<Pope, "birthDate">;

export interface PontificateDuration {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export interface PontificateResult {
  pope: Pope;
  duration: PontificateDuration;
}

export interface AveragePontificateDuration {
  averageDays: number;
  sampleSize: number;
}

export type DateInput = Date | string;
