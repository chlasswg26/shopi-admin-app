import { Card, Text, Button, Image, Col, Grid, Spoiler, useMantineTheme, Box, Center, Pagination, Autocomplete, Menu, LoadingOverlay } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { useState, memo, createRef, useEffect, useRef } from 'react'
import { AutoCompleteItem } from '../components/AutoCompleteItem'
import { BiSearch } from 'react-icons/bi'
import { PreviewImageModal } from '../components/modal/PreviewImageModal'
import { EditBannerModal } from '../components/modal/EditBannerModal'
import { useModals } from '@mantine/modals'
import { DialogBox } from '../components/DialogBox'
import { AddBannerModal } from '../components/modal/AddBannerModal'
import { useDispatch, useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { getBannerActionCreator, postBannerActionCreator, putBannerActionCreator, deleteBannerActionCreator } from '../redux/action/creator/banner'

const Banner = () => {
    const theme = useMantineTheme()
    const secondaryColor = theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7]
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const autoCompleteItemRef = createRef()
    const modalPreviewRef = createRef()
    const editBannerModalRef = createRef()
    const addBannerModalRef = createRef()
    const deleteDialogRef = createRef()
    const bannerDialogRef = createRef()
    const modals = useModals()
    const dataLimit = 6
    const [banner, setBanner] = useState([])
    const [pages, setPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [imagePreview, setImagePreview] = useState()
    const dispatch = useDispatch()
    const mounted = useRef()
    const { postBanner, getBanner, putBanner, deleteBanner } = useSelector(state => ({
        postBanner: state.banner.post,
        getBanner: state.banner.get,
        putBanner: state.banner.put,
        deleteBanner: state.banner.delete
    }), shallowEqualRedux)
    const getBannerResponse = getBanner?.response
    const isPostBannerFulfilled = postBanner?.isFulfilled
    const isPutBannerFulfilled = putBanner?.isFulfilled
    const isDeleteBannerFulfilled = deleteBanner?.isFulfilled
    const [bannerInfo, setBannerInfo] = useState({})
    const [filterBanner, setFilterBanner] = useState({
        isFiltered: false,
        data: []
    })

    const openDeleteModal = (bannerId, bannerName) => {
        const modalId = modals.openConfirmModal({
            itemRef: deleteDialogRef,
            title: 'Delete Banner',
            centered: true,
            children: (
                <Text size='sm'>
                    Are you sure you want to delete <strong><b><i>{bannerName.toLocaleUpperCase()}</i></b></strong>? This
                    action is destructive and data will lost forever.
                </Text>
            ),
            hideCloseButton: true,
            closeOnClickOutside: false,
            labels: { confirm: 'Delete', cancel: 'No don\'t delete it' },
            confirmProps: { color: 'red' },
            onCancel: () => modals.closeModal(modalId),
            onConfirm: () => dispatch(deleteBannerActionCreator(bannerId))
        })
    }
    const onChangePage = (values) => setCurrentPage(values)

    useEffect(() => {
        if (!mounted.current) {
            dispatch(getBannerActionCreator())
            mounted.current = true
        } else {
            if (
                isPostBannerFulfilled ||
                isPutBannerFulfilled ||
                isDeleteBannerFulfilled
            ) {
                dispatch(getBannerActionCreator())
                setShowDialog(true)
            }
        }
    }, [
        isPostBannerFulfilled,
        isPutBannerFulfilled,
        isDeleteBannerFulfilled
    ])

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
        } else {
            if (getBannerResponse) {
                setBanner(getBannerResponse)
                setPages(Math.round(getBannerResponse.length / dataLimit))
            }
        }
    }, [getBannerResponse])

    useEffect(() => {
        window.scrollTo({ behavior: 'smooth', top: '0px' })
    }, [currentPage])

    const paginatedData = (data) => {
        const startIndex = currentPage * dataLimit - dataLimit
        const endIndex = startIndex + dataLimit

        return data.slice(startIndex, endIndex)
    }

    return (
        <Box>
            <LoadingOverlay visible={deleteBanner?.isPending || getBanner?.isPending} />
            <Center mb='5%'>
                <Autocomplete
                    placeholder='Search some data...'
                    rightSection={<BiSearch size={25} />}
                    itemComponent={AutoCompleteItem}
                    itemRef={autoCompleteItemRef}
                    limit={5}
                    radius='xl'
                    size='lg'
                    switchDirectionOnFlip={true}
                    data={banner.map(item => ({
                        ...item,
                        value: item.name
                    }))}
                    filter={(value, item) =>
                        item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
                        item.description.toLowerCase().includes(value.toLowerCase().trim())
                    }
                    onChange={(value) => setFilterBanner({
                        isFiltered: true,
                        data: banner.filter(item => {
                            return item.name.toLowerCase().includes(value.toLowerCase().trim()) ||
                                item.description.toLowerCase().includes(value.toLowerCase().trim())
                        })
                    })}
                    style={{
                        width: '50%'
                    }}
                />
            </Center>
            <Button
                variant='gradient'
                gradient={{ from: 'teal', to: 'gray', deg: 65 }}
                color={theme.colorScheme === 'dark' ? 'indigo' : 'dark'}
                size='xl'
                uppercase
                compact
                onClick={() => setShowAddModal(true)}>
                Create New Banner
            </Button>
            <Grid mt='3%' gutter='xs'>
                {paginatedData(filterBanner.isFiltered ? filterBanner.data : banner).map((data, dataIndex) => (
                    <Col key={dataIndex} span={12} md={3} lg={3} sm={6}>
                        <div style={{ margin: 'auto' }}>
                            <Card shadow='sm' padding='lg'>
                                <Text lineClamp={2}>
                                    {data?.name}
                                </Text>

                                <Card.Section m='xs'>
                                    <Image
                                        style={{ cursor: 'zoom-in' }}
                                        onClick={() => {
                                            setShowPreviewModal(true)
                                            setImagePreview(data?.image)
                                        }}
                                        src={data?.image}
                                        height={160}
                                        alt={`${data?.name} placeholder`}
                                    />
                                </Card.Section>

                                <Text size='sm' style={{ color: secondaryColor, lineHeight: 1.5, marginTop: theme.spacing.sm }}>
                                    <Spoiler maxHeight={55} showLabel='more...' hideLabel='...less'>
                                        {data?.description}
                                    </Spoiler>
                                </Text>

                                <Center>
                                    <Menu placement='center' shadow='lg' size='xl' withArrow control={
                                        <Button radius='lg' variant='light' color='blue' fullWidth style={{ marginTop: 14 }}>
                                            Action
                                        </Button>
                                    }>
                                        <Menu.Label>Choose an action</Menu.Label>
                                        <Menu.Item onClick={() => {
                                            setShowEditModal(true)
                                            setBannerInfo({
                                                id: data?.id,
                                                name: data?.name,
                                                description: data?.description,
                                                uri: data?.uri
                                            })
                                        }} color='indigo'>Edit</Menu.Item>,
                                        <Menu.Item onClick={() => openDeleteModal(data?.id, data?.name)} color='red'>Delete</Menu.Item>
                                    </Menu>
                                </Center>
                            </Card>
                        </div>
                    </Col>
                ))}
            </Grid>
            <PreviewImageModal
                ref={modalPreviewRef}
                isOpen={showPreviewModal}
                setIsOpen={setShowPreviewModal}
                source={imagePreview}
            />
            <Center mt='7%' mb='sm'>
                <Pagination
                    page={currentPage}
                    total={pages}
                    onChange={(page) => onChangePage(page)}
                    siblings={3}
                    withControls
                    withEdges
                />
            </Center>
            {showDialog && (
                <DialogBox
                    ref={bannerDialogRef}
                    isDialogOpen={showDialog}
                    onDialogClose={() => setShowDialog(false)}
                    status={
                        getBanner?.statusCode ||
                        postBanner?.statusCode ||
                        putBanner?.statusCode ||
                        deleteBanner?.statusCode
                    }
                    message={(
                        getBanner?.errorMessage ||
                        postBanner?.errorMessage ||
                        putBanner?.errorMessage ||
                        deleteBanner?.errorMessage
                    ) || 'Action success'}
                />
            )}
            {showAddModal && (
                <AddBannerModal
                    ref={addBannerModalRef}
                    isOpen={showAddModal}
                    setIsOpen={setShowAddModal}
                    dispatchPostBannerAction={(values) => dispatch(postBannerActionCreator(values))}
                />
            )}
            {showEditModal && (
                <EditBannerModal
                    ref={editBannerModalRef}
                    isOpen={showEditModal}
                    setIsOpen={setShowEditModal}
                    banner={bannerInfo}
                    dispatchPutBannerAction={(values) => dispatch(putBannerActionCreator(values))}
                />
            )}
        </Box>
    )
}

export const BannerPage = memo(Banner, shallowEqual)
