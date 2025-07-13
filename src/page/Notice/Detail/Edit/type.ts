export interface Notice {
    title: string;
    content: string;
    Files: string[];      
    teacher: string;
    teacherId: number;
    state: "TEAM" | string;
    team_id: number;
  }
  