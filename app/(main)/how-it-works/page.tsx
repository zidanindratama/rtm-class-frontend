import { HeroHowItWorks } from "@/components/main/how-it-works/hero-how-it-works";
import { WorkflowPipelineMap } from "@/components/main/how-it-works/workflow-pipeline-map";
import { WorkflowOperatingLanes } from "@/components/main/how-it-works/workflow-operating-lanes";
import { WorkflowServiceLevels } from "@/components/main/how-it-works/workflow-service-levels";
import { WorkflowFaq } from "@/components/main/how-it-works/workflow-faq";
import { WorkflowCta } from "@/components/main/how-it-works/workflow-cta";

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <HeroHowItWorks />
      <WorkflowPipelineMap />
      <WorkflowOperatingLanes />
      <WorkflowServiceLevels />
      <WorkflowFaq />
      <WorkflowCta />
    </div>
  );
}
