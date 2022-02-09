import { Center, Table, Input, Box, Button, NumberInput, Select, Checkbox, createStyles, MediaQuery } from '@mantine/core'
import { shallowEqual, useListState } from '@mantine/hooks'
import { Fragment, memo, useEffect, useState } from 'react'
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination, useAsyncDebounce } from 'react-table'
import { FaSortDown, FaSortUp, FaSort, FaSearch } from 'react-icons/fa'

const useStyles = createStyles((theme) => ({
    thead: {
        visibility: 'hidden',
        [`@media screen and (min-width: ${theme.breakpoints.sm}px)`]: {
            visibility: 'visible'
        }
    },
    tr: {
        border: '1px solid',
        borderBottom: '2px solid',
        padding: '5px',
        marginBottom: '10px',
        display: 'block',
        [`@media screen and (min-width: ${theme.breakpoints.sm}px)`]: {
            display: 'table-row',
            borderBottomWidth: '1px',
            marginBottom: 0
        }
    },
    td: {
        padding: '10px',
        display: 'block',
        textAlign: 'right',
        fontSize: '13px',
        borderBottom: '1px dotted',
        '&:last-child': {
            borderBottom: 'none'
        },
        [`@media screen and (min-width: ${theme.breakpoints.sm}px)`]: {
            display: 'table-cell',
            textAlign: 'left',
            fontSize: '14px',
            borderBottom: 'none'
        },
        '::before': {
            content: 'attr(data-label)',
            float: 'left',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            [`@media screen and (min-width: ${theme.breakpoints.sm}px)`]: {
                content: '""',
                display: 'none'
            }
        }
    }
}))
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
            mb={values.length !== index ? 'xs' : 0}
            label={value.label}
            key={value.key}
            checked={value.checked}
            onChange={(event) => handlers.setItemProp(index, 'checked', event.currentTarget.checked)}
            {...value.getToggleHiddenProps()}
        />
    ))
    const allChecked = values.every((value) => value.checked)
    const indeterminate = values.some((value) => value.checked) && !allChecked
    const { classes } = useStyles()
    const [dataLabel, setDataLabel] = useState([])

    useEffect(() => {
        const getDataLabelFromColumn = columns.map(value => value.Header)

        setDataLabel(getDataLabelFromColumn)
    }, [])

    return (
        <Fragment>
            <Box style={{ width: '95%', overflow: 'auto' }}>
                <Box mb='md'>
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
                        {...getToggleHideAllColumnsProps()}
                    />
                </Box>
                <Box mb='xl'>
                    {items}
                </Box>
                <Table {...getTableProps()} highlightOnHover>
                    <thead className={classes.thead}>
                        {headerGroups.map((header, headerIndex) => (
                            <tr key={headerIndex} {...header.getHeaderGroupProps()} className={classes.tr}>
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
                        <MediaQuery smallerThan='md' styles={{ display: 'none' }}>
                            <tr className={classes.tr}>
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
                        </MediaQuery>
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, rowIndex) => {
                            prepareRow(row)

                            return (
                                <tr key={rowIndex} {...row.getRowProps()} className={classes.tr}>
                                    {row.cells.map((cell, cellIndex) => {
                                        return (
                                            <td key={cellIndex} {...cell.getCellProps()} data-label={dataLabel[cellIndex]} className={classes.td} style={{
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
                    <MediaQuery smallerThan='md' styles={{ display: 'none' }}>
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
                    </MediaQuery>
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
            </Box>
        </Fragment>
    )
}

export const TableData = memo(CustomTableData, shallowEqual)
