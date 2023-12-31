import { PaletteColor } from "@mui/material";
import "@mui/x-date-pickers/DateTimeField";

declare module "@mui/x-date-pickers/DateTimeField" {
  interface DateTimeFieldProps {
    // 여기에 추가하고 싶은 새로운 프로퍼티를 정의하세요.
    error?: boolean;
  }
}

export declare global {
  declare interface Window {}
  // declare module "@mui/x-date-pickers/DateTimeField" {
  //   interface CustomError {
  //     error: boolean;
  //   }

  //   interface DateTimeFieldComponent extends CustomError {
  //     // 여기에 추가하고 싶은 새로운 프로퍼티를 정의하세요.
  //   }
  // }

  export declare interface Token {
    sub: number;
    username: string;
    email: string;
    phone_number: string;
    last_sign_in: string;
    exp: number;
    iat: number;
  }

  export declare interface Forum {
    id: number;
    user_id: number;
    title: string;
    content: string;
    view_count: number;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;

    user: User;
    forumLikes: ForumLike[];
  }
  export declare interface ForumLike {
    id: number;
    user_id: number;
    forum_id: number;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
    forum: Forum;
    user: User;
  }
  export declare interface Category {
    id: number;
    name: string;
    description: string;
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
    view_count: number;
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

    cover: Cover;
    user: User;
    seminarParticipants: SeminarParticipant[];
    category: Category;
  }
  export declare interface Board {
    id: number;
    user_id: number;
    type: string;
    title: string;
    content: string;
    view_count: number;
    visible: boolean;
    sequence: number;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;

    user: User;
  }
  export declare interface Cover {
    id: number;
    seminar_id: number;
    origin_name: string;
    new_name: string;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
  }
  export declare interface Channel {
    id: number;
    name: string;
    url: string;
    created_at: Date;
    updated_at: Date;
  }
  export declare interface User {
    id: number;
    grade_id: number;
    username: string;
    email: string;
    phone_number: string;
    birth: Date;
    gender: string;
    auth_email: boolean;
    level: number;
    points: number;
    fail_login_count: number;
    last_login_at: Date;
    status: string;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;

    forums: Forum[];
    profiles: Profile[];
    mentorings: Mentoring[];
    grade: Grade;
    receivers: UserRecommend[];
    givers: UserRecommend[];
    seminarParticipants: SeminarParticipant[];
    forumLikes: ForumLike[];
    boards: Board[];
  }
  export declare interface UserRecommend {
    id: number;
    giver_id: number;
    receiver_id: number;
    points: number;
    reason: string;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
    giver: User;
    receiver: User;
  }
  export declare interface Grade {
    id: number;
    name: string;
    description: string;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
  }
  export declare interface JwtDto {
    userId: number;
    username: string;
    email: string;
    phone_number: string;
    last_sign_in: Date;
  }
  export declare interface AuthProfile {
    userId: number;
    username: string;
    email: string;
    phone_number: string;
    last_sign_in: string;
    iat: number;
    exp: number;
  }
  export declare interface Profile {
    id: number;
    user_id: number;
    origin_name: string;
    new_name: string;
    user: User;
  }
  export declare interface SeminarParticipant {
    id: number;
    seminar_id: number;
    user_id: number;
    is_confirm: boolean;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
    seminar: Seminar;
  }
  export declare interface CustomAxiosError extends Error {
    response: {
      data: {
        ok: boolean;
        code: number;
        data: object;
        message: string;
        detail: string;
      };
      status: number;
    };
  }

  export declare type Issue = {
    id: number;
    title: string;
    content: string;
  };

  export declare interface FlowIssuesProps {
    issues: Issue[];
    height: number;
  }

  export declare interface Mentoring {
    id: number;
    mentee_id: number;
    mentoring_session_id: number;
    mentoringSession: MentoringSession;
    user: User;
    status: string;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
  }
  export declare interface MentoringSession {
    id: number;
    category_id: number;
    topic: string;
    objective: string;
    format: string;
    note: string;
    password: string | null;
    is_private: boolean;
    mentorings: Mentoring[];
    messages: Message[];
    category: Category;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
  }
  export declare interface Message {
    id: number;
    user_id: number;
    mentoring_session_id: number;
    message: string;
    is_top: boolean;
    is_deleted: boolean;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
    user: User;
    mentoringSession: MentoringSession;
    readedUsers: ReadMessage[];
  }
  export declare interface ReadMessage {
    id: number;
    user_id: number;
    message_id: number;
    message: Message;
    user: User;
  }

  // declare type MappedType<T, U> = {
  //   [Property in T]: U;
  // };

  // declare type CustomPaletteColors = "white" | "bg" /*  | "nature" */;

  // declare type CustomPalette = {
  //   [_ in CustomPaletteColors]: PaletteColor;
  // };
  // declare type CustomPaletteOptions = {
  //   [_ in keyof CustomPalette]?: PaletteColorOptions;
  // };

  // export declare module "@mui/material/styles" {
  //   export declare interface Palette extends CustomPalette {}
  //   export declare interface PaletteOptions extends CustomPaletteOptions {}
  // }

  export declare interface DefaultMessageType {
    event: string;
    message?: string;
  }

  export declare interface DataUserType extends DefaultMessageType {
    type: "user";
    data?: Partial<User>;
  }
  export declare interface DataChannelType extends DefaultMessageType {
    type: "channel";
    data?: Partial<Channel>;
  }
  export declare interface DataMessageType extends DefaultMessageType {
    type: "message";
    data: {
      message: string;
      scope: string;
    };
  }

  export declare interface DataStringType extends DefaultMessageType {
    type: "string";
    data: string;
  }
  export declare type MessageType =
    | DataUserType
    | DataChannelType
    | DataMessageType
    | DataStringType;

  export declare type BOARD_TYPE = "notice" | "qna" | "event";
}
