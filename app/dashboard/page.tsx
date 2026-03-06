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
import {
  Users,
  HardHat,
  Building2,
  MapPin,
  Search,
  FileEdit,
  FileText,
  Image as ImageIcon,
  FileBarChart,
} from "lucide-react";
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
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
            <div className="text-[#136FB6] mb-4">
              <FileEdit size={26} strokeWidth={2.5} />
            </div>
            <h3 className="text-[#136FB6] font-extrabold text-[16px] mb-0.5 tracking-wide">
              Agreement
            </h3>
            <p className="text-gray-500 text-[11px] font-bold tracking-wide">
              Details
            </p>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
            <div className="text-[#136FB6] mb-4">
              <FileText size={26} strokeWidth={2.5} />
            </div>
            <h3 className="text-[#136FB6] font-extrabold text-[16px] mb-0.5 tracking-wide">
              Physical Progress
            </h3>
            <p className="text-gray-500 text-[11px] font-bold tracking-wide">
              Details
            </p>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
            <div className="text-[#136FB6] mb-4">
              <ImageIcon size={26} strokeWidth={2.5} />
            </div>
            <h3 className="text-[#136FB6] font-extrabold text-[16px] mb-0.5 tracking-wide">
              Pictures
            </h3>
            <p className="text-gray-500 text-[11px] font-bold tracking-wide">
              From GIS App
            </p>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
            <div className="text-[#136FB6] mb-4">
              <FileBarChart size={26} strokeWidth={2.5} />
            </div>
            <h3 className="text-[#136FB6] font-extrabold text-[16px] mb-0.5 tracking-wide">
              Report
            </h3>
            <p className="text-gray-500 text-[11px] font-bold tracking-wide">
              DO & Contractor Detail
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
