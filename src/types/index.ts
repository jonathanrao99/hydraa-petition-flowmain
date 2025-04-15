
// User Types
export interface User {
  id: string;
  employeeId: string;
  name: string;
  designation: 'DCP' | 'ACP' | 'Inspector' | 'Other';
  role: 'Reception' | 'EnquiryOfficer' | 'HOD' | 'Admin';
  email: string;
  phone: string;
  userId: string; // Auto-generated (e.g., Sumanth/DCP)
}

// Petition Types
export interface Petition {
  id: string;
  petitionNumber: string; // Auto-generated (e.g., PTN00001YEAR)
  date: string;
  petitionType: 'General' | 'Prajavani' | 'Email' | 'WhatsApp' | 'Twitter' | 'Other';
  petitionerName: string;
  petitionerPhone: string;
  petitionerAddress: string;
  submittedBy: 'Individual' | 'Association' | 'Govt' | 'Public Rep' | 'Other';
  complaintDetails: string;
  respondentInfo: string;
  encroachmentZone: {
    level1: string;
    level2: string;
    level3: string;
  };
  encroachmentTypes: string[];
  petitionFile?: string;
  initialRemark: string;
  timeBound: 'Priority' | 'Immediate' | 'Normal';
  assignedOfficers: string[];
  status: 'Pending' | 'Assigned' | 'Under Investigation' | 'Decision Made';
  createdBy: string;
}

// EO Feedback Types
export interface EOFeedback {
  id: string;
  petitionId: string;
  officerId: string;
  observations: string;
  litigationPending: string;
  evidence: string[];
  findings: string;
  finalReport?: string;
  timestamp: string;
}

// HOD Feedback Types
export interface HODFeedback {
  id: string;
  petitionId: string;
  action: string;
  finalRemarks: string;
  date: string;
}

// Location Data Types
export interface LocationData {
  name: string;
  children?: LocationData[];
}

// Encroachment Type
export interface EncroachmentType {
  id: string;
  name: string;
}
