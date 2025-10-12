import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Table {
  id: string;
  name: string;
}

interface TableData {
  inputValues: Record<string, string>;
  statusValues: Record<string, number | string | undefined>;
  screenshotValues: Record<string, string[]>;
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
  tableData: Record<string, TableData>;

  // Data access methods (work with current table)
  setInputValue: (id: string, value: string) => void;
  getInputValue: (id: string) => string;
  setStatusValue: (id: string, value: number | string | undefined) => void;
  getStatusValue: (id: string) => number | string | undefined;
  setScreenshotValue: (id: string, value: string[]) => void;
  getScreenshotValue: (id: string) => string[] | undefined;
}

const createEmptyTableData = (): TableData => ({
  inputValues: {},
  statusValues: {},
  screenshotValues: {},
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

      setScreenshotValue: (id, value) => {
        const currentTableId = get().currentTableId;
        if (!currentTableId) return;

        set((state) => ({
          tableData: {
            ...state.tableData,
            [currentTableId]: {
              ...state.tableData[currentTableId],
              screenshotValues: {
                ...state.tableData[currentTableId]?.screenshotValues,
                [id]: value,
              },
            },
          },
        }));
      },

      getScreenshotValue: (id) => {
        const currentTableId = get().currentTableId;
        if (!currentTableId) return undefined;
        return get().tableData[currentTableId]?.screenshotValues[id];
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
