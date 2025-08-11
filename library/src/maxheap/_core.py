from __future__ import annotations

from typing import List, Protocol, TypeVar, Generic, Iterable, Optional

class _Comparable(Protocol):
    def __lt__(self, other: "_Comparable", /) -> bool: ...
    def __le__(self, other: "_Comparable", /) -> bool: ...
    def __gt__(self, other: "_Comparable", /) -> bool: ...

T = TypeVar("T", bound=_Comparable)

__all__ = [
    "heapify",
    "heappush",
    "heappop",
    "heappushpop",
    "heapreplace",
    "peek",
    "is_heap",
    "MaxHeap",
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


def heappushpop(heap: List[T], item: T) -> T:
    """Push *item* on the heap, then pop and return the largest item. O(log n).

    More efficient than calling heappush() followed by heappop().
    Semantics mirror heapq.heappushpop but for a max-heap.
    """
    if heap and item < heap[0]:
        top_item = heap[0]
        heap[0] = item
        _siftdown(heap, 0)
        return top_item
    return item


def heapreplace(heap: List[T], item: T) -> T:
    """Pop and return the largest item, and then push *item*. O(log n).

    The heap must be non-empty. Semantics mirror heapq.heapreplace but for a max-heap.
    """
    if not heap:
        raise IndexError("heapreplace on empty heap")
    top_item = heap[0]
    heap[0] = item
    _siftdown(heap, 0)
    return top_item


def peek(heap: List[T]) -> T:
    """Return the largest element without removing it. O(1)."""
    if not heap:
        raise IndexError("peek from empty heap")
    return heap[0]


def is_heap(x: List[T]) -> bool:
    """Return True if *x* satisfies the max-heap property (for debugging)."""
    n = len(x)
    for i in range(n // 2):
        left = 2 * i + 1
        right = left + 1
        if left < n and x[i] < x[left]:
            return False
        if right < n and x[i] < x[right]:
            return False
    return True


# ------------------ OO convenience wrapper ------------------ #


class MaxHeap(Generic[T]):
    """A tiny OO wrapper around the functional API.

    Example:
        >>> h = MaxHeap([3, 1, 6])
        >>> h.push(5)
        >>> h.pop()
        6
    """

    __slots__ = ("_h",)

    def __init__(self, iterable: Optional[Iterable[T]] = None) -> None:
        self._h: List[T] = list(iterable) if iterable is not None else []
        heapify(self._h)

    def push(self, item: T) -> None:
        heappush(self._h, item)

    # synonyms matching functional names
    def heappush(self, item: T) -> None:
        self.push(item)

    def pop(self) -> T:
        return heappop(self._h)

    def heappop(self) -> T:
        return self.pop()

    def peek(self) -> T:
        return peek(self._h)

    def replace(self, item: T) -> T:
        return heapreplace(self._h, item)

    def pushpop(self, item: T) -> T:
        return heappushpop(self._h, item)

    def heap(self) -> List[T]:
        """Return the underlying list (mutations affect the heap)."""
        return self._h

    def __len__(self) -> int:  # pragma: no cover - trivial
        return len(self._h)

    def __bool__(self) -> bool:  # pragma: no cover - trivial
        return bool(self._h)

    def __repr__(self) -> str:  # pragma: no cover - trivial
        return f"MaxHeap({self._h!r})"