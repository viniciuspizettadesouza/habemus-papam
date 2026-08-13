/** A pope record from the bundled historical dataset. */
export interface Pope {
  /** Stable lowercase identifier. */
  id: string;
  /** Display name including the Pope title. */
  name: string;
  /** Name used before election. */
  birthName: string;
  /** Birth date in YYYY-MM-DD format. */
  birthDate: string;
  /** Election date in YYYY-MM-DD format. */
  elected: string;
  /** Inclusive pontificate end date, or null for the current pope. */
  pontificateEnd: string | null;
}

/** Minimum pope shape accepted by pontificate calculations. */
export type PontificateInput = Pick<Pope, "elected" | "pontificateEnd">;

/** Minimum pope shape accepted by age calculations. */
export type PopeAgeInput = PontificateInput & Pick<Pope, "birthDate">;

/** Calendar and elapsed-day representations of a pontificate duration. */
export interface PontificateDuration {
  /** Completed calendar years. */
  years: number;
  /** Remaining completed calendar months. */
  months: number;
  /** Remaining elapsed calendar days. */
  days: number;
  /** Total elapsed calendar days. */
  totalDays: number;
}

/** A pope and the calculated duration of that pope's pontificate. */
export interface PontificateResult {
  pope: Pope;
  duration: PontificateDuration;
}

/** Aggregate duration statistics for completed pontificates. */
export interface AveragePontificateDuration {
  /** Mean elapsed days, rounded to the nearest whole day. */
  averageDays: number;
  /** Number of completed pontificates included in the mean. */
  sampleSize: number;
}

/** A JavaScript Date or an ISO calendar date in YYYY-MM-DD format. */
export type DateInput = Date | string;
