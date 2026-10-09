import { Typography, useTheme } from '@mui/material'
import { MaterialReactTable, MRT_RowData, MRT_TableOptions, useMaterialReactTable } from 'material-react-table'
interface TableProps<TData extends MRT_RowData> {
  title?: string
  isLoading?: boolean
  tableOptions: Omit<
    MRT_TableOptions<TData>,
    | 'enableDensityToggle'
    | 'enableGlobalFilter'
    | 'enableFilterMatchHighlighting'
    | 'localization'
    | 'renderTopToolbarCustomActions'
  >
}

const Table = <TData extends MRT_RowData>({ title, isLoading, tableOptions }: TableProps<TData>) => {
  const theme = useTheme()

  const table = useMaterialReactTable({
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableDensityToggle: false,
    enableGlobalFilter: false,
    enableFilterMatchHighlighting: false,
    enableColumnActions: false,
    localization: {
      noRecordsToDisplay: 'No data'
    },
    muiTablePaperProps: {
      style: {
        marginTop: '1.5rem'
      }
    },
    renderTopToolbarCustomActions: title
      ? () => (
          <Typography variant='subtitle1' my={'auto'} marginLeft='0.5rem' sx={{ color: theme.palette.info.dark }}>
            {title}
          </Typography>
        )
      : undefined,
    ...tableOptions,
    state: {
      ...tableOptions.state,
      isLoading: isLoading ?? tableOptions.state?.isLoading ?? false
    }
  })

  return <MaterialReactTable table={table} />
}

export default Table
