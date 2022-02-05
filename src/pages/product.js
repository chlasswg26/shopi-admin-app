import { Card, Text, Image, Col, Grid, Spoiler, useMantineTheme, Box, Center, Pagination, Autocomplete, LoadingOverlay, Menu, Button, Accordion, ScrollArea, Modal } from '@mantine/core'
import { shallowEqual, useDidUpdate } from '@mantine/hooks'
import { useState, memo, createRef, useEffect, useRef } from 'react'
import { AutoCompleteItem } from '../components/AutoCompleteItem'
import { BiSearch } from 'react-icons/bi'
import { PreviewImageModal } from '../components/modal/PreviewImageModal'
import { useDispatch, useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { deleteProductActionCreator, getProductActionCreator, postProductActionCreator, putProductActionCreator } from '../redux/action/creator/product'
import { decode } from 'html-entities'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useModals } from '@mantine/modals'
import { EditProductModal } from '../components/modal/EditProductModal'
import { getCategoryActionCreator } from '../redux/action/creator/category'
import { getUserActionCreator } from '../redux/action/creator/user'
import { DialogBox } from '../components/DialogBox'
import { FaRegEye } from 'react-icons/fa'
import { AddProductModal } from '../components/modal/AddProductModal'

const Product = () => {
    const theme = useMantineTheme()
    const secondaryColor = theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7]
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const autoCompleteItemRef = createRef()
    const modalPreviewRef = createRef()
    const productDialogRef = createRef()
    const dataLimit = 8
    const [product, setProduct] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [productInfo, setProductInfo] = useState({})
    const [categoryInfo, setCategoryInfo] = useState([])
    const [sellerInfo, setSellerInfo] = useState([])
    const [imagePreview, setImagePreview] = useState('')
    const [modalImagePreviewCentered, setImagePreviewCentered] = useState('')
    const [imagePreviewProduct, setImagePreviewProduct] = useState([])
    const [showDialog, setShowDialog] = useState(false)
    const [showPreviewCentered, setShowPreviewCentered] = useState(false)
    const [showPreviewModalCentered, setShowPreviewModalCentered] = useState(false)
    const dispatch = useDispatch()
    const mounted = useRef()
    const { getProduct, postProduct, putProduct, deleteProduct } = useSelector(state => ({
        getProduct: state.product.get,
        postProduct: state.product.post,
        putProduct: state.product.put,
        deleteProduct: state.product.delete
    }), shallowEqualRedux)
    const isPostProductFulfilled = postProduct?.isFulfilled
    const isPutProductFulfilled = putProduct?.isFulfilled
    const isDeleteProductFulfilled = deleteProduct?.isFulfilled
    const { getCategory } = useSelector(state => ({
        getCategory: state.category.get
    }), shallowEqualRedux)
    const { getUser } = useSelector(state => ({
        getUser: state.user.get
    }), shallowEqualRedux)
    const [searchParams] = useSearchParams()
    const params = Object.fromEntries([...searchParams])
    const navigation = useNavigate()
    const onChangePage = (value) => {
        dispatch(getProductActionCreator({
            limit: params?.limit || dataLimit,
            page: value
        }))
        navigation(`?page=${value}&limit=${params?.limit || dataLimit}`)
    }
    const modals = useModals()
    const deleteDialogRef = createRef()
    const editProductModalRef = createRef()
    const addProductModalRef = createRef()
    const previewCenteredRef = createRef()
    const modalPreviewRefCentered = createRef()
    const openDeleteModal = (productId, productName) => {
        const modalId = modals.openConfirmModal({
            itemRef: deleteDialogRef,
            title: 'Delete Product',
            centered: true,
            children: (
                <Text size='sm'>
                    Are you sure you want to delete <strong><b><i>{productName.toLocaleUpperCase()}</i></b></strong>? This
                    action is destructive and data will lost forever.
                </Text>
            ),
            hideCloseButton: true,
            closeOnClickOutside: false,
            labels: { confirm: 'Delete', cancel: 'No don\'t delete it' },
            confirmProps: { color: 'red' },
            onCancel: () => modals.closeModal(modalId),
            onConfirm: () => dispatch(deleteProductActionCreator(productId))
        })
    }

    useEffect(() => {
        if (!mounted.current) {
            dispatch(getProductActionCreator({ limit: params?.limit || dataLimit, page: params?.page || 1 }))
            dispatch(getCategoryActionCreator())
            dispatch(getUserActionCreator())
            mounted.current = true
        } else {
            if (getProduct.response) {
                setProduct(getProduct?.response.map(value => ({
                    ...value,
                    name: decode(value.name),
                    description: decode(value.description)
                })))
            }

            if (getCategory.response) {
                setCategoryInfo(getCategory?.response.map(value => ({
                    id: value.id,
                    name: decode(value.name)
                })))
            }

            if (getUser.response) {
                setSellerInfo(getUser?.response.map(value => ({
                    id: value.id,
                    name: decode(value.name)
                })))
            }
        }
    }, [
        getProduct,
        getCategory,
        getUser
    ])

    useDidUpdate(() => {
        if (
            isPostProductFulfilled ||
            isPutProductFulfilled ||
            isDeleteProductFulfilled
        ) {
            dispatch(getProductActionCreator({ limit: params?.limit || dataLimit, page: params?.page || 1 }))
            setShowDialog(true)
        }
    }, [
        isPostProductFulfilled,
        isPutProductFulfilled,
        isDeleteProductFulfilled
    ])

    useDidUpdate(() => {
        window.scrollTo({ behavior: 'smooth', top: '0px' })
    }, [getProduct?.pagination?.page?.current])

    const renderCardData = (data, dataIndex) => (
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
                                setShowPreviewCentered(true)
                                setImagePreviewProduct(data.preview)
                            }} color='lime'>Preview</Menu.Item>
                            <Menu.Item onClick={() => {
                                setShowEditModal(true)
                                setProductInfo(data)
                            }} color='indigo'>Edit</Menu.Item>
                            <Menu.Item onClick={() => openDeleteModal(data?.id, data?.name)} color='red'>Delete</Menu.Item>
                        </Menu>
                    </Center>
                </Card>
            </div>
        </Col>
    )

    return (
        <Box>
            <LoadingOverlay visible={getProduct?.isPending} />
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
                    data={product.map(item => ({
                        ...item,
                        value: item.name
                    }))}
                    onChange={(value) => dispatch(getProductActionCreator({
                        ...params,
                        search: value.toLowerCase().trim()
                    }))}
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
                Create New Product
            </Button>
            <Grid mt='3%' gutter='xs'>
                {product.map(renderCardData)}
            </Grid>
            <PreviewImageModal
                ref={modalPreviewRef}
                isOpen={showPreviewModal}
                setIsOpen={setShowPreviewModal}
                source={imagePreview}
            />
            <Center mt='7%' mb='sm'>
                <Pagination
                    page={getProduct?.pagination?.page?.current}
                    total={getProduct?.pagination?.total?.sheet}
                    onChange={(page) => onChangePage(page)}
                    siblings={3}
                    withControls
                    withEdges
                />
            </Center>
            {showDialog && (
                <DialogBox
                    ref={productDialogRef}
                    isDialogOpen={showDialog}
                    onDialogClose={() => setShowDialog(false)}
                    status={
                        getProduct?.statusCode ||
                        postProduct?.statusCode ||
                        putProduct?.statusCode ||
                        deleteProduct?.statusCode
                    }
                    message={(
                        getProduct?.errorMessage ||
                        postProduct?.errorMessage ||
                        putProduct?.errorMessage ||
                        deleteProduct?.errorMessage
                    ) || 'Action success'}
                />
            )}
            {showAddModal && (
                <AddProductModal
                    ref={addProductModalRef}
                    isOpen={showAddModal}
                    setIsOpen={setShowAddModal}
                    category={categoryInfo}
                    seller={sellerInfo}
                    dispatchPostProductAction={(values) => dispatch(postProductActionCreator(values))}
                />
            )}
            {showEditModal && (
                <EditProductModal
                    ref={editProductModalRef}
                    isOpen={showEditModal}
                    setIsOpen={setShowEditModal}
                    product={productInfo}
                    category={categoryInfo}
                    seller={sellerInfo}
                    dispatchPutProductAction={(values) => dispatch(putProductActionCreator(values))}
                />
            )}
            {showPreviewCentered && (
                <Modal
                    itemRef={previewCenteredRef}
                    opened={showPreviewCentered}
                    onClose={() => setShowPreviewCentered(false)}
                    title='Image Product Preview'
                    overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                    overlayOpacity={0.95}
                    size='full'
                    transition='slide-up'
                    transitionDuration={600}
                    transitiontimingfunction='ease'
                    closeOnClickOutside={false}
                    overflow='inside'
                    centered>
                    <Accordion icon={<FaRegEye size='20' />} disableIconRotation>
                        <Accordion.Item mt='5%' label='Preview Image'>
                            <ScrollArea style={{ height: '50%' }} offsetScrollbars>
                                <Grid mt='xs'>
                                    {imagePreviewProduct.map((file, fileIndex) => (
                                        <Col key={fileIndex} span={12} md={3} lg={3} sm={6}>
                                            <Center>
                                                <Image
                                                    fit='cover'
                                                    radius='sm'
                                                    src={file.imageUrl}
                                                    onClick={() => {
                                                        setShowPreviewModalCentered(true)
                                                        setImagePreviewCentered(file.imageUrl)
                                                    }}
                                                    style={{
                                                        width: '50%',
                                                        height: '50%',
                                                        cursor: 'zoom-in'
                                                    }}
                                                />
                                            </Center>
                                        </Col>
                                    ))}
                                </Grid>
                            </ScrollArea>
                        </Accordion.Item>
                    </Accordion>
                    <PreviewImageModal
                        ref={modalPreviewRefCentered}
                        isOpen={showPreviewModalCentered}
                        setIsOpen={setShowPreviewModalCentered}
                        source={modalImagePreviewCentered}
                    />
                </Modal>
            )}
        </Box>
    )
}

export const ProductPage = memo(Product, shallowEqual)
