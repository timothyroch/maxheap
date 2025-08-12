from __future__ import annotations
import argparse, gc, statistics, time, platform
from typing import List, Callable, Dict, Any

# Benchmarks for max-heap vs min-heap (using negation)
import maxheap as maxh
import heapq as minh  # stdlib min-heap, we’ll use negation to simulate max

def _time_many(fn: Callable[[], None], repeat: int) -> list[float]:
    ts = []
    for _ in range(repeat):
        gc.collect()
        gc.disable()
        t0 = time.perf_counter()
        fn()
        t1 = time.perf_counter()
        gc.enable()
        ts.append(t1 - t0)
    return ts

def _agg(ts: list[float]) -> dict[str, float]:
    return {"min": min(ts), "median": statistics.median(ts), "mean": statistics.fmean(ts)}

def bench_heappush_maxheap(xs: List[int], repeat: int) -> dict[str, float]:
    def run():
        h: List[int] = []
        for x in xs:
            maxh.heappush(h, x)
    return _agg(_time_many(run, repeat))

def bench_heappush_min_neg(xs: List[int], repeat: int) -> dict[str, float]:
    def run():
        h: List[int] = []
        for x in xs:
            minh.heappush(h, -x)
    return _agg(_time_many(run, repeat))

def bench_heapify_maxheap(xs: List[int], repeat: int) -> dict[str, float]:
    def run():
        h = list(xs)
        maxh.heapify(h)
    return _agg(_time_many(run, repeat))

def bench_heapify_min_neg(xs: List[int], repeat: int) -> dict[str, float]:
    def run():
        h = [-x for x in xs]
        minh.heapify(h)
    return _agg(_time_many(run, repeat))

def bench_drain_after_heapify_maxheap(xs: List[int], repeat: int) -> dict[str, float]:
    def run():
        h = list(xs)
        maxh.heapify(h)
        for _ in range(len(h)):
            maxh.heappop(h)
    return _agg(_time_many(run, repeat))

def bench_drain_after_heapify_min_neg(xs: List[int], repeat: int) -> dict[str, float]:
    def run():
        h = [-x for x in xs]
        minh.heapify(h)
        for _ in range(len(h)):
            minh.heappop(h)
    return _agg(_time_many(run, repeat))

def bench_heappushpop_maxheap(xs: List[int], repeat: int) -> dict[str, float]:
    def run():
        h: List[int] = []
        for x in xs:
            maxh.heappush(h, x)
        for x in xs:
            maxh.heappushpop(h, x)
    return _agg(_time_many(run, repeat))

def bench_heapreplace_maxheap(xs: List[int], repeat: int) -> dict[str, float]:
    def run():
        h: List[int] = []
        for x in xs:
            maxh.heappush(h, x)
        for x in xs:
            maxh.heapreplace(h, x)
    return _agg(_time_many(run, repeat))

def _pct(better: float, baseline: float) -> float:
    # positive means faster than baseline
    return (baseline - better) / baseline * 100.0

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=10_000)
    ap.add_argument("--repeat", type=int, default=5)
    ap.add_argument("--warmup", type=int, default=1)
    ap.add_argument("--seed", type=int, default=1337)
    ap.add_argument("--csv", type=str, default="", help="optional output CSV path")
    args = ap.parse_args()

    import random
    random.seed(args.seed)
    xs = [random.randint(0, 10**6) for _ in range(args.n)]

    # Warmup
    for _ in range(args.warmup):
        h: List[int] = []
        for x in xs[:1000]:
            maxh.heappush(h, x)
        maxh.heapify(list(xs))

    rows: list[dict[str, Any]] = []

    def record(name: str, res: dict[str, float], baseline: dict[str, float] | None = None):
        pct_med = _pct(res["median"], baseline["median"]) if baseline else None
        print(
            f"{name:<28} min {res['min']:.6f}s  median {res['median']:.6f}s  mean {res['mean']:.6f}s"
            + ("" if pct_med is None else f"   vs baseline: {pct_med:+.1f}%")
        )
        row = {"name": name, "min": res["min"], "median": res["median"], "mean": res["mean"]}
        if baseline:
            row["vs_baseline_%"] = pct_med
        rows.append(row)

    print(f"Python {platform.python_version()} on {platform.system()} {platform.machine()}")
    print(f"N={args.n}, repeat={args.repeat}, warmup={args.warmup}, seed={args.seed}\n")

    hp_max = bench_heappush_maxheap(xs, args.repeat)
    hp_min = bench_heappush_min_neg(xs, args.repeat)
    record("heappush (maxheap)", hp_max, baseline=hp_min)
    record("heappush (min+neg)", hp_min)

    hf_max = bench_heapify_maxheap(xs, args.repeat)
    hf_min = bench_heapify_min_neg(xs, args.repeat)
    record("heapify (maxheap)", hf_max, baseline=hf_min)
    record("heapify (min+neg)", hf_min)

    dr_max = bench_drain_after_heapify_maxheap(xs, args.repeat)
    dr_min = bench_drain_after_heapify_min_neg(xs, args.repeat)
    record("heapify+drain (maxheap)", dr_max, baseline=dr_min)
    record("heapify+drain (min+neg)", dr_min)

    pp_max = bench_heappushpop_maxheap(xs, args.repeat)
    record("heappushpop (maxheap)", pp_max)

    rp_max = bench_heapreplace_maxheap(xs, args.repeat)
    record("heapreplace (maxheap)", rp_max)

    if args.csv:
        import csv
        with open(args.csv, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=rows[0].keys())
            w.writeheader()
            w.writerows(rows)
        print(f"\nWrote {args.csv}")

if __name__ == "__main__":
    main()
