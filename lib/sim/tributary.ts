/**
 * Pure helpers for the Tributary demo. They mirror the real project:
 * producers allocate messages to partitions manually or at random, consumer
 * groups rebalance with Range or RoundRobin, and partitions are logs with
 * offsets, so consumers can replay.
 */

export type Allocation = "Manual" | "Random";
export type Strategy = "Range" | "RoundRobin";

export interface Message {
  id: number;
  /** Offset within its partition. */
  offset: number;
  label: string;
}

/** Range: contiguous blocks, earlier consumers take the remainder. Matches ConsumerGroup.rangeRebalance. */
function range(consumers: number, partitions: number): number[][] {
  const out: number[][] = Array.from({ length: consumers }, () => []);
  const per = Math.floor(partitions / consumers);
  const extra = partitions % consumers;
  let p = 0;
  for (let c = 0; c < consumers; c++) {
    const count = per + (c < extra ? 1 : 0);
    for (let j = 0; j < count; j++) out[c]!.push(p++);
  }
  return out;
}

/** RoundRobin: deal partitions out one at a time. Matches ConsumerGroup.roundRobinRebalance. */
function roundRobin(consumers: number, partitions: number): number[][] {
  const out: number[][] = Array.from({ length: consumers }, () => []);
  for (let p = 0; p < partitions; p++) out[p % consumers]!.push(p);
  return out;
}

export function assignPartitions(
  strategy: Strategy,
  consumers: number,
  partitions: number,
): number[][] {
  if (consumers <= 0) return [];
  return strategy === "Range" ? range(consumers, partitions) : roundRobin(consumers, partitions);
}

export function choosePartition(
  allocation: Allocation,
  manual: number,
  partitions: number,
  rand: () => number,
): number {
  return allocation === "Manual" ? manual : Math.floor(rand() * partitions);
}

/** Appends to a partition log. Nothing is removed when read. */
export function append(
  logs: Message[][],
  partition: number,
  id: number,
  label: string,
): Message[][] {
  return logs.map((log, p) =>
    p === partition ? [...log, { id, offset: log.length, label }] : log,
  );
}

/** Each partition's reader advances by one if there is something unread. */
export function consumeTick(
  logs: Message[][],
  offsets: number[],
): { offsets: number[]; read: { partition: number; message: Message }[] } {
  const read: { partition: number; message: Message }[] = [];
  const next = offsets.map((o, p) => {
    const m = logs[p]?.[o];
    if (!m) return o;
    read.push({ partition: p, message: m });
    return o + 1;
  });
  return { offsets: next, read };
}

/** Offsets in a partition are strictly increasing, which is the ordering guarantee. */
export function offsetsInOrder(log: Message[]): boolean {
  return log.every((m, i) => m.offset === i);
}
