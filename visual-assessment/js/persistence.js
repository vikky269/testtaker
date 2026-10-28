/* Persistence adapter. The engine only needs { load, save, clear }.
 * Replace this file (or pass another adapter to createEngine) to store sessions on a server instead.
 * Stored data: question ids, option order, chosen option ids, grade and timestamps. No personal data.
 */
(function (root) {
  const VA = (root.VA = root.VA || {});

  function createLocalStoragePersistence(key) {
    key = key || 'visual-assessment:session:v1';
    const mem = { value: null }; // fallback when storage is unavailable
    let ok = true;
    function store() {
      try { return root.localStorage || null; } catch (e) { return null; }
    }
    return {
      load() {
        const s = store();
        if (s) {
          try { const raw = s.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { ok = false; }
        }
        return mem.value ? JSON.parse(mem.value) : null;
      },
      save(state) {
        const raw = JSON.stringify(state);
        const s = store();
        if (s) { try { s.setItem(key, raw); return true; } catch (e) { ok = false; } }
        mem.value = raw;
        return false;
      },
      clear() {
        const s = store();
        if (s) { try { s.removeItem(key); } catch (e) { ok = false; } }
        mem.value = null;
      },
      isPersistent() { return ok && !!store(); },
    };
  }

  VA.createLocalStoragePersistence = createLocalStoragePersistence;
  VA.persistence = createLocalStoragePersistence();
})(typeof window !== 'undefined' ? window : globalThis);
