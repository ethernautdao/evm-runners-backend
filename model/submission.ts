export interface Submission {
  id: number | undefined;
  level_id: number;
  level_name: string | undefined;
  user_id: number;
  user_name: string | undefined;
  bytecode: string;
  gas: number;
  size: number;
  submitted_at: number;
  type: string;
  optimized_for: string | undefined;
}

export interface InsertOrUpdateSubmissionResult {
  submissions: [Submission] | null;
  gas_rank: string;
  size_rank: string;
}
