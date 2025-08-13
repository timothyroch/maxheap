#define PY_SSIZE_T_CLEAN
#include <Python.h>

/* ---------- Comparisons ---------- */

static int cmp_le(PyObject *a, PyObject *b, int *out) {
    int r = PyObject_RichCompareBool(a, b, Py_LE);
    if (r < 0) return -1;
    *out = r;
    return 0;
}

static int cmp_gt(PyObject *a, PyObject *b, int *out) {
    int r = PyObject_RichCompareBool(a, b, Py_GT);
    if (r < 0) return -1;
    *out = r;
    return 0;
}

/* ---------- Sift helpers (in-place on list) ---------- */

static int siftup(PyObject *heap, Py_ssize_t pos) {
    if (!PyList_CheckExact(heap)) {
        PyErr_SetString(PyExc_TypeError, "heap must be a list");
        return -1;
    }
    PyObject *h = heap;
    PyObject *item = PyList_GET_ITEM(h, pos);
    Py_INCREF(item);

    while (pos > 0) {
        Py_ssize_t parent = (pos - 1) >> 1;
        PyObject *parent_item = PyList_GET_ITEM(h, parent);

        int gt = PyObject_RichCompareBool(item, parent_item, Py_GT);
        if (gt < 0) {
            Py_DECREF(item);
            return -1;
        }
        if (!gt) break;

        Py_INCREF(parent_item);
        Py_DECREF(PyList_GET_ITEM(h, pos));
        PyList_SET_ITEM(h, pos, parent_item);
        pos = parent;
    }

    Py_DECREF(PyList_GET_ITEM(h, pos));
    PyList_SET_ITEM(h, pos, item);
    return 0;
}

static int siftdown(PyObject *heap, Py_ssize_t pos) {
    if (!PyList_CheckExact(heap)) {
        PyErr_SetString(PyExc_TypeError, "heap must be a list");
        return -1;
    }
    PyObject *h = heap;
    Py_ssize_t end = PyList_GET_SIZE(h);
    PyObject *item = PyList_GET_ITEM(h, pos);
    Py_INCREF(item);

    Py_ssize_t child = (pos << 1) + 1;  // left
    while (child < end) {
        Py_ssize_t right = child + 1;
        Py_ssize_t best = child;
        PyObject *best_item = PyList_GET_ITEM(h, child);

        if (right < end) {
            PyObject *right_item = PyList_GET_ITEM(h, right);
            int right_gt_left;
            if (cmp_gt(right_item, best_item, &right_gt_left) < 0) {
                Py_DECREF(item);
                return -1;
            }
            if (right_gt_left) {
                best = right;
                best_item = right_item;
            }
        }

        int best_le_item;
        if (cmp_le(best_item, item, &best_le_item) < 0) {
            Py_DECREF(item);
            return -1;
        }
        if (best_le_item) break;

        Py_INCREF(best_item);
        Py_DECREF(PyList_GET_ITEM(h, pos));
        PyList_SET_ITEM(h, pos, best_item);

        pos = best;
        child = (pos << 1) + 1;
    }

    Py_DECREF(PyList_GET_ITEM(h, pos));
    PyList_SET_ITEM(h, pos, item);
    return 0;
}

/* ---------- API: heapify, heappush, heappop, heappushpop, heapreplace ---------- */

static PyObject *api_heapify(PyObject *self, PyObject *heap) {
    if (!PyList_CheckExact(heap)) {
        PyErr_SetString(PyExc_TypeError, "heapify(x): x must be a list");
        return NULL;
    }
    Py_ssize_t n = PyList_GET_SIZE(heap);
    for (Py_ssize_t i = (n >> 1) - 1; i >= 0; --i) {
        if (siftdown(heap, i) < 0) return NULL;
        if (i == 0) break;  // avoid wrap of ssize_t
    }
    Py_RETURN_NONE;
}

static PyObject *api_heappush(PyObject *self, PyObject *const *args, Py_ssize_t nargs) {
    if (nargs != 2) { PyErr_SetString(PyExc_TypeError, "heappush(heap, item)"); return NULL; }
    PyObject *heap = args[0], *item = args[1];
    if (!PyList_CheckExact(heap)) {
        PyErr_SetString(PyExc_TypeError, "heappush(heap, item): heap must be a list");
        return NULL;
    }
    if (PyList_Append(heap, item) < 0) return NULL;
    Py_ssize_t pos = PyList_GET_SIZE(heap) - 1;
    if (siftup(heap, pos) < 0) return NULL;
    Py_RETURN_NONE;
}

