try:
    from ._cmaxheap import heapify, heappush, heappop, heappushpop, heapreplace  # type: ignore
    _HAVE_CEXT = True
except Exception: 
    from ._core import heapify, heappush, heappop, heappushpop, heapreplace
    _HAVE_CEXT = False

# The rest are trivial / not worth accelerating
from ._core import peek, is_heap, MaxHeap

__all__ = ["heapify", "heappush", "heappop", "heappushpop", "heapreplace", "peek", "is_heap", "MaxHeap"]

__version__ = "0.1.0"
