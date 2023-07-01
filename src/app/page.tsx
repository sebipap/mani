import DashboardPage from "./components/Dashboard";

export default async function Home() {
  return (
    <div>
      {/* @ts-expect-error Server Component */}
      <DashboardPage />
    </div>
  );
}
