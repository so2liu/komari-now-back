import React from "react";
import Table from "./UI/Table";
import { TableRow, TableCell, TableFooter } from "@material-ui/core";
import { getTotalPrice } from "../utils";
import { IOrder } from "../interfaces";

export default (props: { order: IOrder }) => {
  const { order } = props;
  const labels = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "quantity", label: "Menge" },
    { key: "price", label: "Preis" },
  ];

  const footer = (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={labels.length - 1} align="right">
          TOTAL:
        </TableCell>
        <TableCell align="right">{getTotalPrice(order)}</TableCell>
      </TableRow>
    </TableFooter>
  );

  const row = (item: { [label: string]: string | number }, keys: string[]) => {
    return (
      <TableRow key={item[keys[0]]}>
        {keys.map((key, index) => {
          if (index === 0)
            return (
              <TableCell key={index} component="th" scope="row">
                {item[keys[0]]}
              </TableCell>
            );
          return (
            <TableCell key={index} align="right">
              {item[key]}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  return <Table labels={labels} data={order.order} row={row} footer={footer} />;
};
