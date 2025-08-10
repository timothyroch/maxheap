from __future__ import annotations

from typing import List, Protocol, TypeVar

class _Comparable(Protocol):
    def __lt__(self, other: "_Comparable", /) -> bool: ...
    def __le__(self, other: "_Comparable", /) -> bool: ...
    def __gt__(self, other: "_Comparable", /) -> bool: ...

T = TypeVar("T", bound=_Comparable)

__all__ = [
    "heapify",
    "heappush",
    "heappop",
]


# ------------------ Internal helpers ------------------ #


def _siftup(heap: List[T], pos: int) -> None:
    """Move the item at *pos* up until the max-heap property holds.

    Args:
        heap: Target list used as a heap.
        pos: Index of the item to move up.
    """
    item = heap[pos]
    while pos > 0:
        parent = (pos - 1) // 2
        if item <= heap[parent]:
            break
        heap[pos] = heap[parent]
        pos = parent
    heap[pos] = item


def _siftdown(heap: List[T], pos: int) -> None:
    """Move the item at *pos* down until the max-heap property holds.

    Args:
        heap: Target list used as a heap.
        pos: Index of the item to move down.
    """
    end = len(heap)
    item = heap[pos]
    child = 2 * pos + 1  # left child
    while child < end:
        right = child + 1
        # pick the larger child
        if right < end and heap[right] > heap[child]:
            child = right
        if heap[child] <= item:
            break
        heap[pos] = heap[child]
        pos = child
        child = 2 * pos + 1
    heap[pos] = item


# ------------------ Public functional API ------------------ #


def heapify(x: List[T]) -> None:
    """Transform *x* into a max-heap, in-place, in O(n).

    This mirrors ``heapq.heapify`` but for a max-heap.
    """
    n = len(x)
    # start at last parent and sift down
    for i in range((n // 2) - 1, -1, -1):
        _siftdown(x, i)


def heappush(heap: List[T], item: T) -> None:
    """Push *item* onto *heap*, maintaining the max-heap invariant. O(log n)."""
    heap.append(item)
    _siftup(heap, len(heap) - 1)


def heappop(heap: List[T]) -> T:
    """Pop and return the largest item from the heap. O(log n).

    Raises:
        IndexError: If the heap is empty.
    """
    if not heap:
        raise IndexError("heappop from empty heap")
    last_item = heap.pop()
    if not heap:
        return last_item
    top_item = heap[0]
    heap[0] = last_item
    _siftdown(heap, 0)
    return top_item