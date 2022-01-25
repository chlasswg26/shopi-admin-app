import { Center, Table, Input, Box, Button, NumberInput, Select } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { forwardRef, Fragment, memo, useEffect, useRef, useState } from 'react'
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination, useAsyncDebounce } from 'react-table'
import { FaSortDown, FaSortUp, FaSort, FaSearch } from 'react-icons/fa'

const forwardedRef = forwardRef
const IndeterminateCheckbox = forwardedRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = useRef()
        const resolvedRef = ref || defaultRef

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return <input type='checkbox' ref={resolvedRef} {...rest} />
    }
)
const GlobalFilter = ({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter
}) => {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <Input
            icon={<FaSearch size='20' />}
            value={value || ''}
            onChange={event => {
                setValue(event.target.value)
                onChange(event.target.value)
            }}
            variant='filled'
            placeholder={`Search a data on ${count} results...`}
        />
    )
}
const CustomTableData = ({ columns, data }) => {
    const tableInstance = useTable({
        columns,
        data,
        initialState: { pageIndex: 0 }
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination)
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        prepareRow,
        allColumns,
        getToggleHideAllColumnsProps,
        state: {
            globalFilter,
            pageIndex,
            pageSize
        },
        preGlobalFilteredRows,
        setGlobalFilter,
        visibleColumns,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize
    } = tableInstance

    return (
        <Fragment>
            <div>
                <div>
                    <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle
                    All
                </div>
                {allColumns.map(column => (
                    <div key={column.id}>
                        <label>
                            <input type='checkbox' {...column.getToggleHiddenProps()} />{' '}
                            {column.id}
                        </label>
                    </div>
                ))}
                <br />
            </div>
            <Table {...getTableProps()} highlightOnHover>
                <thead>
                    {headerGroups.map((header, headerIndex) => (
                        <tr key={headerIndex} {...header.getHeaderGroupProps()}>
                            {header.headers.map((column, columnIndex) => (
                                <th key={columnIndex} {...column.getHeaderProps(column.getSortByToggleProps())} style={{
                                    border: 'solid 2px',
                                    fontWeight: 'bold'
                                }}>
                                    <Center style={{
                                        justifyContent: 'space-between',
                                        cursor: 'pointer'
                                    }}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? <FaSortDown size='20' /> : <FaSortUp size='20' />
                                            ) : <FaSort size='20' />}
                                        </span>
                                    </Center>
                                </th>
                            ))}
                        </tr>
                    ))}
                    <tr>
                        <th colSpan={visibleColumns.length} style={{
                            textAlign: 'left'
                        }}>
                            <GlobalFilter
                                preGlobalFilteredRows={preGlobalFilteredRows}
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, rowIndex) => {
                        prepareRow(row)

                        return (
                            <tr key={rowIndex} {...row.getRowProps()}>
                                {row.cells.map((cell, cellIndex) => {
                                    return (
                                        <td key={cellIndex} {...cell.getCellProps()} style={{
                                            padding: '10px',
                                            border: 'solid 1px gray'
                                        }}>
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    {footerGroups.map((footer, footerIndex) => (
                        <tr key={footerIndex} {...footer.getFooterGroupProps()}>
                            {footer.headers.map((column, columnIndex) => (
                                <th key={columnIndex} {...column.getFooterProps(column.getSortByToggleProps())} style={{
                                    border: 'solid 2px',
                                    fontWeight: 'bold'
                                }}>
                                    <Center style={{
                                        justifyContent: 'space-between',
                                        cursor: 'pointer'
                                    }}>
                                        {column.render('Footer')}
                                        <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? <FaSortDown size='20' /> : <FaSortUp size='20' />
                                            ) : <FaSort size='20' />}
                                        </span>
                                    </Center>
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </Table>

            <Center mt='xl'>
                <Box>
                    <Button variant='default' compact onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'<<'}
                    </Button>{' '}
                    <Button variant='default' compact onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </Button>{' '}
                    <Button variant='default' compact onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </Button>{' '}
                    <Button variant='default' compact onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </Button>
                    <Box component='span' ml='xs'>
                        Page{' '}
                        <Box component='strong'>
                            {pageIndex + 1} of {pageOptions.length}
                        </Box>{' '}
                    </Box>
                </Box>
                <Box
                    component='span'
                    ml='xs'
                    style={{
                        display: 'inline-flex'
                    }}>
                    | Go to page:{' '}
                    <NumberInput
                        defaultValue={pageIndex + 1}
                        onChange={number => {
                            const page = number ? Number(number) - 1 : 0
                            gotoPage(page)
                        }}
                        ml='xs'
                        size='xs'
                        min={0}
                        stepholddelay={500}
                        stepholdinterval={100}
                        noClampOnBlur
                    />
                </Box>{' '}
                <Select
                    size='xs'
                    ml='xs'
                    placeholder={`Show ${pageSize} records`}
                    onChange={value => setPageSize(Number(value))}
                    data={[
                        { value: 10, label: 'Show 10 records' },
                        { value: 20, label: 'Show 20 records' },
                        { value: 30, label: 'Show 30 records' },
                        { value: 40, label: 'Show 40 records' },
                        { value: 50, label: 'Show 50 records' }
                    ]}
                    style={{
                        display: 'inline-flex'
                    }}
                />
            </Center>
        </Fragment>
    )
}

export const TableData = memo(CustomTableData, shallowEqual)
