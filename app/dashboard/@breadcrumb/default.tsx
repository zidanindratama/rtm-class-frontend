import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
export default function DashboardBreadcrumbDefault() {
  return (
    <Breadcrumb> 
      <BreadcrumbList> 
        <BreadcrumbItem> 
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink> 
        </BreadcrumbItem> 
        <BreadcrumbSeparator /> 
        <BreadcrumbItem> 
          <BreadcrumbPage>Overview</BreadcrumbPage> 
        </BreadcrumbItem> 
      </BreadcrumbList>
    </Breadcrumb>
  );
}
