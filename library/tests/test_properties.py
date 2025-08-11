import random
from typing import List
import maxheap as heapq
import hypothesis as hp
import hypothesis.strategies as st


hp.settings.register_profile(
    "ci",
    max_examples=200,  # Fewer examples for faster CI runs
    deadline=500,      # ms per test case
    suppress_health_check=[hp.HealthCheck.too_slow],
)
hp.settings.load_profile("ci")


@hp.given(st.lists(st.integers(), max_size=200))
def test_heapify_pop_matches_sort_desc(xs: List[int]):
    h = list(xs)
    heapq.heapify(h)
    out = [heapq.heappop(h) for _ in range(len(h))]
    assert out == sorted(xs, reverse=True)


@hp.given(st.lists(st.integers(), max_size=100), st.integers())
def test_heappushpop_matches_push_then_pop(xs: List[int], item: int):
    h1 = list(xs)
    heapq.heapify(h1)
    h2 = list(h1)

    # baseline: push then pop
    heapq.heappush(h2, item)
    baseline = heapq.heappop(h2)

    # heappushpop result must match baseline, and resulting heap equal
    result = heapq.heappushpop(h1, item)
    assert result == baseline
    assert sorted([heapq.heappop(h1) for _ in range(len(h1))], reverse=True) == \
           sorted([heapq.heappop(h2) for _ in range(len(h2))], reverse=True)
