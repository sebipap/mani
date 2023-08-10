import fs from "fs";
import { Expense } from "./app/lib/type";

export default function saveMock(expenses: Expense[]) {
  fs.writeFileSync(
    "mockExpenses.json",
    JSON.stringify(
      expenses
        .filter(({ date }) => {
          const d = new Date(date);
          return d.getMonth() > 3 && d.getFullYear() === 2023;
        })
        .map(({ date, ...rest }, index) => {
          const lorem =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
          const loremWords = lorem.split(" ");

          return {
            ...rest,
            date: `${date.getFullYear()}/${
              date.getMonth() + 1
            }/${date.getDate()}`,
            description: loremWords[index % loremWords.length],
          };
        })
    )
  );
}
