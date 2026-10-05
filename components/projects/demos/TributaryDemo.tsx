"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { mulberry32 } from "@/lib/sim/fuzzer";
import {
  append,
  assignPartitions,
  choosePartition,
  consumeTick,
  type Allocation,
  type Message,
  type Strategy,
} from "@/lib/sim/tributary";
import { DemoButton, DemoFrame } from "./DemoFrame";

const PARTITIONS = 3;
const COLORS = ["var(--mustard)", "var(--sky)", "var(--teal-soft)"];

function Toggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <span className="text-ink-soft mr-1 font-mono text-[0.7rem] tracking-wider uppercase">
        {label}
      </span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={`rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold ${value === o ? "border-line bg-ink text-paper" : "border-line/30 bg-paper"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function TributaryDemo() {
  const [logs, setLogs] = useState<Message[][]>(() => Array.from({ length: PARTITIONS }, () => []));
  const [offsets, setOffsets] = useState<number[]>(() => Array(PARTITIONS).fill(0));
  const [consumers, setConsumers] = useState(2);
  const [strategy, setStrategy] = useState<Strategy>("Range");
  const [allocation, setAllocation] = useState<Allocation>("Random");
  const [manualTarget, setManualTarget] = useState(0);
  const [handled, setHandled] = useState<number[]>([0, 0, 0]);
  const [lastEvent, setLastEvent] = useState("Send a burst to start.");
  const nextId = useRef(1);
  const rand = useRef(mulberry32(42));

  const assignment = assignPartitions(strategy, consumers, PARTITIONS);
  const ownerOf = (p: number) => assignment.findIndex((ps) => ps.includes(p));
  const unread = logs.some((log, p) => offsets[p]! < log.length);

  useEffect(() => {
    if (!unread) return;
    const t = setTimeout(() => {
      const { offsets: next, read } = consumeTick(logs, offsets);
      setOffsets(next);
      const owners = assignPartitions(strategy, consumers, PARTITIONS);
      setHandled((h) => {
        const copy = [...h];
        for (const r of read) copy[owners.findIndex((ps) => ps.includes(r.partition))]! += 1;
        return copy;
      });
    }, 900);
    return () => clearTimeout(t);
  }, [logs, offsets, unread, strategy, consumers]);

  function sendBurst() {
    let next = logs;
    for (let i = 0; i < 5; i++) {
      const p = choosePartition(allocation, manualTarget, PARTITIONS, rand.current);
      const id = nextId.current++;
      next = append(next, p, id, `m${id}`);
    }
    setLogs(next);
    setLastEvent(
      allocation === "Manual"
        ? `5 messages sent to P${manualTarget}.`
        : "5 messages allocated at random.",
    );
  }

  function replay() {
    setOffsets(Array(PARTITIONS).fill(0));
    setLastEvent("Offsets reset to 0. Every message will be read again. Nothing was deleted.");
  }

  return (
    <DemoFrame
      title="Interactive model · partitions and consumer groups"
      caption="Messages stay in each partition with an offset. Consumers in a group split the partitions using the chosen rebalancing strategy."
      controls={
        <>
          <DemoButton tone="primary" onClick={sendBurst}>
            Send burst
          </DemoButton>
          <DemoButton onClick={replay} disabled={logs.every((l) => l.length === 0)}>
            Replay from 0
          </DemoButton>
        </>
      }
      aside={
        <div className="space-y-4 text-sm">
          <Toggle
            label="Producer"
            value={allocation}
            options={["Random", "Manual"] as Allocation[]}
            onChange={setAllocation}
          />
          {allocation === "Manual" && (
            <Toggle
              label="Target"
              value={`P${manualTarget}`}
              options={["P0", "P1", "P2"]}
              onChange={(v) => setManualTarget(Number(v.slice(1)))}
            />
          )}
          <Toggle
            label="Rebalance"
            value={strategy}
            options={["Range", "RoundRobin"] as Strategy[]}
            onChange={(s) => {
              setStrategy(s);
              setLastEvent(`Rebalanced with ${s}.`);
            }}
          />
          <div className="flex gap-2">
            <DemoButton
              onClick={() => setConsumers((c) => Math.min(3, c + 1))}
              disabled={consumers >= 3}
            >
              Add consumer
            </DemoButton>
            <DemoButton
              onClick={() => setConsumers((c) => Math.max(1, c - 1))}
              disabled={consumers <= 1}
            >
              Remove
            </DemoButton>
          </div>
          <ul className="space-y-2" aria-label="Consumer group">
            {assignment.map((ps, c) => (
              <li key={c} className="border-line bg-paper rounded-xl border-2 p-3">
                <p className="font-semibold">
                  consumer-{c + 1}{" "}
                  <span className="text-ink-soft font-normal">
                    {ps.length ? `owns P${ps.join(", P")}` : "owns nothing"}
                  </span>
                </p>
                <p className="text-ink-soft mt-1 font-mono text-xs">read {handled[c] ?? 0}</p>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <p aria-live="polite" className="mb-3 min-h-6 text-[0.95rem] font-medium">
        {lastEvent}
      </p>
      <div className="space-y-3">
        {logs.map((log, p) => (
          <div key={p} className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
            <p className="font-mono text-sm font-semibold">
              P{p}
              <span className="text-ink-soft block text-[0.65rem] font-normal">
                → c{ownerOf(p) + 1}
              </span>
              <span className="sr-only">
                , {log.length} messages, read up to offset {offsets[p]}
              </span>
            </p>
            <ol
              className="border-line/30 bg-paper flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border-2 border-dashed px-2 py-1.5"
              aria-label={`Partition ${p} log`}
            >
              <AnimatePresence initial={false}>
                {log.slice(-12).map((m) => {
                  const read = m.offset < offsets[p]!;
                  return (
                    <motion.li
                      key={m.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: read ? 0.45 : 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-line rounded-md border-2 px-1.5 py-0.5 font-mono text-[0.7rem] font-semibold whitespace-nowrap"
                      style={{ background: COLORS[p] }}
                    >
                      {m.offset}:{m.label}
                      {read && <span aria-label=" read"> ✓</span>}
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ol>
          </div>
        ))}
      </div>
      <p className="text-ink-soft mt-4 text-xs">
        Chips read <span className="font-mono">offset:message</span>. Faded with ✓ means read. Order
        within a partition is the offset order.
      </p>
    </DemoFrame>
  );
}
