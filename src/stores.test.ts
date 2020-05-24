import { OrderReducer, OrderInit } from "./stores";
import { mockMenu } from "./mock";
import { IOrder } from "./interfaces";

test("OrderReducer append & create new state", () => {
  const thisOrder = OrderInit;
  const nextOrder = OrderReducer.appendOrder(thisOrder, "M11", 1, mockMenu);
  const expectResult: IOrder = {
    ...thisOrder,
    order: [
      {
        id: "M11",
        name: "MAKI (8 stk) Avocado",
        price: 4.2,
        quantity: 1,
        timestamp: expect.any(Date),
      },
    ],
  };
  expect(nextOrder).toStrictEqual(expectResult);
  expect(thisOrder === nextOrder).toBe(false);
});

test("OrderReducer change quantity", () => {
  const thisOrder = OrderReducer.appendOrder(OrderInit, "M11", 1, mockMenu);
  const nextOrder = OrderReducer.changeQuantity(thisOrder, "M11", 2);
  const expectResult: IOrder = {
    ...thisOrder,
    order: [
      {
        id: "M11",
        name: "MAKI (8 stk) Avocado",
        price: 4.2,
        quantity: 2,
        timestamp: expect.any(Date),
      },
    ],
  };
  expect(nextOrder).toStrictEqual(expectResult);
  expect(thisOrder === nextOrder).toBe(false);
});

test("OrderReducer delete order item", () => {
  let thisOrder = OrderReducer.appendOrder(OrderInit, "M11", 1, mockMenu);
  thisOrder = OrderReducer.appendOrder(thisOrder, "M12", 1, mockMenu);
  let nextOrder = OrderReducer.removeItem(thisOrder, "M11");
  let expectResult: IOrder = {
    ...thisOrder,
    order: [
      {
        id: "M12",
        name: "MAKI (8 stk) Kappa",
        price: 3.9,
        quantity: 1,
        timestamp: expect.any(Date),
      },
    ],
  };
  expect(nextOrder).toStrictEqual(expectResult);
  expect(thisOrder === nextOrder).toBe(false);
  nextOrder = OrderReducer.removeItem(nextOrder, "M12");
  expectResult = {
    ...thisOrder,
    order: [],
  };
  expect(nextOrder).toStrictEqual(expectResult);
});
