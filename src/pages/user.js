import { Avatar, Box, Button, Center, LoadingOverlay, Menu, Text, useMantineTheme } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { createRef, memo, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { TableData } from '../components/TableData'
import { deleteUserActionCreator, getUserActionCreator, postUserActionCreator, putUserActionCreator } from '../redux/action/creator/user'
import { AddUserModal } from '../components/modal/AddUserModal'
import moment from 'moment'
import { EditUserModal } from '../components/modal/EditUserModal'
import { useModals } from '@mantine/modals'
import { DialogBox } from '../components/DialogBox'
import { PreviewImageModal } from '../components/modal/PreviewImageModal'
import { decode } from 'html-entities'

const User = () => {
    const columns = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'id',
            id: 'ID',
            Footer: 'ID'
        },
        {
            Header: 'Avatar',
            id: 'Avatar',
            Cell: (props) => {
                const [showPreviewModal, setShowPreviewModal] = useState(false)
                const modalPreviewRef = createRef()

                return (
                    <Center>
                        <Avatar
                            src={props?.row?.original?.image}
                            alt='User Avatar'
                            radius='xl'
                            style={{
                                cursor: 'zoom-in'
                            }}
                            onClick={() => setShowPreviewModal(true)}
                        />
                        <PreviewImageModal
                            ref={modalPreviewRef}
                            isOpen={showPreviewModal}
                            setIsOpen={setShowPreviewModal}
                            source={props?.row?.original?.image}
                        />
                    </Center>
                )
            },
            Footer: 'Avatar'
        },
        {
            Header: 'Name',
            accessor: 'name',
            id: 'Name',
            Footer: 'Name'
        },
        {
            Header: 'E-Mail',
            accessor: 'email',
            id: 'E-Mail',
            Footer: 'E-Mail'
        },
        {
            Header: 'Phone',
            accessor: 'phone',
            id: 'Phone',
            Footer: 'Phone'
        },
        {
            Header: 'Store',
            accessor: 'store',
            id: 'Store',
            Footer: 'Store'
        },
        {
            Header: 'Balance',
            accessor: 'balance',
            id: 'Balance',
            Footer: 'Balance'
        },
        {
            Header: 'Role',
            accessor: 'role',
            id: 'Role',
            Footer: 'Role'
        },
        {
            Header: 'Action',
            id: 'Action',
            Cell: (props) => {
                const [showEditModal, setShowEditModal] = useState(false)
                const editUserModalRef = createRef()
                const deleteDialogRef = createRef()
                const modals = useModals()
                const openDeleteModal = (userId, userName) => {
                    const modalId = modals.openConfirmModal({
                        itemRef: deleteDialogRef,
                        title: 'Delete User',
                        centered: true,
                        children: (
                            <Text size='sm'>
                                Are you sure you want to delete <strong><b><i>{userName.toLocaleUpperCase()}</i></b></strong>? This
                                action is destructive and data will lost forever.
                            </Text>
                        ),
                        hideCloseButton: true,
                        closeOnClickOutside: false,
                        labels: { confirm: 'Delete', cancel: 'No don\'t delete it' },
                        confirmProps: { color: 'red' },
                        onCancel: () => modals.closeModal(modalId),
                        onConfirm: () => dispatch(deleteUserActionCreator(userId))
                    })
                }

                return (
                    <Center>
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
                            <EditUserModal
                                ref={editUserModalRef}
                                isOpen={showEditModal}
                                setIsOpen={setShowEditModal}
                                user={props?.row?.original}
                                dispatchUpdateUserAction={(values) => dispatch(putUserActionCreator(values))}
                            />
                        )}
                    </Center>
                )
            },
            Footer: 'Action'
        },
        {
            Header: 'Member\'s Since',
            accessor: 'created_at',
            id: 'Member\'s Since',
            Footer: 'Member\'s Since'
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
    const { getUser, postUser, putUser, deleteUser } = useSelector(state => ({
        getUser: state.user.get,
        postUser: state.user.post,
        putUser: state.user.put,
        deleteUser: state.user.delete
    }), shallowEqualRedux)
    const getUserResponse = getUser?.response
    const isPostUserFulfilled = postUser?.isFulfilled
    const isPutUserFulfilled = putUser?.isFulfilled
    const isDeleteUserFulfilled = deleteUser?.isFulfilled
    const theme = useMantineTheme()
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const addUserModalRef = createRef()
    const userDialogRef = createRef()
    const mounted = useRef()
    const zoneName = moment().locale()
    const tableData = useMemo(() => data, [data])

    useEffect(() => {
        if (!mounted.current) {
            dispatch(getUserActionCreator())
            mounted.current = true
        } else {
            if (isPostUserFulfilled || isPutUserFulfilled || isDeleteUserFulfilled) {
                dispatch(getUserActionCreator())
                setShowDialog(true)
            }
        }
    }, [
        isPostUserFulfilled,
        isPutUserFulfilled,
        isDeleteUserFulfilled
    ])

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
        } else {
            if (getUserResponse) {
                setData(getUserResponse.map(value => ({
                    ...value,
                    name: decode(value.name),
                    created_at: moment(value.created_at).locale(zoneName).format('LLLL'),
                    updated_at: moment(value.updated_at).locale(zoneName).format('LLLL')
                })))
            }
        }
    }, [getUserResponse])

    return (
        <Box>
            <LoadingOverlay visible={deleteUser?.isPending || getUser?.isPending} />
            <Button
                variant='gradient'
                gradient={{ from: 'teal', to: 'gray', deg: 65 }}
                color={theme.colorScheme === 'dark' ? 'indigo' : 'dark'}
                size='xl'
                mb='xl'
                uppercase
                compact
                onClick={() => setShowAddModal(true)}>
                Create New User
            </Button>
            <TableData columns={columns} data={tableData} />
            {showDialog && (
                <DialogBox
                    ref={userDialogRef}
                    isDialogOpen={showDialog}
                    onDialogClose={() => setShowDialog(false)}
                    status={
                        getUser?.statusCode ||
                        postUser?.statusCode ||
                        putUser?.statusCode ||
                        deleteUser?.statusCode
                    }
                    message={(
                        getUser?.errorMessage ||
                        postUser?.statusCode ||
                        putUser?.statusCode ||
                        deleteUser?.errorMessage
                    ) || 'Action success'}
                />
            )}
            {showAddModal && (
                <AddUserModal
                    ref={addUserModalRef}
                    isOpen={showAddModal}
                    setIsOpen={setShowAddModal}
                    dispatchPostUserAction={(values) => dispatch(postUserActionCreator(values))}
                />
            )}
        </Box>
    )
}

export const UserPage = memo(User, shallowEqual)
