import { PaletteColor } from "@mui/material";

export declare global {
  declare interface Window {}

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
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;

    category: Category;
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
    category: Category;
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

    profiles: Profile[];
  }
  export declare interface Profile {
    id: number;
    user_id: number;
    origin_name: string;
    new_name: string;
    user: User;
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
    width: number;
    height: number;
  }

  export declare interface UserModel {
    currentSession: number;
    state: string;
    user_id: number;
    email: string;
    profile: string;
    username: string;
    token: string;
    url: string;
  }
  export declare interface ChannelModel {
    id: number;
    category_id: number;
    topic: string;
    objective: string;
    format: string;
    note: string;
    mentorings: UserModel[];
    messages: Message[];
    category: Category;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
  }
  export declare interface Message {
    id: number;
    user_id: number;
    username: string;
    profile: string;
    message: string;
    removed: boolean;
    created_at: number;
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
}
