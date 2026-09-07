export interface PitchResult {
  angle_title: string;
  evidence_snippet: string;
  rationale: string;
  subject_line: string;
  email_body: string;
  call_to_action: string;
}

export interface PitchRecord {
  id: string;
  createdAt: number;
  companyText: string;
  offering: string;
  angle: string;
  customAngleText?: string;
  result: PitchResult;
}

export interface OutreachAngleOption {
  id: string;
  label: string;
  tagline: string;
  description: string;
}

export interface DraftState {
  companyText: string;
  offering: string;
  selectedAngle: string;
  customAngleText: string;
  currentResult: PitchResult | null;
  currentRecordId: string | null;
}
