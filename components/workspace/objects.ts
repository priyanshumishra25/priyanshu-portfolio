import type { ComponentType } from "react";
import {
  BrokenChip,
  Coffee,
  ContactCards,
  Laptop,
  Notebook,
  ResearchFolder,
  ResumeSheet,
} from "@/components/illustrations/DeskArt";
import { Pai } from "@/components/illustrations/Pai";

export type ObjectAction =
  { type: "link"; href: string } | { type: "assistant" } | { type: "contact" } | { type: "coffee" };

export interface WorkspaceObject {
  id: string;
  label: string;
  /** Plain description used for screen readers and the mobile list. */
  description: string;
  action: ObjectAction;
  Art: ComponentType<{ className?: string }>;
  /** Position inside the 16:10 desk scene, in percent. */
  pos: { left: number; top: number; width: number };
}

export const workspaceObjects: WorkspaceObject[] = [
  {
    id: "laptop",
    label: "Things I've Built",
    description: "Projects, starting with the ArmsOA network resilience platform.",
    action: { type: "link", href: "/work" },
    Art: Laptop,
    pos: { left: 27, top: 18, width: 32 },
  },
  {
    id: "pai",
    label: "Ask About Me",
    description: "PAI, an assistant that only answers from this site and shows its sources.",
    action: { type: "assistant" },
    Art: Pai,
    pos: { left: 61.5, top: 21, width: 8 },
  },
  {
    id: "folder",
    label: "Things I've Investigated",
    description: "UNSW research on detecting silent DNS security downgrades.",
    action: { type: "link", href: "/research" },
    Art: ResearchFolder,
    pos: { left: 74, top: 13, width: 21 },
  },
  {
    id: "coffee",
    label: "Coffee",
    description: "A mug of coffee. Mostly harmless.",
    action: { type: "coffee" },
    Art: Coffee,
    pos: { left: 18, top: 40, width: 8.5 },
  },
  {
    id: "notebook",
    label: "Engineering Decisions",
    description: "Six short write-ups on trade-offs and why I made them.",
    action: { type: "link", href: "/decisions" },
    Art: Notebook,
    pos: { left: 62, top: 42, width: 18 },
  },
  {
    id: "chip",
    label: "Things I've Broken",
    description: "Systems work and debugging, mainly the Midpoint Fuzzer.",
    action: { type: "link", href: "/work/midpoint-fuzzer" },
    Art: BrokenChip,
    pos: { left: 5, top: 61, width: 17 },
  },
  {
    id: "resume",
    label: "The Boring Version™",
    description: "A plain, printable resume.",
    action: { type: "link", href: "/resume" },
    Art: ResumeSheet,
    pos: { left: 36, top: 57, width: 14 },
  },
  {
    id: "contact",
    label: "Say Hello",
    description: "Email, LinkedIn and GitHub.",
    action: { type: "contact" },
    Art: ContactCards,
    pos: { left: 79, top: 62, width: 16 },
  },
];
