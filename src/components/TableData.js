import { Center, Table, Input, Box, Button, NumberInput, Select, Checkbox } from '@mantine/core'
import { shallowEqual, useListState } from '@mantine/hooks'
import { Fragment, memo, useState } from 'react'
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination, useAsyncDebounce } from 'react-table'
import { FaSortDown, FaSortUp, FaSort, FaSearch } from 'react-icons/fa'

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
    const [values, handlers] = useListState(allColumns.map((columnValue, columnId) => ({
        ...columnValue,
        key: columnId,
        label: columnValue.id,
        checked: false
    })))
    const items = values.map((value, index) => (
        <Checkbox
            color='indigo'
            radius='xl'
            size='xs'
            ml='md'
            label={value.label}
            key={value.key}
            checked={value.checked}
            onChange={(event) => handlers.setItemProp(index, 'checked', event.currentTarget.checked)}
            {...value.getToggleHiddenProps()}
        />
    ))
    const allChecked = values.every((value) => value.checked)
    const indeterminate = values.some((value) => value.checked) && !allChecked

    return (
        <Fragment>
            <Center mb='md'>
                <Checkbox
                    checked={allChecked}
                    indeterminate={indeterminate}
                    label='Toggle All'
                    color='indigo'
                    radius='xl'
                    size='xs'
                    transitionDuration={300}
                    onChange={() =>
                        handlers.setState((current) =>
                            current.map((value) => ({ ...value, checked: !allChecked }))
                        )
                    }
                    style={{
                        justifyContent: 'center'
                    }}
                    {...getToggleHideAllColumnsProps()}
                />
            </Center>
            <Center mb='xl'>
                {items}
            </Center>
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
                        variant='filled'
                        ml='xs'
                        size='xs'
                        min={1}
                        max={pageOptions.length}
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
