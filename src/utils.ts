import {
  IOrder,
  TMenu,
  IItemFoundFromMenu,
  TID,
  IProduct,
  TNowRatings,
  ISentOrder,
} from "./interfaces";
import { OrderInit } from "./stores";
import produce from "immer";

const baseURL = window.location.href;

export function getPartName(url: string) {
  let partnerName = "taumi";
  if (url.includes("taumi")) partnerName = "taumi";
  if (url.includes("komari")) partnerName = "komari";
  return partnerName.toLowerCase();
}
export const partnerName = getPartName(baseURL);

export function getIsPartnerDev(url: string): boolean {
  return url.includes("dev") && url.includes("eat-togo.com");
}
export const isPartnerDev = getIsPartnerDev(baseURL);

export function getIsDeveloperDev(url: string): boolean {
  return url.split(":").length > 2 || url.includes("web.app");
}
export const isDeveloperDev = getIsDeveloperDev(baseURL);

export function getIsDev(url: string): boolean {
  return getIsPartnerDev(url) || getIsDeveloperDev(url);
}
export const isDev = getIsDev(baseURL);

export function findIndexFromOrderByID(id: TID, order: IOrder): number {
  const index = order.order.findIndex((element) => element.id === id);
  return index;
}

export function findSubFromMenuByID(id: TID, menu: TMenu): IItemFoundFromMenu {
  const target: IItemFoundFromMenu = {
    isFound: false,
    sub: { id: "", subname: "", price: 0 },
    firstKey: "",
    secondKey: "",
    name: "",
  };
  for (let [firstKey, firstContent] of Object.entries(menu)) {
    for (let [secondKey, secondContent] of Object.entries(firstContent)) {
      if (secondContent) {
        for (let [name, content] of Object.entries(secondContent)) {
          const targetSub = content.sub.find((element) => element.id === id);
          if (targetSub) {
            target.isFound = true;
            target.firstKey = firstKey;
            target.secondKey = secondKey;
            target.name = name;
            target.sub = targetSub;
            return target;
          }
        }
      }
    }
  }
  return target;
}

export function findProductFromMenuByName(targetName: string, menu: TMenu) {
  const target: [string?, IProduct?] = [];
  for (let [, firstContent] of Object.entries(menu)) {
    for (let [, secondContent] of Object.entries(firstContent)) {
      if (secondContent) {
        for (let [name, content] of Object.entries(secondContent)) {
          if (name.trim() === targetName.trim()) {
            target.push(name, content);
          }
        }
      }
    }
  }
  return target;
}

export function mapDrawerList(drawerList: string[][]) {
  return drawerList.map((eachList) =>
    eachList.map((item) => ({
      key: item,
      label: item,
    }))
  );
}

export function getTotalPrice(order: IOrder) {
  return order.order.reduce((arr, cur) => arr + cur.quantity * cur.price, 0);
}

export function getTotalQuantity(order: IOrder) {
  return order.order.reduce((arr, cur) => arr + cur.quantity, 0);
}

export function concatNameSubname(name: string, subname: string | null) {
  if (!subname) return name;
  const partSubname = subname.split("-")[0];
  return [name, partSubname].join(" ").trim();
}

export function mergeOrderWithDetail(order1: IOrder, willChangedOrder: IOrder) {
  console.warn("mergeOrderWithDetail is slow. Try not use it");
  if (order1.order.length === 0) return willChangedOrder;
  if (willChangedOrder.order.length === 0) return order1;
  order1.order.forEach((orderItem) => {
    const { id, quantity } = orderItem;
    const index = findIndexFromOrderByID(id, willChangedOrder);
    if (index >= 0) {
      willChangedOrder.order[index].quantity += quantity;
    } else {
      willChangedOrder.order.push(orderItem);
    }
  });
  return willChangedOrder;
}

export function mergeOrders(orders: IOrder[]) {
  const IDs: string[] = [];
  const quantities: number[] = [];
  orders.forEach((order) => {
    order.order.forEach(({ id, quantity }) => {
      const index = IDs.findIndex((existId) => existId === id);
      if (index >= 0) {
        quantities[index] += quantity;
      } else {
        IDs.push(id);
        quantities.push(quantity);
      }
    });
  });
  return { IDs, quantities };
}

export function mergeOrdersByTable(orders: IOrder[]) {
  const ordersByTable: {
    openTableID: string[];
    ordersByTableID: [string, IOrder[]][];
  } = {
    openTableID: [],
    ordersByTableID: [],
  };
  orders.forEach((order) => {
    const { tableID } = order;
    if (!ordersByTable.openTableID.includes(tableID)) {
      ordersByTable.openTableID.push(tableID);
      ordersByTable.ordersByTableID.push([tableID, [order]]);
    } else {
      const index = ordersByTable.openTableID.findIndex((id) => id === tableID);
      ordersByTable.ordersByTableID[index][1].push(order);
    }
  });
  const mergedOrders: [
    string,
    { IDs: string[]; quantities: number[] }
  ][] = ordersByTable.ordersByTableID.map((each) => [
    each[0],
    mergeOrders(each[1]),
  ]);
  return mergedOrders;
}

export function createOrder(
  IDs: string[],
  quantities: number[],
  menu: TMenu
): IOrder {
  const order = JSON.parse(JSON.stringify(OrderInit));
  order.order = IDs.map((id, index) => {
    const { isFound, name, sub } = findSubFromMenuByID(id, menu);
    if (!isFound) throw new Error("Strange Error");
    return {
      id,
      name: concatNameSubname(name, sub.subname),
      price: sub.price,
      quantity: quantities[index],
      timestamp: new Date(),
    };
  });
  return order;
}

export function updateRating(
  ratedNum: number,
  rating: number,
  newRating: number
) {
  const updatedRatedNum = ratedNum + 1;
  const updatedRating = (ratedNum * rating + newRating) / updatedRatedNum;
  return [updatedRatedNum, updatedRating];
}

export function findRatingFromList(name: string, nowRatings: TNowRatings) {
  const result = nowRatings.filter((pair) => pair[0] === name);
  if (result.length === 1) return result[0][1];
  if (result.length === 0) return undefined;
  throw new Error(`Dulplicate Key in nowRatings: ${name}`);
}

export function filterNullQuantityFromOrder(order: IOrder) {
  return produce(order, (draft) => {
    draft.order = draft.order.filter(({ quantity }) => quantity > 0);
  });
}
