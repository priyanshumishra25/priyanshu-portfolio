/**
 * Toy topology for the ArmsOA demo. Illustrative only, not client data.
 * It mirrors two real design rules: physical failure and temporary
 * restoration are tracked separately, and recovery needs human approval.
 */

export type LinkKind = "4G/5G" | "Microwave" | "SATCOM" | "UHF/VHF";

export interface NetNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface NetLink {
  id: string;
  a: string;
  b: string;
  kind: LinkKind;
}

export const nodes: NetNode[] = [
  { id: "hq", label: "HQ", x: 90, y: 170 },
  { id: "ridge", label: "Ridge relay", x: 250, y: 80 },
  { id: "tower", label: "Cell tower", x: 250, y: 260 },
  { id: "alpha", label: "Site Alpha", x: 430, y: 60 },
  { id: "bravo", label: "Site Bravo", x: 420, y: 175 },
  { id: "charlie", label: "Site Charlie", x: 430, y: 290 },
  { id: "delta", label: "Site Delta", x: 570, y: 180 },
  { id: "sat", label: "SATCOM", x: 130, y: 10 },
];

export const links: NetLink[] = [
  { id: "hq-ridge", a: "hq", b: "ridge", kind: "Microwave" },
  { id: "hq-tower", a: "hq", b: "tower", kind: "4G/5G" },
  { id: "ridge-alpha", a: "ridge", b: "alpha", kind: "Microwave" },
  { id: "ridge-bravo", a: "ridge", b: "bravo", kind: "UHF/VHF" },
  { id: "tower-bravo", a: "tower", b: "bravo", kind: "4G/5G" },
  { id: "tower-charlie", a: "tower", b: "charlie", kind: "4G/5G" },
  { id: "charlie-delta", a: "charlie", b: "delta", kind: "UHF/VHF" },
  { id: "alpha-delta", a: "alpha", b: "delta", kind: "Microwave" },
];

/** Links taken out by the simulated storm. */
export const failureSet = ["ridge-alpha", "charlie-delta", "tower-bravo"];

export const recoveryLinks: NetLink[] = [
  { id: "tmp-hq-sat", a: "hq", b: "sat", kind: "SATCOM" },
  { id: "tmp-sat-alpha", a: "sat", b: "alpha", kind: "SATCOM" },
];

export const recommendation = {
  action: "Bring up a temporary SATCOM relay from HQ to Site Alpha.",
  rationale:
    "Alpha and Delta are cut off. Alpha still reaches Delta over microwave, so one relay to Alpha reconnects both.",
  confidence: 0.82,
};

export type Phase = "nominal" | "failed" | "proposed" | "recovered" | "rejected";

export interface NetworkState {
  phase: Phase;
  /** Physical truth. Never cleared by recovery. */
  failed: string[];
  /** Temporary restored paths, tracked separately. */
  temporary: NetLink[];
}

export type NetworkAction =
  | { type: "fail" }
  | { type: "propose" }
  | { type: "approve" }
  | { type: "reject" }
  | { type: "reset" };

export const initialNetwork: NetworkState = { phase: "nominal", failed: [], temporary: [] };

export function networkReducer(state: NetworkState, action: NetworkAction): NetworkState {
  switch (action.type) {
    case "fail":
      return state.phase === "nominal"
        ? { ...state, phase: "failed", failed: [...failureSet] }
        : state;
    case "propose":
      return state.phase === "failed" || state.phase === "rejected"
        ? { ...state, phase: "proposed" }
        : state;
    case "approve":
      // Recovery adds temporary links. It does not touch `failed`.
      return state.phase === "proposed"
        ? { ...state, phase: "recovered", temporary: [...recoveryLinks] }
        : state;
    case "reject":
      return state.phase === "proposed" ? { ...state, phase: "rejected" } : state;
    case "reset":
      return initialNetwork;
  }
}

/** Nodes (excluding the standby satellite) that cannot reach HQ. */
export function isolatedNodes(state: NetworkState): string[] {
  const active = [...links.filter((l) => !state.failed.includes(l.id)), ...state.temporary];
  const adj = new Map<string, string[]>();
  for (const l of active) {
    adj.set(l.a, [...(adj.get(l.a) ?? []), l.b]);
    adj.set(l.b, [...(adj.get(l.b) ?? []), l.a]);
  }
  const seen = new Set(["hq"]);
  const queue = ["hq"];
  while (queue.length) {
    const n = queue.shift()!;
    for (const m of adj.get(n) ?? []) {
      if (!seen.has(m)) {
        seen.add(m);
        queue.push(m);
      }
    }
  }
  return nodes.filter((n) => n.id !== "sat" && !seen.has(n.id)).map((n) => n.id);
}

export function nodeLabel(id: string): string {
  return nodes.find((n) => n.id === id)?.label ?? id;
}
