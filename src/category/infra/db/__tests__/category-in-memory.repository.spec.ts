import { filter } from "lodash";
import { CategoryInMemoryRepository } from "../category-in-memory.repository";
import { Category } from "../../../domain/category.entity";

describe("CategoryInMemoryRepository Unit Tests", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => (repository = new CategoryInMemoryRepository()));

  test("should no filter items when filter object is null", async () => {
    const items = [Category.create({ name: "test" })];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  test("should filter items using filter parameter", async () => {
    const items = [
      Category.create({ name: "test" }),
      Category.create({ name: "TEST" }),
      Category.create({ name: "fake" }),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, "TEST");
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  test("should sort by created_at when sort param is null", async () => {
    const created_at = new Date();
    const items = [
      new Category({ name: "test", created_at: created_at }),
      new Category({
        name: "TEST",
        created_at: new Date(created_at.getTime() + 100),
      }),
      new Category({
        name: "fake",
        created_at: new Date(created_at.getTime() + 200),
      }),
    ];

    const itemsSorted = await repository["applySort"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  test("should sort by name", async () => {
    const items = [
      Category.create({ name: "c" }),
      Category.create({ name: "b" }),
      Category.create({ name: "a" }),
    ];

    let itemsSorted = await repository["applySort"](items, "name", "asc");
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository["applySort"](items, "name", "desc");
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
