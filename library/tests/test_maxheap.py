from typing import List

import maxheap as heapq


def test_push_pop_sorted_desc():
    data = [3, 1, 6, 5, 2, 4]
    h: List[int] = []
    for x in data:
        heapq.heappush(h, x)
    out = [heapq.heappop(h) for _ in range(len(h))]
    assert out == sorted(data, reverse=True)