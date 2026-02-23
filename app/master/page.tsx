"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import StateCard from "@/components/master/state-card";
import DistrictCard from "@/components/master/district-card";
import BlockCard from "@/components/master/BlockCard";
import CityVillageCard from "@/components/master/city-village-card";
import PanchayatCard from "@/components/master/panchayat-card";
import SchemesCard from "@/components/master/schemes-card";
import DepartmentCard from "@/components/master/department-card";
import WorkCategoryCard from "@/components/master/work-category-card";
import WorkSubCategoryCard from "@/components/master/work-sub-category-card";
import ProjectStatusCard from "@/components/master/project-status-card";
import AddUserCard from "@/components/master/add-user-card";

export default function MasterPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <StateCard />
        <DistrictCard />
        <BlockCard />
        <CityVillageCard />
        <PanchayatCard />
        <DepartmentCard />
        <WorkCategoryCard />
        <WorkSubCategoryCard />
        <ProjectStatusCard />
        <div className="xl:col-span-2">
          <SchemesCard />
        </div>
        <div className="xl:col-span-2">
          <AddUserCard />
        </div>
      </div>
    </DashboardLayout>
  );
}
