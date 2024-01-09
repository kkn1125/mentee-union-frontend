import "mocha";
import { expect } from "chai";
import { overwriteWith } from "./tool";

describe("덮어쓰기 함수 테스트", () => {
  it("배열 객체 덮어쓰기", () => {
    const origin = [
      {
        id: 1,
        username: "test",
        age: 15,
        updated_at: "2024-1-9 10:30",
      },
      {
        id: 2,
        username: "kimson",
        age: 31,
        updated_at: "2024-1-9 12:30",
      },
    ];
    const compare = [
      {
        id: 1,
        username: "test2",
        age: 15,
        updated_at: "2024-1-9 12:30",
      },
      {
        id: 3,
        username: "test",
        age: 39,
        updated_at: "2024-1-9 12:30",
      },
    ];
    const result = overwriteWith(origin, compare);

    expect(result.length).equal(3);
    expect(result[2].username).equal("test2");
  });
});
