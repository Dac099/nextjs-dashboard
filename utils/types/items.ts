export type Chat = {
  id: string;
  message: string;
  author: string;
  updated_at: string;
};

export type Response = {
  id: string;
  author: string;
  message: string;
  updated_at: string;
};

export type Task = {
  id: string;
  message: string;
  completed: boolean;
};

export type ResponseChats = Chat & {
  responses: Response[];
  tasks: Task[];
};

export type ProjectData = {
  id: string;
  client: string;
  created_by: string;
  type: string;
  state: string;
  division: string;
  name: string;
  description: string;
  initial_budget: number;
  currency: string;
  beginning_date: string;
  end_date: string;
  created_at: string;
  note: string;
  num_serie: string;
  num_oc: string;
  num_cot: string;
  num_fac: string;
  mechanical_budget: number;
  machine_budget: number;
  electrical_budget: number;
  other_budget: number;
  jobs_count: number;
  mechanical_design_hours: number;
  electrical_design_hours: number;
  assembly_dev_hours: number;
  programming_hours: number;
  other_hours: number;
  kickoff: string;
  weeks_count: number;
  project_manager: string;
  mechanical_designer: string;
  electrical_designer: string;
  developer: string;
  assembler: string;
};

export type Item = {
  id: string;
  created_at: string;
  updated_at: string;
  project_id: string;
};