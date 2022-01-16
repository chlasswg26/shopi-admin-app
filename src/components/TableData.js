import { Center, Table } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { Fragment, memo, useState } from 'react'
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination, useAsyncDebounce } from 'react-table'
import { FaSortDown, FaSortUp, FaSort } from 'react-icons/fa'

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
        <span>
            Search:{' '}
            <input
                value={value || ''}
                onChange={e => {
                    setValue(e.target.value)
                    onChange(e.target.value)
                }}
                placeholder={`${count} records...`}
                style={{
                    fontSize: '1.1rem',
                    border: '0'
                }}
            />
        </span>
    )
}
const CustomTableData = ({
    columns,
    data,
    // fetchData,
    loading,
    pageCount: controlledPageCount
}) => {
    const tableInstance = useTable({
        columns,
        data,
        initialState: { pageIndex: 0 },
        manualPagination: true,
        pageCount: controlledPageCount
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
        state: {
            globalFilter,
            // pageIndex,
            pageSize
        },
        preGlobalFilteredRows,
        setGlobalFilter,
        page
        // canPreviousPage,
        // canNextPage,
        // pageOptions,
        // pageCount,
        // gotoPage,
        // nextPage,
        // previousPage,
        // setPageSize
    } = tableInstance

    // useEffect(() => {
    //     fetchData({ pageIndex, pageSize })
    // }, [fetchData, pageIndex, pageSize])

    return (
        <Fragment>
            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
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
                    <tr>
                        {loading ? (
                            <td colSpan="10000">Loading...</td>
                        ) : (
                            <td colSpan="10000">
                                Showing {page.length} of {controlledPageCount * pageSize}{' '}
                                results
                            </td>
                        )}
                    </tr>
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
        </Fragment>
    )
}

export const TableData = memo(CustomTableData, shallowEqual)