static PyObject *api_heappop(PyObject *self, PyObject *heap) {
    if (!PyList_CheckExact(heap)) {
        PyErr_SetString(PyExc_TypeError, "heappop(heap): heap must be a list");
        return NULL;
    }
    Py_ssize_t n = PyList_GET_SIZE(heap);
    if (n == 0) {
        PyErr_SetString(PyExc_IndexError, "heappop from empty heap");
        return NULL;
    }
    if (n == 1) {
        PyObject *only = PyList_GET_ITEM(heap, 0);
        Py_INCREF(only);
        if (PySequence_DelItem(heap, 0) < 0) { Py_DECREF(only); return NULL; }
        return only;
    }

    PyObject *top = PyList_GET_ITEM(heap, 0);
    Py_INCREF(top);
    PyObject *last = PyList_GET_ITEM(heap, n - 1);
    Py_INCREF(last);

    if (PySequence_DelItem(heap, n - 1) < 0) { Py_DECREF(top); Py_DECREF(last); return NULL; }

    Py_DECREF(PyList_GET_ITEM(heap, 0));
    PyList_SET_ITEM(heap, 0, last);

    if (siftdown(heap, 0) < 0) { Py_DECREF(top); return NULL; }
    return top;
}

static PyObject *api_heappushpop(PyObject *self, PyObject *args) {
    PyObject *heap, *item;
    if (!PyArg_ParseTuple(args, "OO:heappushpop", &heap, &item)) return NULL;
    if (!PyList_CheckExact(heap)) {
        PyErr_SetString(PyExc_TypeError, "heappushpop(heap, item): heap must be a list");
        return NULL;
    }
    Py_ssize_t n = PyList_GET_SIZE(heap);
    if (n && item) {
        PyObject *top = PyList_GET_ITEM(heap, 0);
        int item_lt_top;
        // if item < top: replace top with item and siftdown, return old top
        int ok = PyObject_RichCompareBool(item, top, Py_LT);
        if (ok < 0) return NULL;
        if (ok) {
            Py_INCREF(item);
            Py_INCREF(top);
            Py_DECREF(PyList_GET_ITEM(heap, 0));
            PyList_SET_ITEM(heap, 0, item);
            if (siftdown(heap, 0) < 0) { Py_DECREF(top); return NULL; }
            return top;
        }
    }
    Py_INCREF(item);
    return item;  // pushpop fast-path: return item unchanged when >= top or empty
}

static PyObject *api_heapreplace(PyObject *self, PyObject *args) {
    PyObject *heap, *item;
    if (!PyArg_ParseTuple(args, "OO:heapreplace", &heap, &item)) return NULL;
    if (!PyList_CheckExact(heap)) {
        PyErr_SetString(PyExc_TypeError, "heapreplace(heap, item): heap must be a list");
        return NULL;
    }
    Py_ssize_t n = PyList_GET_SIZE(heap);
    if (n == 0) {
        PyErr_SetString(PyExc_IndexError, "heapreplace on empty heap");
        return NULL;
    }
    PyObject *top = PyList_GET_ITEM(heap, 0);
    Py_INCREF(top);
    Py_INCREF(item);
    Py_DECREF(PyList_GET_ITEM(heap, 0));
    PyList_SET_ITEM(heap, 0, item);
    if (siftdown(heap, 0) < 0) { Py_DECREF(top); return NULL; }
    return top;
}

/* ---------- Module def ---------- */

static PyMethodDef methods[] = {
    {"heapify",     (PyCFunction)api_heapify,     METH_O,       "Transform list into a max-heap in-place."},
    {"heappush",    (PyCFunction)api_heappush,    METH_FASTCALL, "Push item onto heap (max-heap)."},
    {"heappop",     (PyCFunction)api_heappop,     METH_O,       "Pop and return the largest item."},
    {"heappushpop", (PyCFunction)api_heappushpop, METH_VARARGS, "Push item then pop and return the largest."},
    {"heapreplace", (PyCFunction)api_heapreplace, METH_VARARGS, "Pop largest and then push item."},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef moduledef = {
    PyModuleDef_HEAD_INIT,
    "maxheap._cmaxheap",
    "C accelerator for maxheap (max-first heap).",
    -1,
    methods
};

PyMODINIT_FUNC PyInit__cmaxheap(void) {
    return PyModule_Create(&moduledef);
}
