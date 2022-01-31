import { Card, Text, Image, Col, Grid, Spoiler, useMantineTheme, Box, Center, Pagination, Autocomplete, LoadingOverlay } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { useState, memo, createRef, useEffect, useRef } from 'react'
import { AutoCompleteItem } from '../components/AutoCompleteItem'
import { BiSearch } from 'react-icons/bi'
import { PreviewImageModal } from '../components/modal/PreviewImageModal'
import { useDispatch, useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { getProductActionCreator } from '../redux/action/creator/product'
import { decode } from 'html-entities'

const Product = () => {
    const theme = useMantineTheme()
    const secondaryColor = theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7]
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const autoCompleteItemRef = createRef()
    const modalPreviewRef = createRef()
    const dataLimit = 6
    const [product, setProduct] = useState([])
    const [pages, setPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [imagePreview, setImagePreview] = useState()
    const dispatch = useDispatch()
    const mounted = useRef()
    const { getProduct } = useSelector(state => ({
        getProduct: state.product.get
    }), shallowEqualRedux)
    const getProductResponse = getProduct?.response
    const [filterProduct, setFilterProduct] = useState({
        isFiltered: false,
        data: []
    })
    const onChangePage = (values) => setCurrentPage(values)

    useEffect(() => {
        if (!mounted.current) {
            dispatch(getProductActionCreator())
            mounted.current = true
        } else {
            if (getProductResponse) {
                setProduct(getProductResponse.map(value => ({
                    ...value,
                    name: decode(value.name),
                    description: decode(value.description),
                    uri: decode(value.uri)
                })))
                setPages(Math.round(getProductResponse.length / dataLimit))
            }
        }
    }, [getProductResponse])

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
                    filter={(value, item) =>
                        item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
                        item.description.toLowerCase().includes(value.toLowerCase().trim())
                    }
                    onChange={(value) => setFilterProduct({
                        isFiltered: true,
                        data: product.filter(item => {
                            return item.name.toLowerCase().includes(value.toLowerCase().trim()) ||
                                item.description.toLowerCase().includes(value.toLowerCase().trim())
                        })
                    })}
                    style={{
                        width: '50%'
                    }}
                />
            </Center>
            <Grid mt='3%' gutter='xs'>
                {paginatedData(filterProduct.isFiltered ? filterProduct.data : product).map((data, dataIndex) => (
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
        </Box>
    )
}

export const ProductPage = memo(Product, shallowEqual)
