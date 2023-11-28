export declare global {
  declare interface Window {}

  export declare interface Forum {
    id: number;
    user_id: number;
    title: string;
    content: string;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
  }
  export declare interface Seminar {
    id: number;
    host_id: number;
    category_id: number;
    title: string;
    content: string;
    meeting_place: string;
    limit_participant_amount: number;
    recruit_start_date: Date;
    recruit_end_date: Date;
    seminar_start_date: Date;
    seminar_end_date: Date;
    is_recruit_finished: boolean;
    is_seminar_finished: boolean;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;

    user: User;
    seminarParticipants: SeminarParticipants;
  }

  export declare interface User {
    id: number;
    grade_id: number;
    username: string;
    email: string;
    phone_number: string;
    birth: Date;
    gender: string;
    password: string;
    level: number;
    points: number;
    fail_login_count: number;
    last_login_at: Date;
    status: string;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
  }
  export declare interface SeminarParticipants {
    id: number;
    seminar_id: number;
    user_id: number;
    is_confirm: boolean;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
  }
}
