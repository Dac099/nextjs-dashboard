export type Chat = {
  id: string;
  message: string;
  author: {
    name: string;
    id: string;
  };
  updated_at: string;
};

export type Response = {
  id: string;
  author: {
    id: string;
    name: string;
  };
  message: string;
  updated_at: string;
};

export type Task = {
  id: string;
  message: string;
  completed: boolean;
};

export type ResponseChat = Chat & {
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
  beginning_date: Date;
  end_date: Date;
  created_at: Date;
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
  kickoff: Date;
  weeks_count: number;
  project_manager: string;
  mechanical_designer: string;
  electrical_designer: string;
  developer: string;
  assembler: string;
};

export type Item = {
  name: string
  created_at: Date;
  updated_at: Date;
  project_id: string;
};

export type Project = {
  id: string;
  name: string;
};

export type Column = {
  id: string;
  name: string;
  type: string;
  position: number;
};

export type ChatTask = {
  id: string;
  message: string;
  completed: boolean;
};
