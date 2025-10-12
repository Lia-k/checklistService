import SectionHeading from "@/sections/SectionHeading";
import SectionTablesCount from "@/sections/SectionTablesCount";
import SectionTable from "@/sections/SectionTable";

export default function Home() {
  return (
    <div className="">
      <main className="py-6 px-6">
        <SectionHeading />
        <SectionTablesCount />
        <SectionTable />
      </main>
    </div>
  );
}
