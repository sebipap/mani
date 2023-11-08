import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserNav } from "./UserNav";
import { HistoricExpenses } from "./HistoricExpenses";
import { Expense } from "../lib/type";
import { SpendChart } from "./SpendChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chat } from "./Chat";
import { RecurrentExpenses } from "./RecurrentExpenses";
import Income from "./Income";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  expenses: Expense[];
};

export default function Dashboard(props: Props) {
  const { expenses } = props;

  return (
    <>
      <div className="flex-col flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">🫰 mani</h2>
            <div className="flex items-center space-x-2">
              <Link href={"https://t.me/sebipaps"}>
                <Button variant={"outline"}> Give me feedback!</Button>
              </Link>
              <UserNav />
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="chat">Chat ✨</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="flex flex-col max-w-[100%] col-span-4 gap-4">
                  <Card className="max-w-[100%]">
                    <CardHeader>
                      <CardTitle className="font-semibold leading-none tracking-tight">
                        Charts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <SpendChart expenses={expenses} />
                    </CardContent>
                  </Card>
                  <Card className="overflow-scroll max-w-[100%]">
                    <CardHeader>
                      <CardTitle className="font-semibold leading-none tracking-tight">
                        Recurrent Expenses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <RecurrentExpenses expenses={expenses} />
                    </CardContent>
                  </Card>
                </div>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HistoricExpenses expenses={expenses} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="chat" className="space-y-4">
              <Chat expenses={expenses} />
            </TabsContent>
            <TabsContent value="income" className="space-y-4">
              <Income expenses={expenses} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
