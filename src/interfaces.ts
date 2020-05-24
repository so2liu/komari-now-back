export type TID = string;

export interface IOrderItem {
  id: TID;
  name: string;
  price: number;
  quantity: number;
  timestamp: Date;
}

export interface IOrder {
  order: IOrderItem[];
  tableID: string;
  location: string;
  isPartnerHandled: boolean;
  isThisTableFinished: boolean;
}

export interface ISentOrder extends IOrder {
  updatedAt: firebase.firestore.Timestamp;
  version: string;
  paid: boolean;
  isDev: boolean;
}

export interface IOrderHistory {
  details: IOrder[];
  summary: IOrder;
}

export interface ISub {
  id: TID;
  subname: string | null;
  price: number;
}

export interface IProduct {
  DE: string;
  EN: string | null;
  sub: ISub[];
  imgSrc: string | null;
}

export interface IRating {
  ratedNum: number;
  rating: number;
}

export type TNowRatings = [string, IRating][];

export interface IProducts {
  [name: string]: IProduct;
}

export type TMenu = {
  [first: string]: {
    [second: string]: {} | IProducts;
  };
};

export interface IItemFoundFromMenu {
  isFound: boolean;
  sub: ISub;
  firstKey: string;
  secondKey: string;
  name: string;
}
