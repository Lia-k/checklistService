import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getMaxRowIdFromTableData } from "@/lib/rows";

export interface BugReport {
  id?: string;
  title?: string;
  steps?: string;
  actual?: string;
  expected?: string;
}

interface Table {
  id: string;
  name: string;
}

interface TableStoreData {
  inputValues: Record<string, string>;
  statusValues: Record<string, number | string | undefined>;
  bugValues?: Record<number, BugReport[]>;
}

interface AppState {
  // Checklist name
  checklistName: string;
  setChecklistName: (name: string) => void;
  getChecklistName: () => string;

  // Tables management
  tables: Table[];
  currentTableId: string | null;
  tableCounter: number; // Add counter for deterministic IDs
  addTable: () => void;
  removeTable: (id: string) => void;
  setCurrentTable: (id: string) => void;
  updateTableName: (id: string, name: string) => void;
  getCurrentTable: () => Table | undefined;

  // Table-specific data storage
  tableData: Record<string, TableStoreData>;
  // Row management per table
  rowsByTable: Record<string, number[]>;
  nextRowId: number;
  getRows: () => number[];
  addRowAfter: (rowId?: number) => void;
  removeRow: (rowId: number) => void;
  moveRow: (rowId: number, toIndex: number) => void;
  moveRowUp: (rowId: number) => void;
  moveRowDown: (rowId: number) => void;

  // Data access methods (work with current table)
  setInputValue: (id: string, value: string) => void;
  getInputValue: (id: string) => string;
  setStatusValue: (id: string, value: number | string | undefined) => void;
  getStatusValue: (id: string) => number | string | undefined;

  // Bug report per row
  addBugReport: (rowId: number, bug: BugReport) => void;
  updateBugReport: (rowId: number, index: number, value: Partial<BugReport>) => void;
  getBugReports: (rowId: number) => BugReport[];
  removeBugReport: (rowId: number, index: number) => void;

  // UI hover state
  hoveredRowId: number | null;
  setHoveredRowId: (id: number | null) => void;
}

