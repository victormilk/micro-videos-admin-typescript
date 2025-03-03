import { validate } from "class-validator";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category Unit Tests", () => {
  let validateSpy: any;
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, "validate");
  });

  describe("constructor", () => {
    test("should create a category with default values", () => {
      const category = new Category({
        name: "Movies",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movies");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should create a category with all values", () => {
      const created_at = new Date();
      const category = new Category({
        name: "Movie",
        description: "Movie description",
        is_active: false,
        created_at: created_at,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBe(created_at);
    });

    test("should create a category with name and description", () => {
      const category = new Category({
        name: "Movie",
        description: "Movie description",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe("create command", () => {
    test("should create a category", () => {
      const category = Category.create({
        name: "Movie",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("should create a category with description", () => {
      const category = Category.create({
        name: "Movie",
        description: "some description",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("some description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("should create a category with is_active", () => {
      const category = Category.create({
        name: "Movie",
        is_active: false,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("category_id field", () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
    ];
    test.each(arrange)("id = %j", ({ category_id }) => {
      const category = new Category({
        category_id: category_id as any,
        name: "Movie",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      if (category_id instanceof Uuid) {
        expect(category.category_id).toBe(category_id);
      }
    });
  });

  test("should change name", () => {
    const category = Category.create({
      name: "Movie",
    });
    category.changeName("other name");
    expect(category.name).toBe("other name");
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  test("should change description", () => {
    const category = Category.create({
      name: "Movie",
    });
    category.changeDescription("some description");
    expect(category.description).toBe("some description");
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  test("should active a category", () => {
    const category = Category.create({
      name: "Movies",
      is_active: false,
    });
    category.activate();
    expect(category.is_active).toBeTruthy();
  });

  test("should deactivate a category", () => {
    const category = Category.create({
      name: "Movies",
      is_active: true,
    });
    category.deactivate();
    expect(category.is_active).toBeFalsy();
  });
});

describe("Category Validator", () => {
  describe("create command", () => {
    const nameArrange = [
      {
        name: null as any,
        errors: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      },
      {
        name: 1,
        errors: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      },
      {
        name: "t".repeat(256),
        errors: ["name must be shorter than or equal to 255 characters"],
      },
    ];

    test.each(nameArrange)("name = %j", ({ name, errors }) => {
      expect(() => Category.create({ name: name })).containsErrorMessages({
        name: errors,
      });
    });

    const descriptionArrange = [
      {
        description: 1,
        errors: ["description must be a string"],
      },
    ];

    test.each(descriptionArrange)(
      "description = %j",
      ({ description, errors }) => {
        expect(() =>
          Category.create({ description: description } as any)
        ).containsErrorMessages({
          description: errors,
        });
      }
    );

    const isActiveArrange = [
      {
        is_active: 1,
        errors: ["is_active must be a boolean value"],
      },
    ];

    test.each(isActiveArrange)("is_active = %j", ({ is_active, errors }) => {
      expect(() =>
        Category.create({ is_active: is_active } as any)
      ).containsErrorMessages({
        is_active: errors,
      });
    });
  });

  describe("changeName method", () => {
    const arrange = [
      {
        name: null as any,
        errors: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      },
      {
        name: 1,
        errors: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      },
      {
        name: "t".repeat(256),
        errors: ["name must be shorter than or equal to 255 characters"],
      },
    ];

    const category = Category.create({ name: "Movie" });

    test.each(arrange)("name = %j", ({ name, errors }) => {
      expect(() => category.changeName(name)).containsErrorMessages({
        name: errors,
      });
    });
  });

  describe("changeDescription method", () => {
    const arrange = [
      {
        description: 5,
        errors: ["description must be a string"],
      },
    ];

    const category = Category.create({ name: "Movie" });

    test.each(arrange)("description = %j", ({ description, errors }) => {
      expect(() =>
        category.changeDescription(description as any)
      ).containsErrorMessages({
        description: errors,
      });
    });
  });
});
