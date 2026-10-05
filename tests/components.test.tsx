import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AssistantProvider, useAssistant } from "@/components/assistant/AssistantProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NetworkDemo } from "@/components/projects/demos/NetworkDemo";
import { FuzzerDemo } from "@/components/projects/demos/FuzzerDemo";
import { QuantDemo } from "@/components/projects/demos/QuantDemo";
import { ProjectSections } from "@/components/projects/ProjectSections";
import { Workspace } from "@/components/workspace/Workspace";
import { MobileWorkspace } from "@/components/workspace/MobileWorkspace";
import { workspaceObjects } from "@/components/workspace/objects";
import { contextLabels, featuredProjects, projects, workbenchProjects } from "@/content/projects";
import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { WorkCollection } from "@/components/projects/WorkCollection";
import { demos } from "@/components/projects/ProjectDemo";
import { WheatDemo } from "@/components/projects/demos/WheatDemo";
import { TributaryDemo } from "@/components/projects/demos/TributaryDemo";

const pathname = vi.hoisted(() => ({ value: "/work" }));
vi.mock("next/navigation", () => ({
  usePathname: () => pathname.value,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

function withAssistant(ui: React.ReactNode) {
  return render(<AssistantProvider>{ui}</AssistantProvider>);
}

beforeEach(() => {
  pathname.value = "/work";
  // Simulate the API being unreachable so the browser-side fallback is exercised.
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
});

describe("navigation", () => {
  it("links to every practical section and marks the current page", () => {
    withAssistant(<SiteHeader />);
    const nav = screen.getAllByRole("navigation", { name: "Main" })[0]!;
    for (const [name, href] of [
      ["Work", "/work"],
      ["Decisions", "/decisions"],
      ["Research", "/research"],
      ["About", "/about"],
      ["Resume", "/resume"],
    ]) {
      expect(within(nav).getByRole("link", { name })).toHaveAttribute("href", href);
    }
    expect(within(nav).getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("button", { name: "Ask AI" })).toBeInTheDocument();
  });

  it("toggles the mobile menu", async () => {
    const user = userEvent.setup();
    withAssistant(<SiteHeader />);
    const toggle = screen.getByRole("button", { name: "Menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
  });
});

describe("workspace", () => {
  it("exposes every desk object with an accessible name", () => {
    withAssistant(<Workspace />);
    for (const o of workspaceObjects) {
      expect(
        screen.getAllByRole(o.action.type === "link" ? "link" : "button", {
          name: new RegExp(o.label),
        }).length,
      ).toBeGreaterThan(0);
    }
  });

  it("routes desk objects to the right pages", () => {
    withAssistant(<Workspace />);
    expect(screen.getAllByRole("link", { name: /Things I've Built/ })[0]).toHaveAttribute(
      "href",
      "/work",
    );
    expect(screen.getAllByRole("link", { name: /Things I've Broken/ })[0]).toHaveAttribute(
      "href",
      "/work/midpoint-fuzzer",
    );
    expect(screen.getAllByRole("link", { name: /Boring Version/ })[0]).toHaveAttribute(
      "href",
      "/resume",
    );
  });

  it("coffee says it is still compiling", async () => {
    const user = userEvent.setup();
    withAssistant(
      <MobileWorkspace onActivate={() => {}} bubble={{ id: "coffee", text: "Still compiling." }} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Still compiling.");
    // And through the real handler:
    const { unmount } = withAssistant(<Workspace />);
    await user.click(screen.getAllByRole("button", { name: /Coffee/ })[0]!);
    expect(screen.getAllByText("Still compiling.").length).toBeGreaterThan(0);
    unmount();
  });

  it("opens PAI from the desk and answers offline with sources", async () => {
    const user = userEvent.setup();
    withAssistant(<Workspace />);
    await user.click(screen.getAllByRole("button", { name: /Ask About Me/ })[0]!);
    const dialog = await screen.findByRole("dialog", { name: "PAI" });
    expect(dialog).toHaveTextContent("I know everything Priyanshu has chosen to put on this site.");

    await user.click(
      within(dialog).getByRole("button", { name: "Does he have systems programming experience?" }),
    );
    expect(await within(dialog).findByText(/Midpoint Fuzzer, a multithreaded/)).toBeInTheDocument();
    expect(
      within(dialog).getByRole("link", { name: /Midpoint Fuzzer \/ Process Isolation/ }),
    ).toHaveAttribute("href", "/work/midpoint-fuzzer#process-isolation");
  });
});

describe("assistant panel", () => {
  function Opener() {
    const { open } = useAssistant();
    return (
      <button type="button" onClick={() => open()}>
        open
      </button>
    );
  }

  it("shows something interesting and closes on Escape", async () => {
    const user = userEvent.setup();
    withAssistant(<Opener />);
    await user.click(screen.getByRole("button", { name: "open" }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Show me something interesting" }));
    expect(
      await within(dialog).findByText("You might like the Midpoint Fuzzer."),
    ).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("answers typed questions honestly when the site has nothing", async () => {
    const user = userEvent.setup();
    withAssistant(<Opener />);
    await user.click(screen.getByRole("button", { name: "open" }));
    const dialog = await screen.findByRole("dialog");
    await user.type(within(dialog).getByLabelText(/Ask PAI/), "Does he know Kubernetes?");
    await user.click(within(dialog).getByRole("button", { name: "Ask" }));
    expect(
      await within(dialog).findByText(/not mentioned anywhere on this site/),
    ).toBeInTheDocument();
  });
});

describe("project pages", () => {
  it.each(featuredProjects.map((p) => [p.slug, p] as const))(
    "%s renders every section and facet anchor",
    (_, project) => {
      const { container } = render(<ProjectSections project={project} />);
      for (const h of [
        "Problem",
        "What I Built / Owned",
        project.architecture.heading ?? "Architecture",
        "Interesting Decisions",
        "Failure Modes",
        "What I Shipped",
        "What I Learned",
      ]) {
        expect(screen.getByRole("heading", { name: new RegExp(h) })).toBeInTheDocument();
      }
      for (const f of project.facets) expect(container.querySelector(`#${f.id}`)).not.toBeNull();
      for (const l of project.architecture.layers)
        expect(screen.getAllByText(l.name, { exact: false }).length).toBeGreaterThan(0);
    },
  );
});

describe("interactive demos", () => {
  it("network demo: failure, recommendation, approval", async () => {
    const user = userEvent.setup();
    render(<NetworkDemo />);
    const recover = screen.getByRole("button", { name: "Attempt Recovery" });
    expect(recover).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Introduce Failure" }));
    expect(screen.getByText(/Site Alpha and Site Delta cut off/)).toBeInTheDocument();

    await user.click(recover);
    expect(screen.getByRole("region", { name: "Agent recommendation" })).toBeInTheDocument();
    expect(screen.getByText(/Nothing changes until an operator approves/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Approve" }));
    expect(
      screen.getByText(/Service restored over a temporary path. 3 physical links are still down/),
    ).toBeInTheDocument();
    expect(screen.getByText("3 links failed")).toBeInTheDocument();
  });

  it("fuzzer demo finds a SIGSEGV (reduced motion shows the result at once)", async () => {
    const user = userEvent.setup();
    render(<FuzzerDemo />);
    await user.click(screen.getByRole("button", { name: "Fuzz It" }));
    const result = await screen.findByText("Crash discovered");
    expect(result.parentElement).toHaveTextContent("SIGSEGV");
    expect(result.parentElement).toHaveTextContent("Duplicate: No");
    await user.click(screen.getByRole("button", { name: "Fuzz Again" }));
    expect(await screen.findByText(/Yes, skipped/)).toBeInTheDocument();
  });

  it("quant demo keeps unavailable data unavailable and validates input", async () => {
    const user = userEvent.setup();
    render(<QuantDemo />);
    await user.click(screen.getByRole("button", { name: "Run" }));
    expect(await screen.findByText(/Unavailable data remains unavailable/)).toBeInTheDocument();
    expect(screen.getByText(/Assembled from 3 of 4 sources/)).toBeInTheDocument();

    await user.clear(screen.getByLabelText("Company"));
    await user.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a company name.");
  });
});

describe("project evidence links", () => {
  it("shows View source only when a repo is configured", () => {
    const fuzzer = projects.find((p) => p.slug === "midpoint-fuzzer")!;
    const { unmount } = render(<ProjectLinks project={fuzzer} />);
    const link = screen.getByRole("link", { name: /View source/ });
    expect(link).toHaveAttribute("href", fuzzer.repoUrl);
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    unmount();
  });

  it("shows the private-source note for ArmsOA and no GitHub button", () => {
    render(<ProjectLinks project={projects.find((p) => p.slug === "armsoa")!} />);
    expect(screen.getByText("Client work · source private")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders nothing, not a broken link, when there is no evidence configured", () => {
    const { container } = render(
      <ProjectLinks project={projects.find((p) => p.slug === "wheat-segmentation")!} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("never renders a '#' href on the Work page", () => {
    const { container } = render(
      <WorkCollection
        featured={featuredProjects}
        workbench={workbenchProjects}
        contextLabels={contextLabels}
      />,
    );
    for (const a of container.querySelectorAll("a")) {
      expect(a.getAttribute("href")).not.toBe("#");
      expect(a.getAttribute("href")).toBeTruthy();
    }
  });
});

describe("work page", () => {
  it("shows featured projects in order, then the workbench with anchors", () => {
    const { container } = render(
      <WorkCollection
        featured={featuredProjects}
        workbench={workbenchProjects}
        contextLabels={contextLabels}
      />,
    );
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings.slice(0, 5)).toEqual(featuredProjects.map((p) => p.question));
    expect(screen.getByRole("heading", { name: "The Rest of the Workbench" })).toBeInTheDocument();
    expect(container.querySelector("#insurance-fraud")).not.toBeNull();
    expect(screen.getByText("Personal project")).toBeInTheDocument();
  });

  it("filters by category without losing the page", async () => {
    const user = userEvent.setup();
    render(
      <WorkCollection
        featured={featuredProjects}
        workbench={workbenchProjects}
        contextLabels={contextLabels}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Computer Vision" }));
    expect(screen.getByRole("button", { name: "Computer Vision" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByText("How much model do you actually need to segment a field?"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Can I make an unknown program crash?")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText("Can I make an unknown program crash?")).toBeInTheDocument();
  });

  it("has a demo for every interactive project", () => {
    for (const p of featuredProjects) expect(Boolean(demos[p.slug]), p.slug).toBe(p.interactive);
  });
});

describe("new demos", () => {
  it("wheat demo switches approach and labels itself illustrative", async () => {
    const user = userEvent.setup();
    render(<WheatDemo />);
    expect(
      screen.getByText(/Illustrative reconstruction of the segmentation workflow/),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "SegFormer" }));
    expect(screen.getByRole("radio", { name: "SegFormer" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByText(/smallest SegFormer variant/)).toBeInTheDocument();
    expect(screen.getByText("0.91 IoU")).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Original" }));
    expect(screen.getByLabelText(/Drag to compare/)).toBeDisabled();
  });

  it("tributary demo rebalances and replays without deleting", async () => {
    const user = userEvent.setup();
    render(<TributaryDemo />);
    expect(screen.getByText("owns P0, P1")).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "RoundRobin" }));
    expect(screen.getByText("owns P0, P2")).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Manual" }));
    await user.click(screen.getByRole("button", { name: "Send burst" }));
    expect(screen.getByText("5 messages sent to P0.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Replay from 0" }));
    expect(screen.getByText(/Nothing was deleted/)).toBeInTheDocument();
  });
});

describe("how PAI works", () => {
  it("is reachable from the assistant panel", async () => {
    const user = userEvent.setup();
    withAssistant(<Workspace />);
    await user.click(screen.getAllByRole("button", { name: /Ask About Me/ })[0]!);
    const dialog = await screen.findByRole("dialog", { name: "PAI" });
    await user.click(within(dialog).getByText("How PAI works"));
    expect(within(dialog).getByText(/never reaches the browser/)).toBeVisible();
    expect(within(dialog).getByText("Citable knowledge")).toBeInTheDocument();
  });
});
