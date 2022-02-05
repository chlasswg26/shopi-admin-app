import { Box, Button, Center, LoadingOverlay, Menu } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { createRef, memo, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { TableData } from '../components/TableData'
import { getTransactionActionCreator, putTransactionActionCreator } from '../redux/action/creator/transaction'
import moment from 'moment'
import { EditTransactionModal } from '../components/modal/EditTransactionModal'
import { DialogBox } from '../components/DialogBox'
import { decode } from 'html-entities'

const Transaction = () => {
    const columns = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'id',
            id: 'ID',
            Footer: 'ID'
        },
        {
            Header: 'Customer',
            id: 'Customer',
            Cell: (props) => decode(props?.row?.original?.customer?.name),
            Footer: 'Customer'
        },
        {
            Header: 'Seller',
            id: 'Seller',
            Cell: (props) => decode(props?.row?.original?.product?.seller?.name),
            Footer: 'Seller'
        },
        {
            Header: 'Product',
            id: 'Product',
            Cell: (props) => decode(props?.row?.original?.product?.name),
            Footer: 'Product'
        },
        {
            Header: 'Category',
            id: 'Category',
            Cell: (props) => decode(props?.row?.original?.product?.category?.name),
            Footer: 'Category'
        },
        {
            Header: 'Price',
            accessor: 'price',
            id: 'Price',
            Footer: 'Price'
        },
        {
            Header: 'Quantity',
            accessor: 'quantity',
            id: 'Quantity',
            Footer: 'Quantity'
        },
        {
            Header: 'Detail',
            accessor: 'detail',
            id: 'Detail',
            Footer: 'Detail'
        },
        {
            Header: 'Status',
            accessor: 'status',
            id: 'Status',
            Footer: 'Status'
        },
        {
            Header: 'Action',
            id: 'Action',
            Cell: (props) => {
                const [showEditModal, setShowEditModal] = useState(false)
                const editTransactionModalRef = createRef()

                return (
                    <Center>
                        <Menu placement='center' shadow='lg' size='xl' withArrow control={
                            <Button radius='lg' variant='light' color='blue' fullWidth style={{ marginTop: 14 }}>
                                Action
                            </Button>
                        }>
                            <Menu.Label>Choose an action</Menu.Label>
                            <Menu.Item onClick={() => setShowEditModal(true)} color='indigo'>Edit</Menu.Item>,
                        </Menu>
                        {showEditModal && (
                            <EditTransactionModal
                                ref={editTransactionModalRef}
                                isOpen={showEditModal}
                                setIsOpen={setShowEditModal}
                                transaction={props?.row?.original}
                                dispatchPutTransactionAction={(values) => dispatch(putTransactionActionCreator(values))}
                            />
                        )}
                    </Center>
                )
            },
            Footer: 'Action'
        },
        {
            Header: 'Order Created',
            accessor: 'created_at',
            id: 'Order Created',
            Footer: 'Order Created'
        },
        {
            Header: 'Last Update',
            accessor: 'updated_at',
            id: 'Last Update',
            Footer: 'Last Update'
        }
    ], [])
    const [data, setData] = useState([])
    const dispatch = useDispatch()
    const { getTransaction, putTransaction } = useSelector(state => ({
        getTransaction: state.transaction.get,
        putTransaction: state.transaction.put
    }), shallowEqualRedux)
    const getTransactionResponse = getTransaction?.response
    const isPutTransactionFulfilled = putTransaction?.isFulfilled
    const [showDialog, setShowDialog] = useState(false)
    const transactionDialogRef = createRef()
    const mounted = useRef()
    const zoneName = moment().locale()
    const tableData = useMemo(() => data, [data])

    useEffect(() => {
        if (!mounted.current) {
            dispatch(getTransactionActionCreator())
            mounted.current = true
        } else {
            if (isPutTransactionFulfilled) {
                dispatch(getTransactionActionCreator())
                setShowDialog(true)
            }
        }
    }, [isPutTransactionFulfilled])

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
        } else {
            if (getTransactionResponse) {
                setData(getTransactionResponse.map(value => ({
                    ...value,
                    created_at: moment(value.created_at).locale(zoneName).format('LLLL'),
                    updated_at: moment(value.updated_at).locale(zoneName).format('LLLL')
                })))
            }
        }
    }, [getTransactionResponse])

    return (
        <Box>
            <LoadingOverlay visible={getTransaction?.isPending} />
            <TableData columns={columns} data={tableData} />
            {showDialog && (
                <DialogBox
                    ref={transactionDialogRef}
                    isDialogOpen={showDialog}
                    onDialogClose={() => setShowDialog(false)}
                    status={
                        getTransaction?.statusCode ||
                        putTransaction?.statusCode
                    }
                    message={(
                        getTransaction?.errorMessage ||
                        putTransaction?.statusCode
                    ) || 'Action success'}
                />
            )}
        </Box>
    )
}

export const TransactionPage = memo(Transaction, shallowEqual)
