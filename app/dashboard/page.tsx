"use client";

import React from "react";
import {
  getDepartments,
  getContractors,
  getProjects,
  getCityVillages,
  getDashboardStats,
} from "@/services/masterService";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Users, HardHat, Building2, MapPin, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardPage() {
  const [stats, setStats] = React.useState({
    totalDepartment: 0,
    totalWork: 0,
    totalContractor: 0,
    totalVillage: 0,
  });
  const [projectReviewData, setProjectReviewData] = React.useState<any[]>([]);
  const [completionStatusData, setCompletionStatusData] = React.useState<any[]>(
    [],
  );
  const [expenseHeadData, setExpenseHeadData] = React.useState<any[]>([]);
  const [projectStatuses] = React.useState<string[]>([
    "Completed",
    "In Progress",
    "Processing",
    "Rejected",
  ]);
  const [remarkCategories] = React.useState<string[]>([
    "Urgent funds needed",
    "Urgent attention needed",
    "Dispute at village level",
    "Dispute at the contactor level",
  ]);
  const [villageStats, setVillageStats] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [depts, contractors, projects, villages, dashboardStats] =
          await Promise.all([
            getDepartments(),
            getContractors(),
            getProjects(),
            getCityVillages(),
            getDashboardStats(),
          ]);

        setStats({
          totalDepartment: depts.length,
          totalWork: projects.length,
          totalContractor: contractors.length,
          totalVillage: villages.length,
        });

        // Process Project Review Data (by Status)
        const statusCounts: Record<string, number> = {};
        projects.forEach((p: any) => {
          const statusName = p.projectStatus?.statusName || "No Status";
          statusCounts[statusName] = (statusCounts[statusName] || 0) + 1;
        });

        const reviewColors = [
          "#1f3b4d",
          "#f97316",
          "#14b8a6",
          "#ec4899",
          "#eab308",
          "#fb923c",
        ];
        setProjectReviewData(
          Object.entries(statusCounts).map(([name, value], index) => ({
            name: `${name} (${((value / projects.length) * 100).toFixed(1)}%)`,
            value,
            color: reviewColors[index % reviewColors.length],
          })),
        );

        // Process Expense Head Data (by Scheme)
        const schemeCounts: Record<string, number> = {};
        projects.forEach((p: any) => {
          const schemeName = p.scheme?.schemeName || "Other";
          schemeCounts[schemeName] = (schemeCounts[schemeName] || 0) + 1;
        });

        setExpenseHeadData(
          Object.entries(schemeCounts).map(([name, value]) => ({
            name,
            value,
          })),
        );

        // Completion Status Data from actual project progress
        const distribution: Record<number, number> = {};
        projects.forEach((p: any) => {
          let projectPercent = 0;
          const statusName = p.projectStatus?.statusName?.toLowerCase() || "";

          if (statusName === "completed") {
            projectPercent = 100;
          } else {
            const stages = p.projectStageTrackers || [];
            projectPercent = stages.reduce((acc: number, stage: any) => {
              const stageStatus = stage.stageStatus?.toLowerCase() || "";
              if (stageStatus === "completed") {
                return acc + (Number(stage.completionProgress) || 0);
              }
              return acc;
            }, 0);
          }

          const roundedPercent = Math.min(100, Math.round(projectPercent));
          distribution[roundedPercent] =
            (distribution[roundedPercent] || 0) + 1;
        });

        const chartColors = [
          "#ef4444",
          "#f97316",
          "#1f3b4d",
          "#14b8a6",
          "#eab308",
          "#64748b",
          "#94a3b8",
          "#ec4899",
          "#8b5cf6",
          "#06b6d4",
        ];

        const mappedData = Object.entries(distribution)
          .map(([percent, count], index) => ({
            name: `${percent}%`,
            value: count,
            color: chartColors[index % chartColors.length],
            percentValue: parseInt(percent),
          }))
          .sort((a, b) => b.percentValue - a.percentValue);

        setCompletionStatusData(mappedData);

        const villageStatsMap: Record<string, any> = {};

        projects.forEach((p: any) => {
          const villageName =
            p.city || p.panchayat?.panchayatName || "Unknown Village";

          if (!villageStatsMap[villageName]) {
            villageStatsMap[villageName] = {
              villageName,
              grandTotal: 0,
              latestRemarks: "",
            };
            projectStatuses.forEach(
              (s) => (villageStatsMap[villageName][s] = 0),
            );
            remarkCategories.forEach(
              (r) => (villageStatsMap[villageName][r] = 0),
            );
          }

          // 1. Map Project Status
          const statusName = p.projectStatus?.statusName;
          if (projectStatuses.includes(statusName)) {
            villageStatsMap[villageName][statusName]++;
          } else {
            // Fallback: check if any stage has this status
            const stages = p.projectStageTrackers || [];
            const activeStage = stages.find((s: any) =>
              projectStatuses.includes(s.stageStatus),
            );
            if (activeStage) {
              villageStatsMap[villageName][activeStage.stageStatus]++;
            }
          }

          // 2. Gather Site Remarks
          const stages = p.projectStageTrackers || [];
          stages.forEach((s: any) => {
            if (s.remarks && remarkCategories.includes(s.remarks)) {
              villageStatsMap[villageName][s.remarks]++;
            }
          });

          // Keep legacy latestRemarks for alert filtering if needed
          const remarks = stages
            .filter((s: any) => s.remarks)
            .map((s: any) => s.remarks);
          if (remarks.length > 0) {
            villageStatsMap[villageName].latestRemarks =
              remarks[remarks.length - 1];
          }

          villageStatsMap[villageName].grandTotal++;
        });

        const villageStatsArray = Object.values(villageStatsMap).sort((a, b) =>
          a.villageName.localeCompare(b.villageName),
        );
        setVillageStats(villageStatsArray);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const summaryData = [
    {
      title: "Total Department",
      value: stats.totalDepartment.toLocaleString(),
      icon: <Building2 className="text-[#105E9A]" size={24} />,
      bgColor: "bg-[#136FB6]/10",
    },
    {
      title: "Total Work",
      value: stats.totalWork.toLocaleString(),
      icon: <HardHat className="text-[#105E9A]" size={24} />,
      bgColor: "bg-[#136FB6]/10",
    },
    {
      title: "Total Contractor",
      value: stats.totalContractor.toLocaleString(),
      icon: <Users className="text-[#105E9A]" size={24} />,
      bgColor: "bg-[#136FB6]/10",
    },
    {
      title: "Total Village",
      value: stats.totalVillage.toLocaleString(),
      icon: <MapPin className="text-[#105E9A]" size={24} />,
      bgColor: "bg-[#136FB6]/10",
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#136FB6] mx-auto"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryData.map((item, index) => (
            <Card key={index} className="border-none shadow-sm overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.bgColor}`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {item.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pie Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Project Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectReviewData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {projectReviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Projects Completion Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {completionStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value} Projects`,
                        `Progress: ${name}`,
                      ]}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bar Chart */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Project Vs Department - Expense Head
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseHeadData} margin={{ bottom: 100 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={100}
                    tick={{ fontSize: 11, fill: "#666" }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#666" }} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Village-wise Project Status Table */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              COUNTA Of Village Name (All {stats.totalVillage})
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Search here"
                  className="pl-10 w-[250px] bg-white border-0 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] bg-[#136FB6]/5 border-none text-[#136FB6] font-medium">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Alert">Alert</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white hover:bg-white border-b text-[12px]">
                      <TableHead className=" font-bold text-gray-700">
                        S No.
                      </TableHead>
                      <TableHead className="font-bold text-gray-700 t">
                        Village Name (All {stats.totalVillage})
                      </TableHead>

                      {projectStatuses.map((status) => (
                        <TableHead
                          key={status}
                          className="text-center font-bold text-gray-700 whitespace-nowrap"
                        >
                          {status}
                        </TableHead>
                      ))}
                      {remarkCategories.map((remark) => (
                        <TableHead
                          key={remark}
                          className="text-center font-bold text-gray-700 whitespace-nowrap  "
                        >
                          {remark}
                        </TableHead>
                      ))}
                      <TableHead className="text-center font-bold text-gray-700 whitespace-nowrap">
                        Grand Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {villageStats
                      .filter((vs) =>
                        vs.villageName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                      )
                      .filter((vs) => {
                        if (statusFilter === "All") return true;
                        const alertCategories = [
                          "Site Me Dikkat H",
                          "Urgent Attention Needed",
                          "Work Delayed",
                        ];
                        const hasAlert = alertCategories.some(
                          (cat) => vs[cat] > 0,
                        );
                        return statusFilter === "Alert" ? hasAlert : !hasAlert;
                      })
                      .map((vs, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50 transition-colors border-b last:border-0 text-[12px]"
                        >
                          <TableCell className=" text-gray-500">
                            {index + 1}
                          </TableCell>
                          <TableCell className=" text-gray-900">
                            {vs.villageName}
                          </TableCell>

                          {projectStatuses.map((status) => (
                            <TableCell
                              key={status}
                              className="text-center font-medium"
                            >
                              {vs[status] || "-"}
                            </TableCell>
                          ))}
                          {remarkCategories.map((remark) => (
                            <TableCell
                              key={remark}
                              className="text-center font-medium"
                            >
                              {vs[remark] || "-"}
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-bold text-gray-900">
                            {vs.grandTotal}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-6 pt-2">
                <p className="text-sm font-medium text-gray-400">
                  Total Order : {stats.totalWork}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}


