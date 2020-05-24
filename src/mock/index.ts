import { IOrder, IRating } from "../interfaces";

export const mockLocations = ["Karlsruhe", "Buehl"];
export const mockOrder: IOrder = {
  tableID: "15",
  location: mockLocations[0],
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

export const mockPartnerInfo = require("./taumi_menu.json");
export const mockMenu = mockPartnerInfo.taumi.nowMenu;
export const mockTableLocation = { tableID: "12", location: "Karlsruhe" };

export const mockRating: [string, IRating][] = [
  [
    "Catch the fish",
    {
      ratedNum: 10,
      rating: 3,
    },
  ],
];
