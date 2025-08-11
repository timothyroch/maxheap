import pytest
from typing import List

import maxheap as heapq


def test_push_pop_sorted_desc():
    data = [3, 1, 6, 5, 2, 4]
    h: List[int] = []
    for x in data:
        heapq.heappush(h, x)
    out = [heapq.heappop(h) for _ in range(len(h))]
    assert out == sorted(data, reverse=True)


def test_heapify_then_pop():
    data = [3, 1, 6, 5, 2, 4]
    heapq.heapify(data)
    assert heapq.is_heap(data)
    assert heapq.heappop(data) == 6
    assert heapq.heappop(data) == 5


def test_heappushpop_semantics():
    h = []
    for x in [10, 8, 7]:
        heapq.heappush(h, x)
    result = heapq.heappushpop(h, 9)
    assert result == 10
    assert heapq.peek(h) == 9


def test_heapreplace_semantics():
    h = [9, 5, 7]
    heapq.heapify(h)
    popped = heapq.heapreplace(h, 1)
    assert popped == 9
    assert heapq.peek(h) == 7


def test_peek_and_errors():
    h: List[int] = []
    with pytest.raises(IndexError):
        heapq.heappop(h)
    with pytest.raises(IndexError):
        heapq.peek(h)


def test_class_wrapper():
    from maxheap import MaxHeap

    h = MaxHeap([3, 1, 6, 5, 2, 4])
    assert len(h) == 6
    h.push(10)
    assert h.peek() == 10
    assert h.pop() == 10
    assert heapq.is_heap(h.heap())