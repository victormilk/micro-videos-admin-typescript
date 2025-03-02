import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(readonly prop1: string, readonly prop2: number) {
    super();
  }
}

describe("ValueObject Unit Tests", () => {
  test("should be equals", () => {
    const vo1 = new StringValueObject("test");
    const vo2 = new StringValueObject("test");
    expect(vo1.equals(vo2)).toBeTruthy();

    const cvo1 = new ComplexValueObject("test", 1);
    const cvo2 = new ComplexValueObject("test", 1);
    expect(cvo1.equals(cvo2)).toBeTruthy();
  });

  test("should not be equals", () => {
    const vo1 = new StringValueObject("test");
    const vo2 = new StringValueObject("test2");
    expect(vo1.equals(vo2)).toBeFalsy();
    expect(vo1.equals(null as any)).toBeFalsy();
    expect(vo2.equals(null as any)).toBeFalsy();

    const cvo1 = new ComplexValueObject("test", 1);
    const cvo2 = new ComplexValueObject("test", 2);
    expect(cvo1.equals(cvo2)).toBeFalsy();
    expect(cvo1.equals(null as any)).toBeFalsy();
    expect(cvo2.equals(null as any)).toBeFalsy();
  });
});
