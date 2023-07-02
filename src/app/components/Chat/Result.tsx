import { isExpense } from "@/app/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { ExpensesTable } from "../ExpensesTable";

type Props = {
  json: string;
};

export const Result = ({ json }: Props) => {
  if (!json) return null;
  const isNumber = json.match(/^[0-9]+$/);
  const isArray = json.match(/^\[.*\]$/);
  const isString = json.match(/^".*"$/);
  const isObject = json.match(/^\{.*\}$/);
  const isValidExpense = isObject && isExpense(JSON.parse(json));

  return (
    <div className="max-h-[200px] max-w-[600px] overflow-scroll text-black">
      {isNumber || isString ? (
        <span>{json}</span>
      ) : isArray ? (
        <>
          {isExpense(JSON.parse(json)[0]) ? (
            <ExpensesTable expenses={JSON.parse(json)} />
          ) : (
            // given an array of object with unknown properties, render a table with the object keys as headers and the values as rows
            <Table>
              <TableBody>
                <TableRow>
                  {Object.keys(JSON.parse(json)?.[0] || []).map((key) => (
                    <TableHeaderCell key={key}>{key}</TableHeaderCell>
                  ))}
                </TableRow>
                {JSON.parse(json).map((object: any) => (
                  <TableRow key={JSON.stringify(object)}>
                    {Object.values(object).map((value) => (
                      <TableCell key={value as string}>
                        <Result json={JSON.stringify(value)} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      ) : isObject ? (
        isValidExpense ? (
          <ExpensesTable expenses={[JSON.parse(json)]} />
        ) : (
          // render a table with the object keys as headers and the values as rows
          <Table>
            <TableBody className={"bg-white"}>
              <TableRow>
                {Object.keys(JSON.parse(json)).map((key) => (
                  <TableHeaderCell key={key}>{key}</TableHeaderCell>
                ))}
              </TableRow>
              <TableRow>
                {Object.values(JSON.parse(json)).map((value) => (
                  <TableCell key={value as string}>
                    <Result json={JSON.stringify(value)} />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        )
      ) : (
        <span>{json}</span>
      )}{" "}
    </div>
  );
};
