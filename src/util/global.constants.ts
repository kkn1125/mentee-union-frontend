declare global {
  interface Window {
    custom_env: {
      BRAND_NAME: string;
    };
  }
}

export const BRAND_NAME = window.custom_env.BRAND_NAME;

export const SUCCESS_MESSAGE = {
  ALREADY_PASS_AUTH: "이미 본인인증이 완료 되었습니다.",
  PASS_EMAIL_AUTH: "본인인증이 완료 되었습니다.",
  RESET_PASSWORD:
    "비밀번호 재설정이 완료되었습니다. 다시 로그인을 시도해주세요.",
  SEND_RESET_PASSWORD_MAIL_CHECK:
    "비밀번호 재설정 메일을 전송했습니다. 메일을 확인 해 주세요.",
  SEND_SIGNUP_AUTH_MAIL_CHECK:
    "해당 이메일로 본인인증 메일이 발송되었습니다. 본인 인증 유효 시간은 1분 입니다. 메일을 확인 후 작업을 완료해주세요.",
};

export const ERROR_MESSAGE = {
  REQUIRED: "필수 항목입니다.",
  MIN: (value: number) => `최소 ${value}자 이상 입력 해야합니다.`,
  MAX: (value: number) => `최대 ${value}자 까지 입력 가능합니다.`,
  ONLY_STRING: "문자만 입력 가능합니다.",
  ONLY_NUMBER: "숫자만 입력 가능합니다.",
  EMAIL_FORMAT: "이메일 형식이 아닙니다.",
  USERNAME: {
    DEFAULT: (min: number, max: number) =>
      `유저네임은 영문자로 시작하는 ${min} ~ ${max}자의 영문, 숫자, 밑줄(_), 대시(-)로 구성해야 합니다.`,
    NOT_ALLOWED_START_WITH: "숫자나 특수 문자로 시작할 수 없습니다.",
  },
  PASSWORD: {
    NO_MATCHED_WITH_ORIGIN: "입력한 비밀번호와 동일하지 않습니다.",
    DEFAULT: (min: number, max: number) =>
      `비밀번호는 숫자, 영문 대소문자, 특수문자가 최소 1개 씩 포함되어야 하며, ${min} ~ ${max}자 이내로 작성해야 합니다.`,
    MIN: (value: number) => `비밀번호는 최소 ${value}자 이상 입력 해야합니다.`,
    MAX: (value: number) =>
      `"비밀번호는 최대 ${value}자 이하 입력 해야합니다."`,
  },
  PHONE_NUMBER: "폰 번호 형식이 아닙니다. 010-0000-1111 로 작성해야 합니다.",
};

export const REGEX = {
  USERNAME:
    /\b(?![\s_\-0-9])(?=.*[A-Za-z])(?=.*([0-9_-]?|[^\s]))[A-Za-z0-9_-]+/g,
  EMAIL:
    /\b(?=.*[A-Za-z])(?=.*[0-9_\-.])[A-Za-z0-9_\-.]+@(?=.*[A-Za-z]?)(?=.*[0-9_-]*)[A-Za-z0-9_-]+\.(?=.*[A-Za-z]\b)(?!.*[.])[A-Za-z]+/g,
  PASSWORD:
    /(?=.*[A-Z])(?=.*[a-z])[A-Za-z]{1,}(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{0,}(?=.*[0-9])(?=.*[!@#$%^&*()])[A-Za-z0-9!@#$%^&*()]{4,20}/g,
  PHONE_NUMBER: /\d{2,3}-\d{3,4}-\d{4}/g,
};

export const FAIL_MESSAGE = {
  EXPIRED_TOKEN: "토큰이 만료되었습니다.",
  REQUIRE_EMAIL_AUTH: "이메일 본인인증이 필요합니다.",
  NO_ACCOUNT: "회원정보가 없습니다.",
  INCORRECT_ACCOUNT_INFO: (triedValue: number = 0, maxTriedValue: number = 3) =>
    `이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.\n남은 로그인 시도 횟수: ${triedValue}${
      triedValue < maxTriedValue
        ? "\n알림: 모든 횟수를 소진하면 계정이 잠깁니다."
        : ""
    }`,
  ALREADY_USED_EMAIL: "이미 사용 중인 이메일 입니다.",
  LOCKED_ACCOUNT_REQUIRED_RESET: `잠긴 계정입니다. 이메일을 통해 비밀번호를 재설정 해주세요.`,
  ACCESS_DENIED: "잘못된 접근입니다.",
  ACCESS_DENIED_GOHOME: "잘못된 접근입니다. 홈으로 돌아갑니다.",
  PROBLEM_WITH_SERVER: "서버에 문제가 발생 했습니다.",
  PROBLEM_WITH_SERVER_CAUSE: (value: string) =>
    `${value} 과정에서 문제가 발생 했습니다.`,
  PROBLEM_WITH_SERVER_ASK_ADMIN:
    "서버에 문제가 발생했습니다. 문제가 계속해서 발생한다면 관리자에게 문의해주세요.",
  FAILED_AUTH: "본인인증에 실패 했습니다.",
  EXPIRED_AUTH_TIME: "인증 시간이 만료 되었습니다.",
  EXPIRED_WORK_GOHOME:
    "작업 유효 기간이 지났습니다. 사용자의 계정 보호를 위해 작업을 다시 진행해주세요. 홈으로 돌아갑니다.",
  UNREGISTERD_EMAIL: "등록되지 않은 메일 입니다.",
  CHECK_DUPLICATE_USERNAME: "유저네임 중복확인은 필수 입니다.",
  CHECK_WRONG_VALUE: "입력 값 중 잘못된 값이 있습니다. 확인해주세요.",
};
