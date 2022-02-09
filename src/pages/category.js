import { Box, Button, LoadingOverlay, Menu, Text, useMantineTheme } from '@mantine/core'
import { shallowEqual, useMediaQuery } from '@mantine/hooks'
import { createRef, memo, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { TableData } from '../components/TableData'
import { deleteCategoryActionCreator, getCategoryActionCreator, postCategoryActionCreator, putCategoryActionCreator } from '../redux/action/creator/category'
import { AddCategoryModal } from '../components/modal/AddCategoryModal'
import moment from 'moment'
import { EditCategoryModal } from '../components/modal/EditCategoryModal'
import { useModals } from '@mantine/modals'
import { DialogBox } from '../components/DialogBox'
import { decode } from 'html-entities'

const Category = () => {
    const theme = useMantineTheme()
    const columns = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'id',
            id: 'ID',
            Footer: 'ID'
        },
        {
            Header: 'Name',
            accessor: 'name',
            id: 'Name',
            Footer: 'Name'
        },
        {
            Header: 'Description',
            accessor: 'description',
            id: 'Description',
            Footer: 'Description'
        },
        {
            Header: 'Action',
            id: 'Action',
            Cell: (props) => {
                const [showEditModal, setShowEditModal] = useState(false)
                const editCategoryModalRef = createRef()
                const deleteDialogRef = createRef()
                const modals = useModals()
                const openDeleteModal = (categoryId, categoryName) => {
                    const modalId = modals.openConfirmModal({
                        itemRef: deleteDialogRef,
                        title: 'Delete Category',
                        centered: true,
                        children: (
                            <Text size='sm'>
                                Are you sure you want to delete <strong><b><i>{categoryName.toLocaleUpperCase()}</i></b></strong>? This
                                action is destructive and data will lost forever.
                            </Text>
                        ),
                        hideCloseButton: true,
                        closeOnClickOutside: false,
                        labels: { confirm: 'Delete', cancel: 'No don\'t delete it' },
                        confirmProps: { color: 'red' },
                        onCancel: () => modals.closeModal(modalId),
                        onConfirm: () => dispatch(deleteCategoryActionCreator(categoryId))
                    })
                }
                const matches = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`)

                return (
                    <Box style={{ display: 'flex', justifyContent: matches ? 'center' : 'flex-end' }}>
                        <Menu placement='center' shadow='lg' size='xl' withArrow control={
                            <Button radius='lg' variant='light' color='blue' fullWidth style={{ marginTop: 14 }}>
                                Action
                            </Button>
                        }>
                            <Menu.Label>Choose an action</Menu.Label>
                            <Menu.Item onClick={() => setShowEditModal(true)} color='indigo'>Edit</Menu.Item>,
                            <Menu.Item onClick={() => openDeleteModal(props?.row?.original?.id, props?.row?.original?.name)} color='red'>Delete</Menu.Item>
                        </Menu>
                        {showEditModal && (
                            <EditCategoryModal
                                ref={editCategoryModalRef}
                                isOpen={showEditModal}
                                setIsOpen={setShowEditModal}
                                category={props?.row?.original}
                                dispatchPutCategoryAction={(values) => dispatch(putCategoryActionCreator(values))}
                            />
                        )}
                    </Box>
                )
            },
            Footer: 'Action'
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
    const { getCategory, postCategory, putCategory, deleteCategory } = useSelector(state => ({
        getCategory: state.category.get,
        postCategory: state.category.post,
        putCategory: state.category.put,
        deleteCategory: state.category.delete
    }), shallowEqualRedux)
    const getCategoryResponse = getCategory?.response
    const isPostCategoryFulfilled = postCategory?.isFulfilled
    const isPutCategoryFulfilled = putCategory?.isFulfilled
    const isDeleteCategoryFulfilled = deleteCategory?.isFulfilled
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const addCategoryModalRef = createRef()
    const categoryDialogRef = createRef()
    const mounted = useRef()
    const zoneName = moment().locale()
    const tableData = useMemo(() => data, [data])

    useEffect(() => {
        if (!mounted.current) {
            dispatch(getCategoryActionCreator())
            mounted.current = true
        } else {
            if (isPostCategoryFulfilled || isPutCategoryFulfilled || isDeleteCategoryFulfilled) {
                dispatch(getCategoryActionCreator())
                setShowDialog(true)
            }
        }
    }, [
        isPostCategoryFulfilled,
        isPutCategoryFulfilled,
        isDeleteCategoryFulfilled
    ])

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
        } else {
            if (getCategoryResponse) {
                setData(getCategoryResponse.map(value => ({
                    id: value.id,
                    name: decode(value.name),
                    description: decode(value.description),
                    updated_at: moment(value.updated_at).locale(zoneName).format('LLLL')
                })))
            }
        }
    }, [getCategoryResponse])

    return (
        <Box>
            <LoadingOverlay visible={deleteCategory?.isPending || getCategory?.isPending} />
            <Button
                variant='gradient'
                gradient={{ from: 'teal', to: 'gray', deg: 65 }}
                color={theme.colorScheme === 'dark' ? 'indigo' : 'dark'}
                size='xl'
                mb='xl'
                uppercase
                compact
                onClick={() => setShowAddModal(true)}>
                Create New Category
            </Button>
            <TableData columns={columns} data={tableData} />
            {showDialog && (
                <DialogBox
                    ref={categoryDialogRef}
                    isDialogOpen={showDialog}
                    onDialogClose={() => setShowDialog(false)}
                    status={
                        getCategory?.statusCode ||
                        postCategory?.statusCode ||
                        putCategory?.statusCode ||
                        deleteCategory?.statusCode
                    }
                    message={(
                        getCategory?.errorMessage ||
                        postCategory?.statusCode ||
                        putCategory?.statusCode ||
                        deleteCategory?.errorMessage
                    ) || 'Action success'}
                />
            )}
            {showAddModal && (
                <AddCategoryModal
                    ref={addCategoryModalRef}
                    isOpen={showAddModal}
                    setIsOpen={setShowAddModal}
                    dispatchPostCategoryAction={(values) => dispatch(postCategoryActionCreator(values))}
                />
            )}
        </Box>
    )
}

export const CategoryPage = memo(Category, shallowEqual)
