import "mocha";
// import assert from "assert";
// const assert = require("assert");
import { expect } from "chai";
import { isAfter, isBefore, isDoing } from "../src/util/tool";

describe("mocha chai test", () => {
  it("test", () => {
    expect(1 + 1).equal(2, "success");
  });
});

describe("duration test", () => {
  it("is before", () => {
    const afterTime = new Date(2023, 11, 30, 16, 40);
    expect(isAfter(afterTime)).equal(true, "success");
  });
  it("is before", () => {
    const afterTime = new Date(2023, 11, 30, 16, 40);
    expect(isDoing(afterTime, new Date())).equal(true, "success");
  });
  it("is before", () => {
    const afterTime = new Date("2023-12-30 17:30");
    expect(isBefore(afterTime)).equal(true, "success");
  });
  it("is before", () => {
    const beforeTime = new Date(2023, 11, 29, 17, 30);
    expect(isBefore(beforeTime)).equal(false, "success");
  });
  it("is after", () => {
    const afterTime = new Date(2023, 11, 29, 17, 30);
    expect(isAfter(afterTime)).equal(true, "success");
  });
  it("is after", () => {
    const afterTime = new Date("2023-12-29 17:30");
    expect(isAfter(afterTime)).equal(true, "success");
  });
  it("is after", () => {
    const afterTime = new Date("2023-12-30 17:30");
    expect(isAfter(afterTime)).equal(false, "success");
  });
  it("is during", () => {
    const startTime = new Date("2023-12-29 17:30");
    const endTime = new Date("2023-12-31 17:30");
    expect(isDoing(startTime, endTime)).equal(true, "success");
  });
});
