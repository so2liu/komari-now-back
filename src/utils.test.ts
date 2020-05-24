import {
  getIsPartnerDev,
  getIsDeveloperDev,
  getIsDev,
  findIndexFromOrderByID,
  findSubFromMenuByID,
  findProductFromMenuByName,
  mapDrawerList,
  getTotalPrice,
  getTotalQuantity,
  mergeOrders,
  filterNullQuantityFromOrder,
  mergeOrdersByTable,
} from "./utils";
import { IOrder, IItemFoundFromMenu } from "./interfaces";
import { mockMenu } from "./mock";
import produce from "immer";

const localhost = "http://localhost:3000";
const lanLocalhost = "http://192.168.0.54:3000";
const partnerDevURL = "https://komari-now-dev.eat-togo.com";
const developerDevURL = "https://komari-now.web.app";
const productionURL = "https://komari-now.eat-togo.com";

test("isPartnerDev for all kinds of url", () => {
  expect(getIsPartnerDev(localhost)).toBe(false);
  expect(getIsPartnerDev(lanLocalhost)).toBe(false);
  expect(getIsPartnerDev(developerDevURL)).toBe(false);
  expect(getIsPartnerDev(partnerDevURL)).toBe(true);
  expect(getIsPartnerDev(productionURL)).toBe(false);
});

test("isDeveloperDev for all kinds of url", () => {
  expect(getIsDeveloperDev(localhost)).toBe(true);
  expect(getIsDeveloperDev(lanLocalhost)).toBe(true);
  expect(getIsDeveloperDev(developerDevURL)).toBe(true);
  expect(getIsDeveloperDev(partnerDevURL)).toBe(false);
  expect(getIsDeveloperDev(productionURL)).toBe(false);
});

test("isDev (devloper and partner) for all kinds of url", () => {
  expect(getIsDev(localhost)).toBe(true);
  expect(getIsDev(lanLocalhost)).toBe(true);
  expect(getIsDev(developerDevURL)).toBe(true);
  expect(getIsDev(partnerDevURL)).toBe(true);
  expect(getIsDev(productionURL)).toBe(false);
});

test("findIndexFromOrderByID", () => {
  expect(findIndexFromOrderByID("15H", mockOrder)).toBe(1);
  expect(findIndexFromOrderByID("15", mockOrder)).toBe(-1);
});

test("findProductFromMenuByName", () => {
  expect(findProductFromMenuByName("Catch the fish", mockMenu)).toStrictEqual([
    "Catch the fish",
    mockMenu.food.Vorspeise["Catch the fish"],
  ]);
});

test("findSubFromMenuByID", () => {
  expect(findSubFromMenuByID("1", mockMenu)).toStrictEqual({
    isFound: true,
    firstKey: "food",
    secondKey: "Vorspeise",
    name: "Catch the fish",
    sub: { id: "1", subname: null, price: 7.5 },
  } as IItemFoundFromMenu);

  expect(findSubFromMenuByID("M11", mockMenu)).toStrictEqual({
    isFound: true,
    firstKey: "food",
    secondKey: "Sushi",
    name: "MAKI (8 stk)",
    sub: { id: "M11", subname: "Avocado - Avocado", price: 4.2 },
  } as IItemFoundFromMenu);

  expect(findSubFromMenuByID("M1", mockMenu)).toStrictEqual({
    isFound: false,
    firstKey: "",
    secondKey: "",
    name: "",
    sub: { id: "", subname: "", price: 0 },
  } as IItemFoundFromMenu);
});

test("mapDrawerList", () => {
  const drawerItems = [
    ["Mittagstisch", "Vorspeise"],
    ["Hauptspeise", "Sushi", "Sushi Set"],
  ];
  expect(mapDrawerList(drawerItems)).toStrictEqual([
    [
      {
        key: "Mittagstisch",
        label: "Mittagstisch",
      },
      {
        key: "Vorspeise",
        label: "Vorspeise",
      },
    ],
    [
      {
        key: "Hauptspeise",
        label: "Hauptspeise",
      },
      {
        key: "Sushi",
        label: "Sushi",
      },
      {
        key: "Sushi Set",
        label: "Sushi Set",
      },
    ],
  ]);
});

test("getTotalPrice", () => {
  expect(getTotalPrice(mockOrder)).toBe(36.4);
});

test("getTotalPrice", () => {
  expect(getTotalQuantity(mockOrder)).toBe(4);
});

test("mergeOrders", () => {
  expect(mergeOrders([mockOrder, mockOrder])).toStrictEqual({
    IDs: ["M11", "15H"],
    quantities: [4, 4],
  });
});

test("filterNullQuantityFromOrder", () => {
  expect(filterNullQuantityFromOrder(mockOrder)).toStrictEqual(mockOrder);
  const mockOrderWithNullQty = produce(mockOrder, (draft) => {
    draft.order[0].quantity = 0;
  });
  const filtedOrder = produce(mockOrder, (draft) => {
    draft.order.shift();
  });
  expect(filterNullQuantityFromOrder(mockOrderWithNullQty)).toStrictEqual(
    filtedOrder
  );
});

test("mergeOrdersByTable", () => {
  const mockOrderAnotherTable = produce(mockOrder, (draft) => {
    draft.tableID = "11";
  });
  expect(
    mergeOrdersByTable([mockOrder, mockOrder, mockOrderAnotherTable])
  ).toStrictEqual([
    ["15", { IDs: ["M11", "15H"], quantities: [4, 4] }],
    ["11", { IDs: ["M11", "15H"], quantities: [2, 2] }],
  ]);
});

const mockOrder: IOrder = {
  tableID: "15",
  location: "Karlsruhe",
  isPartnerHandled: false,
  isThisTableFinished: false,
  order: [
    {
      id: "M11",
      name: "Maki Avocado",
      price: 4.2,
      quantity: 2,
      timestamp: new Date(),
    },
    {
      id: "15H",
      name: "Curry Chicken",
      price: 14,
      quantity: 2,
      timestamp: new Date(),
    },
  ],
};
