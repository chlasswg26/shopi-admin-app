import { Box } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { memo, useMemo } from 'react'
import { TableData } from '../components/TableData'

const Category = () => {
    const data = useMemo(() => [
        {
            id: 1,
            name: 'Celana',
            description: 'Celana untuk ukuran dewasa',
            status: 'ACTIVE'
        },
        {
            id: 2,
            name: 'Baju',
            description: 'Baju untuk ukuran dewasa',
            status: 'ACTIVE'
        }
    ], [])
    const columns = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'id',
            Footer: 'ID'
        },
        {
            Header: 'Name',
            accessor: 'name',
            Footer: 'Name'
        },
        {
            Header: 'Description',
            accessor: 'description',
            Footer: 'Description'
        },
        {
            Header: 'Status',
            accessor: 'status',
            Footer: 'Status'
        }
    ], [])

    return (
        <Box>
            <TableData
                columns={columns}
                data={data}
            />
        </Box>
    )
}

export const CategoryPage = memo(Category, shallowEqual)
