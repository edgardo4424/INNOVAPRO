import DataTable from "react-data-table-component"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export default function TablaUsuarios({ usuarios, onEditar, onEliminar }) {
  if (usuarios.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No hay usuarios registrados.</p>
      </div>
    )
  }

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre || "—",
      sortable: true,
      grow: 1,
    },
    {
      name: "Email",
      selector: (row) => row.email || "—",
      sortable: true,
      grow: 2,
    },
    {
      name: "Rol",
      selector: (row) => row.rol || "—",
      sortable: true,
      grow: 1,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size={'icon'}
            onClick={() => onEditar(row)}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEliminar(row.id)}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      // button: true,
      width: "120px",
    },
  ]

  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: "#e5e7eb",
        backgroundColor: "#f9fafb",
        minHeight: "48px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
      },
    },
    rows: {
      style: {
        minHeight: "56px",
        "&:hover": {
          backgroundColor: "#f9fafb",
        },
      },
      stripedStyle: {
        backgroundColor: "#fafafa",
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        fontSize: "14px",
        color: "#6b7280",
      },
    },
  }

  return (
    <div className="w-full px-4">
      <DataTable
        columns={columns}
        data={usuarios}
        responsive
        striped
        highlightOnHover
        customStyles={customStyles}
        noDataComponent={
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No hay usuarios registrados.</p>
          </div>
        }
      />
    </div>
  )
}
