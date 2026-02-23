"use client";

import { useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getProjects,
  getProjectStages,
  updateProjectStage,
  createProject,
  getDistricts,
  getBlocks,
  getPanchayats,
  getDepartments,
  getSchemes,
  getWorkTypes,
  getWorkSubtypes,
} from "@/services/masterService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { format } from "date-fns";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getContractors,
  updateProject,
  getProjectStatuses,
  getWorkStageTemplates,
  createProjectStage,
  deleteProject,
} from "@/services/masterService";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Project {
  _id: string;
  nameOfWork: string;
  fundSource: string;
  sanctionedAmount: number;
  startDate: string;
  endDate: string;
  contractorAgencyId: string | null;
  contractorAgency?: {
    contractorName: string;
  };
  projectStatus?: {
    statusName: string;
  };
  workSubtypeId: string;
  workOrderNo?: string;
  workOrderAmount?: number;
  workOrderDate?: string;
  estimatedDate?: string;
}

function ProjectsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createParam = searchParams.get("create");

  const [filter, setFilter] = useState<"all" | "ongoing" | "technical">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [loadingStages, setLoadingStages] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Allotment State
  const [isAllotDialogOpen, setIsAllotDialogOpen] = useState(false);
  const [allottingProject, setAllottingProject] = useState<Project | null>(
    null,
  );
  const [contractors, setContractors] = useState<any[]>([]);
  const [selectedContractorId, setSelectedContractorId] = useState<string>("");
  const [workOrderNo, setWorkOrderNo] = useState("");
  const [workOrderDate, setWorkOrderDate] = useState<Date | undefined>(
    new Date(),
  );
  const [estimatedDate, setEstimatedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [isSubmittingAllotment, setIsSubmittingAllotment] = useState(false);
  const [customStages, setCustomStages] = useState<
    { title: string; percentage: string }[]
  >([]);

  const { toast } = useToast();
  // Create Project State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (createParam === "true") {
      setIsCreateDialogOpen(true);
      // Clear URL param after opening to avoid re-opening on manual refresh
      router.replace("/projects", { scroll: false });
    }
  }, [createParam, router]);

  // Master Data
  const [districts, setDistricts] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [panchayats, setPanchayats] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [workTypes, setWorkTypes] = useState<any[]>([]);
  const [workSubtypes, setWorkSubtypes] = useState<any[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<any[]>([]);

  // Form State
  const [nameOfWork, setNameOfWork] = useState("");
  const [fundSource, setFundSource] = useState("");
  const [sanctionedAmount, setSanctionedAmount] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("");
  const [selectedPanchayatId, setSelectedPanchayatId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedSchemeId, setSelectedSchemeId] = useState("");
  const [selectedWorkTypeId, setSelectedWorkTypeId] = useState("");
  const [selectedWorkSubtypeId, setSelectedWorkSubtypeId] = useState("");
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [tenderDate, setTenderDate] = useState<Date | undefined>(new Date());
  const [workLocation, setWorkLocation] = useState("");
  const [city, setCity] = useState("");
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const removeError = (field: string) => {
    setErrorFields((prev) => prev.filter((f) => f !== field));
  };

  const handleAddCustomStage = () => {
    setCustomStages([...customStages, { title: "", percentage: "" }]);
  };

  const handleRemoveCustomStage = (index: number) => {
    const newStages = [...customStages];
    newStages.splice(index, 1);
    setCustomStages(newStages);
  };

  const handleCustomStageChange = (
    index: number,
    field: "title" | "percentage",
    value: string,
  ) => {
    const newStages = [...customStages];
    newStages[index][field] = value;
    setCustomStages(newStages);
  };

  const handleViewStages = async (project: Project) => {
    setSelectedProject(project);
    setLoadingStages(true);
    try {
      const data = await getProjectStages(project._id);
      setStages(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch project stages",
      });
    } finally {
      setLoadingStages(false);
    }
  };

  const handleOpenAllotDialog = async (project: Project) => {
    setAllottingProject(project);
    setSelectedContractorId(project.contractorAgencyId || "");
    setWorkOrderNo(project.workOrderNo || "");
    try {
      const data = await getContractors();
      setContractors(data);
      // Reset custom stages when opening dialog
      setCustomStages([{ title: "", percentage: "" }]);
      setIsAllotDialogOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch contractors",
      });
    }
  };

  // Fetch initial master data
  const { data: initialData = {} } = useQuery({
    queryKey: ["masterData"],
    queryFn: async () => {
      const [dists, depts, schs, wTypes, pStatuses] = await Promise.all([
        getDistricts(),
        getDepartments(),
        getSchemes(),
        getWorkTypes(),
        getProjectStatuses(),
      ]);
      setDistricts(dists);
      setDepartments(depts);
      setSchemes(schs);
      setWorkTypes(wTypes);
      setProjectStatuses(pStatuses);
      return { dists, depts, schs, wTypes, pStatuses };
    },
  });

  // Fetch blocks when district changes
  const { data: blocksData } = useQuery({
    queryKey: ["blocks", selectedDistrictId],
    queryFn: () => getBlocks(selectedDistrictId),
    enabled: !!selectedDistrictId,
  });

  const { data: panchayatsData } = useQuery({
    queryKey: ["panchayats", selectedBlockId],
    queryFn: () => getPanchayats(), // Note: getPanchayats might not take blockId in this API version
    enabled: !!selectedBlockId,
  });

  const { data: subtypesData } = useQuery({
    queryKey: ["subtypes", selectedWorkTypeId],
    queryFn: () => getWorkSubtypes(selectedWorkTypeId),
    enabled: !!selectedWorkTypeId,
  });

  const handleCreateProject = async () => {
    const missing = [];
    if (!nameOfWork) missing.push("nameOfWork");
    if (!selectedDistrictId) missing.push("districtId");
    if (!selectedBlockId) missing.push("blockId");
    if (!selectedPanchayatId) missing.push("panchayatId");
    if (!selectedDepartmentId) missing.push("departmentId");
    if (!selectedSchemeId) missing.push("schemeId");
    if (!selectedWorkTypeId) missing.push("workTypeId");
    if (!selectedWorkSubtypeId) missing.push("workSubtypeId");
    if (!selectedStatusId) missing.push("projectStatusId");
    if (!sanctionedAmount) missing.push("sanctionedAmount");
    if (!workLocation) missing.push("workLocation");

    if (missing.length > 0) {
      setErrorFields(missing);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill all required fields marked in red",
      });
      return;
    }

    setIsSubmittingProject(true);
    try {
      await createProject({
        nameOfWork,
        fundSource,
        sanctionedAmount: parseFloat(sanctionedAmount),
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        tenderDate: tenderDate?.toISOString(),
        districtId: selectedDistrictId,
        blockId: selectedBlockId,
        panchayatId: selectedPanchayatId,
        departmentId: selectedDepartmentId,
        schemeId: selectedSchemeId,
        workTypeId: selectedWorkTypeId,
        workSubtypeId: selectedWorkSubtypeId,
        workLocation: workLocation,
        city: city,
        projectStatusId: selectedStatusId,
      });

      toast({
        title: "Success",
        description: "Project created successfully",
      });
      setIsCreateDialogOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: error.message || "An error occurred",
      });
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const handleAllotProject = async () => {
    if (!allottingProject || !selectedContractorId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a contractor",
      });
      return;
    }

    setIsSubmittingAllotment(true);
    try {
      // 1. Get Ongoing status ID
      const statusRes = await getProjectStatuses();
      const ongoingStatus = statusRes.find((s: any) =>
        s.statusName.toLowerCase().includes("ongoing"),
      );
      if (!ongoingStatus) throw new Error("'Ongoing' status not found");

      // 2. Update Project
      await updateProject(allottingProject._id, {
        contractorAgencyId: selectedContractorId,
        workOrderNo,
        workOrderAmount: allottingProject.sanctionedAmount,
        workOrderDate: workOrderDate?.toISOString(),
        estimatedDate: estimatedDate?.toISOString(),
        projectStatusId: ongoingStatus._id,
      });

      // 3. Create Stages (Manual or Template)
      if (customStages.length > 0 && customStages.some((s) => s.title)) {
        // Validate total percentage
        const totalPct = customStages.reduce(
          (acc, s) => acc + parseFloat(s.percentage || "0"),
          0,
        );
        if (Math.abs(totalPct - 100) > 0.1) {
          throw new Error("Total stage percentage must be exactly 100%");
        }

        for (let i = 0; i < customStages.length; i++) {
          const s = customStages[i];
          if (!s.title) continue;
          await createProjectStage({
            projectId: allottingProject._id,
            stageName: s.title,
            stageSequence: i + 1,
            stageStatus: i === 0 ? "In Progress" : "Pending",
            completionProgress: 0,
            remarks: "",
          });
        }
      } else {
        // Fallback to Template
        const allTemplates = await getWorkStageTemplates();
        const templates = Array.isArray(allTemplates)
          ? allTemplates.filter(
              (t: any) => t.workSubtypeId === allottingProject.workSubtypeId,
            )
          : [];

        if (templates.length > 0) {
          const sortedTemplates = templates.sort(
            (a: any, b: any) =>
              (a.stageSequenceNumber || 0) - (b.stageSequenceNumber || 0),
          );

          for (let i = 0; i < sortedTemplates.length; i++) {
            const t = sortedTemplates[i];
            await createProjectStage({
              projectId: allottingProject._id,
              stageName: t.stageName,
              stageSequence: t.stageSequenceNumber || i + 1,
              stageStatus: i === 0 ? "In Progress" : "Pending",
              completionProgress: 0,
              remarks: "",
            });
          }
        }
      }

      toast({
        title: "Success",
        description: "Project allotted successfully",
      });
      setIsAllotDialogOpen(false);
      // Refresh project list
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Allotment Failed",
        description: error.message || "An error occurred during allotment",
      });
    } finally {
      setIsSubmittingAllotment(false);
    }
  };

  const handleUpdateStageStatus = async (
    stageId: string,
    newStatus: string,
  ) => {
    try {
      const payload: any = { stageStatus: newStatus };
      if (newStatus === "Completed") {
        payload.remarks = "";
      }
      await updateProjectStage(stageId, payload);
      toast({
        title: "Success",
        description: `Stage status updated to ${newStatus} successfully`,
      });
      // Refresh stages
      if (selectedProject) {
        const data = await getProjectStages(selectedProject._id);
        setStages(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update stage status",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await deleteProject(id);
      toast({
        title: "Project Deleted",
        description: "The project has been successfully removed.",
      });
      // Refresh list
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete project",
      });
    }
  };

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const filteredProjects = projects.filter((project: Project) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "ongoing" && !!project.contractorAgencyId) ||
      (filter === "technical" && !project.contractorAgencyId);

    const matchesSearch =
      project.nameOfWork.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.fundSource || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (project.contractorAgency?.contractorName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Projects
            </h1>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Label
                htmlFor="search"
                className="whitespace-nowrap font-semibold text-gray-700"
              >
                Search Project:
              </Label>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by name, fund, contractor..."
                  className="pl-9 bg-white border-gray-200"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  filter === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("ongoing")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  filter === "ongoing"
                    ? "bg-white text-[#136FB6] shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setFilter("technical")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  filter === "technical"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Technical
              </button>
            </div>
          </div>
        </div>

        <Card className="shadow-sm border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-white border-b px-6 py-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {filter === "all"
                ? "All Projects"
                : filter === "ongoing"
                  ? "Ongoing Projects"
                  : "Technical Projects"}
            </CardTitle>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-[#136FB6] hover:bg-[#105E9A] h-9"
            >
              <Plus size={16} className="mr-2" />
              Create Project
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-100">
                    <TableHead className="w-12 py-4 pl-6 font-semibold text-gray-600">
                      S No.
                    </TableHead>
                    <TableHead className="py-4 font-semibold text-gray-600">
                      Project Details
                    </TableHead>
                    <TableHead className="py-4 font-semibold text-gray-600">
                      Amount & Fund
                    </TableHead>
                    <TableHead className="py-4 font-semibold text-gray-600">
                      Timeline
                    </TableHead>
                    <TableHead className="py-4 font-semibold text-gray-600">
                      Contractor
                    </TableHead>
                    <TableHead className="py-4 font-semibold text-gray-600">
                      Status
                    </TableHead>
                    <TableHead className="py-4 font-semibold text-gray-600">
                      Stages
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-12 text-gray-500"
                      >
                        Loading projects...
                      </TableCell>
                    </TableRow>
                  ) : currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-12 text-gray-500"
                      >
                        {searchTerm
                          ? "No projects match your search"
                          : "No projects found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((item: Project, index: number) => (
                      <TableRow
                        key={item._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="pl-6 py-4 font-medium text-gray-500">
                          {indexOfFirstItem + index + 1}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-gray-900 line-clamp-1">
                              {item.nameOfWork}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Briefcase size={12} />
                              <span>
                                Work ID: {item._id.slice(-6).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-900">
                              ₹{item.sanctionedAmount.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">
                              {item.fundSource}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar size={12} className="text-green-500" />
                              <span>
                                Start:{" "}
                                {format(
                                  new Date(item.startDate),
                                  "dd MMM yyyy",
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={12} className="text-red-500" />
                              <span>
                                End:{" "}
                                {format(new Date(item.endDate), "dd MMM yyyy")}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {item.contractorAgency ? (
                            <div className="flex items-center gap-2 text-sm text-gray-700 bg-[#136FB6]/5 px-2 py-1 rounded-md border border-[#136FB6]/10 w-fit">
                              <User size={14} className="text-[#136FB6]" />
                              <span className="font-medium">
                                {item.contractorAgency.contractorName}
                              </span>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              className="h-8 gap-2 bg-[#136FB6] hover:bg-[#105E9A]"
                              onClick={() => handleOpenAllotDialog(item)}
                            >
                              Allotment
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <div
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit border ${
                              !item.projectStatus
                                ? "bg-gray-100 text-gray-600 border-gray-200"
                                : item.projectStatus.statusName === "Completed"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                !item.projectStatus
                                  ? "bg-gray-400"
                                  : item.projectStatus.statusName ===
                                      "Completed"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                              }`}
                            ></div>
                            {item.projectStatus?.statusName || "Unknown"}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
                              onClick={() => handleViewStages(item)}
                            >
                              <Eye size={14} />
                              Stages
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteProject(item._id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50/50">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredProjects.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredProjects.length}</span>{" "}
                  projects
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`h-8 w-8 p-0 ${currentPage === page ? "bg-[#136FB6] hover:bg-[#105E9A]" : ""}`}
                      >
                        {page}
                      </Button>
                    ),
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Stages</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {loadingStages ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : stages.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                No stages found for this project.
              </div>
            ) : (
              <div className="space-y-4">
                {stages.map((stage, index) => {
                  const activeStageIndex = stages.findIndex(
                    (s) =>
                      s.stageStatus !== "Completed" &&
                      s.stageStatus !== "Processing",
                  );
                  const isActiveStage = index === activeStageIndex;
                  const isCompleted = stage.stageStatus === "Completed";
                  const isProcessing = stage.stageStatus === "Processing";

                  return (
                    <div
                      key={stage._id}
                      className={`flex flex-col p-4 rounded-lg border border-gray-100 ${
                        isActiveStage
                          ? "bg-[#136FB6]/5/50 border-[#136FB6]/10"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            {stage.stageName}
                            {isActiveStage && (
                              <span className="text-[10px] bg-[#136FB6]/10 text-[#105E9A] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                                Current
                              </span>
                            )}
                          </h4>

                          {(stage.remarks ||
                            stage.description ||
                            stage.review ||
                            isCompleted ||
                            isProcessing ||
                            (isActiveStage &&
                              !stage.remarks &&
                              (!stage.images || stage.images.length === 0) &&
                              stage.stageStatus !== "Rejected")) && (
                            <div className="mt-2 space-y-2">
                              {isCompleted ? (
                                <p className="text-green-600 font-medium">
                                  Completed{" "}
                                  <span className="text-gray-400 font-normal">
                                    |
                                  </span>{" "}
                                  <span className="text-[#136FB6]">
                                    {"Payment Released"}
                                  </span>
                                </p>
                              ) : isActiveStage &&
                                !stage.remarks &&
                                (!stage.images || stage.images.length === 0) &&
                                stage.stageStatus !== "Rejected" ? (
                                <p className="text-gray-900 font-medium">
                                  Ongoing
                                </p>
                              ) : (
                                (stage.remarks ||
                                  isProcessing ||
                                  stage.stageStatus === "Rejected") && (
                                  <p
                                    className={`${stage.stageStatus === "Rejected" ? "text-red-600" : "text-blue-600"} font-medium`}
                                  >
                                    {stage.stageStatus}
                                    {stage.remarks &&
                                      stage.stageStatus !== "Rejected" && (
                                        <>
                                          {" "}
                                          <span className="text-gray-400 font-normal">
                                            |
                                          </span>{" "}
                                          <span className="text-[#136FB6]">
                                            {stage.remarks}
                                          </span>
                                        </>
                                      )}
                                  </p>
                                )
                              )}

                              {/* New fields: Review and Updated By */}
                              {(stage.review || stage.updateBy) && (
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs">
                                  {stage.review && (
                                    <div className="flex items-center gap-1.5 text-gray-600 bg-gray-100/50 px-2 py-0.5 rounded">
                                      <CheckCircle
                                        size={12}
                                        className="text-green-500"
                                      />
                                      <span className="font-medium text-gray-500 uppercase tracking-tight">
                                        Review:
                                      </span>
                                      <span className="text-gray-900">
                                        {stage.review}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Description / Reason Field */}
                              {stage.description && (
                                <div className="mt-2 p-2 bg-[#136FB6]/5/50 rounded-lg border border-[#136FB6]/10/50">
                                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">
                                    Description{" "}
                                  </p>
                                  <p className="text-xs text-gray-700 italic leading-relaxed">
                                    "{stage.description}"
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          {stage.completionDate && (
                            <p className="text-xs text-gray-400 mt-1">
                              Completed:{" "}
                              {format(
                                new Date(stage.completionDate),
                                "dd MMM yyyy",
                              )}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <Select
                            defaultValue={stage.stageStatus}
                            onValueChange={(value) =>
                              handleUpdateStageStatus(stage._id, value)
                            }
                          >
                            <SelectTrigger
                              className={`h-8 px-3 rounded-full text-xs font-semibold border-0 focus:ring-0 focus:ring-offset-0 transition-colors ${
                                stage.stageStatus === "Completed"
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : stage.stageStatus === "Processing"
                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                    : stage.stageStatus === "Rejected"
                                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                                      : stage.stageStatus === "In Progress" ||
                                          (isActiveStage &&
                                            stage.stageStatus === "Pending")
                                        ? "bg-[#136FB6]/10 text-[#0D4B7A] hover:bg-[#136FB6]/20"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                {isActiveStage &&
                                !stage.remarks &&
                                (!stage.images || stage.images.length === 0) &&
                                stage.stageStatus !== "Completed" &&
                                stage.stageStatus !== "Processing" &&
                                stage.stageStatus !== "Rejected"
                                  ? "Ongoing"
                                  : stage.stageStatus}
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="Processing">
                                Processing
                              </SelectItem>
                              <SelectItem value="Completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {stage.images && stage.images.length > 0 && (
                        <div className="mt-4">
                          <div
                            className="relative w-24 h-24 cursor-pointer group rounded-xl overflow-hidden border-2 border-white shadow-md ring-1 ring-gray-200"
                            onClick={() => {
                              setViewerImages(stage.images);
                              setIsViewerOpen(true);
                            }}
                          >
                            <img
                              src={stage.images[0]}
                              alt={`Stage update`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                              <Eye size={20} className="mb-1" />
                              <span className="text-[10px] font-bold uppercase tracking-tighter">
                                {stage.images.length} Photos
                              </span>
                            </div>
                            {stage.images.length > 1 && (
                              <div className="absolute bottom-1 right-1 bg-white/90 text-[10px] font-bold text-gray-800 px-1.5 py-0.5 rounded-md shadow-sm">
                                +{stage.images.length - 1}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl p-0 bg-black/95 border-none h-[90vh] flex flex-col items-center justify-center">
          <Carousel className="w-full h-full flex flex-col items-center justify-center px-12">
            <CarouselContent className="h-full">
              {viewerImages.map((img, idx) => (
                <CarouselItem
                  key={idx}
                  className="h-full flex items-center justify-center"
                >
                  <img
                    src={img}
                    alt={`Update photo ${idx + 1}`}
                    className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {viewerImages.length > 1 && (
              <>
                <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 border-white/20 text-white" />
                <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 border-white/20 text-white" />
              </>
            )}
          </Carousel>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium bg-white/5 px-4 py-1.5 rounded-full backdrop-blur-md">
            Update Photos • {viewerImages.length} items
          </div>
        </DialogContent>
      </Dialog>

      {/* Allotment Dialog */}
      <Dialog open={isAllotDialogOpen} onOpenChange={setIsAllotDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Project Allotment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Project Name</Label>
              <Input
                value={allottingProject?.nameOfWork || ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Select Contractor</Label>
              <Select
                onValueChange={setSelectedContractorId}
                value={selectedContractorId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a contractor" />
                </SelectTrigger>
                <SelectContent>
                  {contractors.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.contractorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Work Order No.</Label>
                <Input
                  value={workOrderNo}
                  onChange={(e) => setWorkOrderNo(e.target.value)}
                  placeholder="Enter order no"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">W.O. Amount</Label>
                <Input
                  value={`₹${allottingProject?.sanctionedAmount.toLocaleString() || "0"}`}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 flex flex-col">
                <Label className="text-xs text-gray-500">W.O. Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10",
                        !workOrderDate && "text-muted-foreground",
                      )}
                    >
                      <Calendar size={14} className="mr-2" />
                      <span className="truncate">
                        {workOrderDate
                          ? format(workOrderDate, "dd MMM yyyy")
                          : "Pick date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={workOrderDate}
                      onSelect={setWorkOrderDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1 flex flex-col">
                <Label className="text-xs text-gray-500">
                  Estimate End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10",
                        !estimatedDate && "text-muted-foreground",
                      )}
                    >
                      <Calendar size={14} className="mr-2" />
                      <span className="truncate">
                        {estimatedDate
                          ? format(estimatedDate, "dd MMM yyyy")
                          : "Pick date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={estimatedDate}
                      onSelect={setEstimatedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="font-semibold text-gray-700">
                  Project Stages
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomStage}
                  className="h-7 text-xs"
                >
                  <Plus size={12} className="mr-1" /> Add Stage
                </Button>
              </div>
              {customStages.map((stage, index) => (
                <div key={index} className="flex gap-2 items-end mb-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Stage Title"
                      value={stage.title}
                      onChange={(e) =>
                        handleCustomStageChange(index, "title", e.target.value)
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      placeholder="%"
                      value={stage.percentage}
                      onChange={(e) =>
                        handleCustomStageChange(
                          index,
                          "percentage",
                          e.target.value,
                        )
                      }
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsAllotDialogOpen(false)}
              disabled={isSubmittingAllotment}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#136FB6] hover:bg-[#105E9A]"
              onClick={handleAllotProject}
              disabled={isSubmittingAllotment || !selectedContractorId}
            >
              {isSubmittingAllotment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Allotting...
                </>
              ) : (
                "Complete Allotment"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label
                className={
                  errorFields.includes("nameOfWork") ? "text-red-500" : ""
                }
              >
                Work Name {errorFields.includes("nameOfWork") && "*"}
              </Label>
              <Input
                placeholder="Enter work name..."
                value={nameOfWork}
                onChange={(e) => {
                  setNameOfWork(e.target.value);
                  removeError("nameOfWork");
                }}
                className={
                  errorFields.includes("nameOfWork") ? "border-red-500" : ""
                }
              />
            </div>

            <div className="space-y-2">
              <Label
                className={
                  errorFields.includes("districtId") ? "text-red-500" : ""
                }
              >
                District {errorFields.includes("districtId") && "*"}
              </Label>
              <Select
                onValueChange={(val) => {
                  setSelectedDistrictId(val);
                  removeError("districtId");
                }}
                value={selectedDistrictId}
              >
                <SelectTrigger
                  className={cn(
                    "w-full overflow-hidden",
                    errorFields.includes("districtId") ? "border-red-500" : "",
                  )}
                >
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d._id} value={d._id}>
                      {d.districtName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                className={
                  errorFields.includes("blockId") ? "text-red-500" : ""
                }
              >
                Block {errorFields.includes("blockId") && "*"}
              </Label>
              <Select
                onValueChange={(val) => {
                  setSelectedBlockId(val);
                  removeError("blockId");
                }}
                value={selectedBlockId}
                disabled={!selectedDistrictId}
              >
                <SelectTrigger
                  className={cn(
                    "w-full overflow-hidden",
                    errorFields.includes("blockId") ? "border-red-500" : "",
                  )}
                >
                  <SelectValue placeholder="Block" />
                </SelectTrigger>
                <SelectContent>
                  {(blocksData || []).map((b: any) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.blockName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>City/Village (Optional)</Label>
              <Input
                placeholder="Enter City/Village"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                className={
                  errorFields.includes("panchayatId") ? "text-red-500" : ""
                }
              >
                Panchayat {errorFields.includes("panchayatId") && "*"}
              </Label>
              <Select
                onValueChange={(val) => {
                  setSelectedPanchayatId(val);
                  removeError("panchayatId");
                }}
                value={selectedPanchayatId}
                disabled={!selectedBlockId}
              >
                <SelectTrigger
                  className={cn(
                    "w-full overflow-hidden",
                    errorFields.includes("panchayatId") ? "border-red-500" : "",
                  )}
                >
                  <SelectValue placeholder="Panchayat" />
                </SelectTrigger>
                <SelectContent>
                  {(panchayatsData || []).map((p: any) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.panchayatName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="mb-2">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal truncate",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <Calendar size={14} className="mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {startDate
                        ? format(startDate, "dd MMM yyyy")
                        : "Pick date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="mb-2">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal truncate",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <Calendar size={14} className="mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {endDate ? format(endDate, "dd MMM yyyy") : "Pick date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label
                className={
                  errorFields.includes("sanctionedAmount") ? "text-red-500" : ""
                }
              >
                Sanctioned Amount{" "}
                {errorFields.includes("sanctionedAmount") && "*"}
              </Label>
              <Input
                type="number"
                placeholder="₹"
                value={sanctionedAmount}
                onChange={(e) => {
                  setSanctionedAmount(e.target.value);
                  removeError("sanctionedAmount");
                }}
                className={
                  errorFields.includes("sanctionedAmount")
                    ? "border-red-500"
                    : ""
                }
              />
            </div>

            <div className="space-y-2">
              <Label
                className={
                  errorFields.includes("departmentId") ? "text-red-500" : ""
                }
              >
                Department {errorFields.includes("departmentId") && "*"}
              </Label>
              <Select
                onValueChange={(val) => {
                  setSelectedDepartmentId(val);
                  removeError("departmentId");
                }}
                value={selectedDepartmentId}
              >
                <SelectTrigger
                  className={cn(
                    "w-full overflow-hidden",
                    errorFields.includes("departmentId")
                      ? "border-red-500"
                      : "",
                  )}
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d._id} value={d._id}>
                      {d.departmentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                className={
                  errorFields.includes("schemeId") ? "text-red-500" : ""
                }
              >
                Scheme {errorFields.includes("schemeId") && "*"}
              </Label>
              <Select
                onValueChange={(val) => {
                  setSelectedSchemeId(val);
                  const scheme = schemes.find((s) => s._id === val);
                  if (scheme?.fundingSource) {
                    setFundSource(scheme.fundingSource);
                  }
                  removeError("schemeId");
                }}
                value={selectedSchemeId}
                disabled={!selectedDepartmentId}
              >
                <SelectTrigger
                  className={cn(
                    "w-full overflow-hidden",
                    errorFields.includes("schemeId") ? "border-red-500" : "",
                  )}
                >
                  <SelectValue placeholder="Select scheme" />
                </SelectTrigger>
                <SelectContent>
                  {(schemes || [])
                    .filter(
                      (s) =>
                        s.departmentId === selectedDepartmentId ||
                        s.department?._id === selectedDepartmentId,
                    )
                    .map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.schemeName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fund Source</Label>
              <Input
                placeholder="Auto-filled by scheme..."
                value={fundSource}
                onChange={(e) => setFundSource(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                className={
                  errorFields.includes("workTypeId") ? "text-red-500" : ""
                }
              >
                Work Type {errorFields.includes("workTypeId") && "*"}
              </Label>
              <Select
                onValueChange={(val) => {
                  setSelectedWorkTypeId(val);
                  removeError("workTypeId");
                }}
                value={selectedWorkTypeId}
              >
                <SelectTrigger
                  className={cn(
                    "w-full overflow-hidden",
                    errorFields.includes("workTypeId") ? "border-red-500" : "",
                  )}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {workTypes.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.workTypeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                className={
                  errorFields.includes("workSubtypeId") ? "text-red-500" : ""
                }
              >
                Work Subtype {errorFields.includes("workSubtypeId") && "*"}
              </Label>
              <Select
                onValueChange={(val) => {
                  setSelectedWorkSubtypeId(val);
                  removeError("workSubtypeId");
                }}
                value={selectedWorkSubtypeId}
                disabled={!selectedWorkTypeId}
              >
                <SelectTrigger
                  className={cn(
                    "w-full overflow-hidden",
                    errorFields.includes("workSubtypeId")
                      ? "border-red-500"
                      : "",
                  )}
                >
                  <SelectValue placeholder="Select subtype" />
                </SelectTrigger>
                <SelectContent>
                  {(subtypesData || []).map((s: any) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.workSubtypeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="mb-2">Tender Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal truncate",
                      !tenderDate && "text-muted-foreground",
                    )}
                  >
                    <Calendar size={14} className="mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {tenderDate
                        ? format(tenderDate, "dd MMM yyyy")
                        : "Pick date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={tenderDate}
                    onSelect={setTenderDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label
                className={
                  errorFields.includes("projectStatusId") ? "text-red-500" : ""
                }
              >
                Project Status {errorFields.includes("projectStatusId") && "*"}
              </Label>
              <Select
                onValueChange={(val) => {
                  setSelectedStatusId(val);
                  removeError("projectStatusId");
                }}
                value={selectedStatusId}
              >
                <SelectTrigger
                  className={cn(
                    "w-full overflow-hidden",
                    errorFields.includes("projectStatusId")
                      ? "border-red-500"
                      : "",
                  )}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {projectStatuses.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.statusName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label
                className={
                  errorFields.includes("workLocation") ? "text-red-500" : ""
                }
              >
                Work Location {errorFields.includes("workLocation") && "*"}
              </Label>
              <Input
                placeholder="Enter specific location..."
                value={workLocation}
                onChange={(e) => {
                  setWorkLocation(e.target.value);
                  removeError("workLocation");
                }}
                className={
                  errorFields.includes("workLocation") ? "border-red-500" : ""
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isSubmittingProject}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 w-32"
              onClick={handleCreateProject}
              disabled={isSubmittingProject}
            >
              {isSubmittingProject ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsPageContent />
    </Suspense>
  );
}