const createEmptyTableData = (): TableStoreData => ({
  inputValues: {},
  statusValues: {},
  bugValues: {},
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Checklist name
      checklistName: "My checklist",
      setChecklistName: (name) => set({ checklistName: name }),
      getChecklistName: () => get().checklistName,

      // Tables management
      tables: [{ id: "table_1", name: "Table 1" }],
      currentTableId: "table_1",
      tableCounter: 1,

      // Initialize with empty data for the default table
      tableData: {
        table_1: createEmptyTableData(),
      },
      // Initialize rows for default table
      rowsByTable: {
        table_1: [1, 2, 3, 4, 5],
      },
      nextRowId: 5,

      // UI hover state
      hoveredRowId: null,
      setHoveredRowId: (id) => set({ hoveredRowId: id }),

      addTable: () => {
        const currentCounter = get().tableCounter + 1;
        const newId = `table_${currentCounter}`;
        const currentTables = get().tables;
        const newTableNumber = currentTables.length + 1;
        const newTable: Table = {
          id: newId,
          name: `Table ${newTableNumber}`,
        };

        set((state) => ({
          tables: [...currentTables, newTable],
          currentTableId: newId,
          tableCounter: currentCounter,
          tableData: {
            ...state.tableData,
            [newId]: createEmptyTableData(),
          },
          rowsByTable: {
            ...state.rowsByTable,
            [newId]: [1, 2, 3, 4, 5],
          },
          nextRowId: Math.max(state.nextRowId, 5),
        }));
      },

      removeTable: (id: string) => {
        const currentTables = get().tables;
        if (currentTables.length <= 1) return; // Don't allow removing the last table

        const updatedTables = currentTables.filter((table) => table.id !== id);
        const currentTableId = get().currentTableId;
        const remainingTableData = Object.fromEntries(
          Object.entries(get().tableData).filter(([key]) => key !== id)
        );

        set({
          tables: updatedTables,
          currentTableId:
            currentTableId === id
              ? updatedTables[0]?.id || null
              : currentTableId,
          tableData: remainingTableData,
          rowsByTable: Object.fromEntries(
            Object.entries(get().rowsByTable).filter(([key]) => key !== id)
          ),
        });
      },

      setCurrentTable: (id: string) => set({ currentTableId: id }),

      updateTableName: (id: string, name: string) => {
        const currentTables = get().tables;
        const updatedTables = currentTables.map((table) =>
          table.id === id ? { ...table, name } : table
        );
        set({ tables: updatedTables });
      },

      getCurrentTable: () => {
        const { tables, currentTableId } = get();
        return tables.find((table) => table.id === currentTableId);
      },

      // Data access methods - work with current table
      setInputValue: (id, value) => {
        const currentTableId = get().currentTableId;
        if (!currentTableId) return;

        set((state) => ({
          tableData: {
            ...state.tableData,
            [currentTableId]: {
              ...state.tableData[currentTableId],
              inputValues: {
                ...state.tableData[currentTableId]?.inputValues,
                [id]: value,
              },
            },
          },
        }));
      },

      getInputValue: (id) => {
        const currentTableId = get().currentTableId;
        if (!currentTableId) return "";
        return get().tableData[currentTableId]?.inputValues[id] ?? "";
      },

      setStatusValue: (id, value) => {
        const currentTableId = get().currentTableId;
        if (!currentTableId) return;

        set((state) => ({
          tableData: {
            ...state.tableData,
            [currentTableId]: {
              ...state.tableData[currentTableId],
              statusValues: {
                ...state.tableData[currentTableId]?.statusValues,
                [id]: value,
              },
            },
          },
        }));
      },

      getStatusValue: (id) => {
        const currentTableId = get().currentTableId;
        if (!currentTableId) return undefined;
        return get().tableData[currentTableId]?.statusValues[id];
      },


      // Bug report API (multiple per row)
      addBugReport: (rowId, bug) => {
        const currentTableId = get().currentTableId;
        if (!currentTableId) return;
        set((state) => {
          const existing = state.tableData[currentTableId]?.bugValues?.[rowId] ?? [];
          return {
            tableData: {
              ...state.tableData,
              [currentTableId]: {
                ...state.tableData[currentTableId],
                bugValues: {
                  ...(state.tableData[currentTableId]?.bugValues ?? {}),
                  [rowId]: [...existing, bug],
                },
              },
            },
          };
        });
      },
      updateBugReport: (rowId, index, value) => {
        const currentTableId = get().currentTableId;
        if (!currentTableId) return;
        set((state) => {
          const arr = state.tableData[currentTableId]?.bugValues?.[rowId] ?? [];
          if (index < 0 || index >= arr.length) return {};
          const updated = arr.slice();
          updated[index] = { ...updated[index], ...value };
          return {
            tableData: {
              ...state.tableData,
              [currentTableId]: {
                ...state.tableData[currentTableId],
                bugValues: {
                  ...(state.tableData[currentTableId]?.bugValues ?? {}),
                  [rowId]: updated,
                },
              },
            },
          };
        });
      },
      getBugReports: (rowId) => {
        const currentTableId = get().currentTableId;
        if (!currentTableId) return [];
        return get().tableData[currentTableId]?.bugValues?.[rowId] ?? [];
      },
      removeBugReport: (rowId, index) => {
        const currentTableId = get().currentTableId;
        if (!currentTableId) return;
        set((state) => {
          const arr = state.tableData[currentTableId]?.bugValues?.[rowId] ?? [];
          if (index < 0 || index >= arr.length) return {};
          const updated = arr.slice();
          updated.splice(index, 1);
          return {
            tableData: {
              ...state.tableData,
              [currentTableId]: {
                ...state.tableData[currentTableId],
                bugValues: {
                  ...(state.tableData[currentTableId]?.bugValues ?? {}),
                  [rowId]: updated,
                },
              },
            },
          };
        });
      },

      // Rows API
      getRows: () => {
        const { currentTableId, rowsByTable } = get();
        if (!currentTableId) return [];
        return rowsByTable[currentTableId] ?? [];
      },
      addRowAfter: (rowId) => {
        const { currentTableId } = get();
        if (!currentTableId) return;
        set((state) => {
          const rows = state.rowsByTable[currentTableId] ?? [];
          const insertIndex = rowId ? rows.indexOf(rowId) + 1 : rows.length;
          const newId = state.nextRowId + 1;
          const newRows = rows.slice();
          newRows.splice(insertIndex, 0, newId);
          return {
            rowsByTable: {
              ...state.rowsByTable,
              [currentTableId]: newRows,
            },
            nextRowId: newId,
          };
        });
      },
      removeRow: (rowId) => {
        const { currentTableId } = get();
        if (!currentTableId) return;
        set((state) => {
          const rows = state.rowsByTable[currentTableId] ?? [];
          const newRows = rows.filter((r) => r !== rowId);

          // Clear values for this row in the current table
          const table = state.tableData[currentTableId] ?? createEmptyTableData();
          const suffix = `-${rowId}`;
          const filterOut = <T,>(obj: Record<string, T>): Record<string, T> =>
            Object.fromEntries(
              Object.entries(obj).filter(([k]) => !k.endsWith(suffix)
            )) as Record<string, T>;

          return {
            rowsByTable: {
              ...state.rowsByTable,
              [currentTableId]: newRows,
            },
            tableData: {
              ...state.tableData,
              [currentTableId]: {
                inputValues: filterOut(table.inputValues ?? {}),
                statusValues: filterOut(table.statusValues ?? {}),
                bugValues: Object.fromEntries(
                  Object.entries(table.bugValues ?? {}).filter(([rid]) => Number(rid) !== rowId)
                ),
              },
            },
          };
        });
      },
      moveRow: (rowId, toIndex) => {
        const { currentTableId } = get();
        if (!currentTableId) return;
        set((state) => {
          const rows = state.rowsByTable[currentTableId] ?? [];
          const fromIndex = rows.indexOf(rowId);
          if (fromIndex === -1 || toIndex < 0 || toIndex >= rows.length) return {};
          const newRows = rows.slice();
          newRows.splice(fromIndex, 1);
          newRows.splice(toIndex, 0, rowId);
          return {
            rowsByTable: {
              ...state.rowsByTable,
              [currentTableId]: newRows,
            },
          };
        });
      },
      moveRowUp: (rowId) => {
        const { currentTableId } = get();
        if (!currentTableId) return;
        const rows = get().rowsByTable[currentTableId] ?? [];
        const idx = rows.indexOf(rowId);
        if (idx > 0) get().moveRow(rowId, idx - 1);
      },
      moveRowDown: (rowId) => {
        const { currentTableId } = get();
        if (!currentTableId) return;
        const rows = get().rowsByTable[currentTableId] ?? [];
        const idx = rows.indexOf(rowId);
        if (idx !== -1 && idx < rows.length - 1) get().moveRow(rowId, idx + 1);
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        // v2: introduce rowsByTable and nextRowId
        if (!persistedState) return persistedState as AppState;
        const ps = persistedState as Partial<AppState>;
        if (!ps.rowsByTable) {
          const rowsByTable: Record<string, number[]> = {};
          let globalMax = 0;
          const tableData = (ps.tableData ?? {}) as Record<string, TableStoreData>;
          for (const [tableId, data] of Object.entries(tableData)) {
            const max = Math.max(5, getMaxRowIdFromTableData(data));
            rowsByTable[tableId] = Array.from({ length: max }, (_, i) => i + 1);
            if (max > globalMax) globalMax = max;
          }
          return {
            ...ps,
            rowsByTable,
            nextRowId: globalMax,
          } as AppState;
        }
        // v3: convert bugValues from single object per row to arrays per row
        if (version < 3) {
          const tableDataRaw = (ps.tableData ?? {}) as Record<string, TableStoreData & { bugValues?: Record<string, unknown> }>;
          const newTableData: Record<string, TableStoreData> = {};
          for (const [tableId, data] of Object.entries(tableDataRaw)) {
            const bugValuesUnknown = data.bugValues ?? {};
            const converted: Record<number, BugReport[]> = {};
            for (const [rowIdStr, entry] of Object.entries(bugValuesUnknown)) {
              const rowId = Number(rowIdStr);
              if (Array.isArray(entry)) {
                converted[rowId] = entry as BugReport[];
              } else if (entry && typeof entry === "object") {
                converted[rowId] = [entry as BugReport];
              }
            }
            newTableData[tableId] = {
              ...data,
              bugValues: converted,
            };
          }
          return { ...(ps as AppState), tableData: newTableData } as AppState;
        }
        return ps as AppState;
      },
    }
  )
);
