import { Checkbox } from '../ui/checkbox';
import { DataTable } from './container';
import { DataTableColumnHeader } from './dt-columns-header';
import { camelToTitleCase } from '@/lib/camelToTitleCase'

type Columns = Array<{
    id: string;
    key: string;
    name: string;
    enableSorting: boolean;
    enableHiding: boolean;
}>


export default function Table<TData>({
    isSelectable,
    columns,
    data,
}: {
    isSelectable: boolean;
    columns: Columns,
    data: TData[],
}) {
    const formattedColumns = generateColumns({ columns, isSelectable });
    return <DataTable
        columns={formattedColumns}
        data={data}
    />
}


const generateColumns = ({
    isSelectable,
    columns,
}: {
    isSelectable: boolean;
    columns: Columns,
}) => {
    const SelectColumn = isSelectable ? [{
        id: "select",
        header: ({ table }: { table: any }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }: { row: any }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }] : [];
    return [
        ...SelectColumn,
        ...columns.map(clm => ({
            accessorKey: clm.name,
            header: ({ column }: { column: any }) => (
                <DataTableColumnHeader column={column} title={camelToTitleCase(clm.name)} />
            ),
            cell: ({ row }: { row: any }) => <div>{row.getValue(clm.name)}</div>,
            enableSorting: clm.enableSorting,
            enableHiding: clm.enableHiding,
        }))];
}