import type { Metadata } from "next";
import { WorkCollection } from "@/components/projects/WorkCollection";
import { PageIntro } from "@/components/ui/PageIntro";
import { contextLabels, featuredProjects, workbenchProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Network resilience, fuzzing, honest AI data pipelines, crop segmentation benchmarks, event streaming and more.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <PageIntro eyebrow="Things I've built" title="Each project starts with a question.">
        The featured ones have a small interactive model of the problem, then the real system behind
        it: what I built, how it fits together, what can fail and what I learned.
      </PageIntro>
      <WorkCollection
        featured={featuredProjects}
        workbench={workbenchProjects}
        contextLabels={contextLabels}
      />
    </>
  );
}
