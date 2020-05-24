import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Box } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
    maxWidth: 650,
    // width: 350,
  },
});

export default function SimpleTable(props: {
  labels: { key: string; label: string }[];
  data: { [label: string]: any }[];
  row: (item: any, keys: string[]) => JSX.Element;
  footer?: JSX.Element;
}) {
  const classes = useStyles();
  const { labels, data, row } = props;
  const keys = labels.map(({ key }) => key);
  return (
    <TableContainer component={Paper} className={classes.table}>
      <Box pl={1} pr={1}>
        <Table>
          <TableHead>
            <TableRow>
              {labels.map(({ label, key }, index) => (
                <TableCell
                  key={key}
                  align={
                    index === 0
                      ? "left"
                      : index === keys.length - 1
                      ? "right"
                      : "center"
                  }
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{data.map((item) => row(item, keys))}</TableBody>
          {props.footer}
        </Table>
      </Box>
    </TableContainer>
  );
}
