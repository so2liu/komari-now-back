import React, { useContext } from "react";
import {
  useNowOrders,
  setPartnerHandled,
  setTableFinished,
} from "../services/firebase";
import CartTableUnchangable from "../components/CartTableUnchangable";
import {
  Grid,
  Button,
  Box,
  makeStyles,
  Divider,
  Typography,
} from "@material-ui/core";
import { IOrder, ISentOrder } from "../interfaces";
import moment from "moment";
import "moment/locale/de";
import SimpleTabs from "../components/UI/Tabs";
import { mergeOrdersByTable, createOrder } from "../utils";
import { mockMenu } from "../mock";
import { MenuContext } from "../stores";

moment.locale("de");

export default () => {
  const classes = useStyles();
  const nowOrders = useNowOrders();
  const nowMenu = useContext(MenuContext);
  const openOrders = (
    <>
      {nowOrders.state
        .filter((order) => order[1].isPartnerHandled === false)
        .map((order, index) => (
          <OrderCard key={index} order={order} />
        ))}
    </>
  );

  const closeOrders = (
    <>
      {nowOrders.state
        .filter((order) => order[1].isPartnerHandled === true)
        .map((order, index) => (
          <OrderCard key={index} order={order} />
        ))}
    </>
  );

  const openTableOrders = mergeOrdersByTable(
    nowOrders.state.map((each) => each[1])
  );
  const openTables = (
    <>
      {openTableOrders.map(([tableID, orderInfo]) => {
        const order = createOrder(orderInfo.IDs, orderInfo.quantities, nowMenu);
        return <TableCard key={tableID} order={order} />;
      })}
    </>
  );

  return (
    <SimpleTabs
      tabs={[
        { label: "Open Orders", content: openOrders },
        { label: "Close Orders", content: closeOrders },
        { label: "Open Tables", content: openTables },
      ]}
    />
  );
};

const TableCard = (props: { order: IOrder }) => {
  const { order } = props;
  const closeTableHandler = () => {
    setTableFinished(order.tableID, true);
  };
  return (
    <Box mt={2}>
      <Grid container justify="space-between">
        <Typography variant="h5">Tisch: {order.tableID}</Typography>
      </Grid>
      <CartTableUnchangable order={order} />
      <Button variant="contained" onClick={closeTableHandler}>
        Close Table
      </Button>
      <Divider variant="middle" />
    </Box>
  );
};

const OrderCard = (props: { order: [string, ISentOrder] }) => {
  const { order } = props;

  const closeHandler = () => {
    setPartnerHandled(order[0], true);
  };

  const reopenHandler = () => {
    setPartnerHandled(order[0], false);
  };

  return (
    <Box mt={2}>
      <Grid container justify="space-between">
        <Typography variant="h5">Tisch: {order[1].tableID}</Typography>
        <Typography variant="h5">
          @ {moment(order[1].updatedAt.toDate()).fromNow()}
        </Typography>
      </Grid>
      <CartTableUnchangable order={order[1]} />
      <ButtonPair
        isOpen={!order[1].isPartnerHandled}
        onClose={closeHandler}
        onReopen={reopenHandler}
      />
      <Divider variant="middle" />
    </Box>
  );
};

const ButtonPair = (props: {
  isOpen: boolean;
  onClose: () => void;
  onReopen: () => void;
}) => {
  const { isOpen } = props;
  const closeBtn = (
    <Button color="primary" variant="contained" onClick={props.onClose}>
      Resolve/Close
    </Button>
  );
  const reopenBtn = (
    <Button color="secondary" variant="contained" onClick={props.onReopen}>
      Reopen
    </Button>
  );

  return (
    <Box pt={1} pb={1}>
      {isOpen ? closeBtn : reopenBtn}
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 650,
  },
}));
