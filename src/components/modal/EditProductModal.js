import { Button, Container, Input, Image, InputWrapper, Modal, Textarea, useMantineTheme, Accordion, Grid, Col, ScrollArea, Center, Text, LoadingOverlay, Select, Space } from '@mantine/core'
import { shallowEqual, useDidUpdate } from '@mantine/hooks'
import { createRef, forwardRef, Fragment, memo, useState } from 'react'
import { DropzoneImage } from '../DropzoneImage'
import { PreviewImageModal } from './PreviewImageModal'
import { FaRegEye } from 'react-icons/fa'
import { withFormik, ErrorMessage } from 'formik'
import { createFormData } from '../../utils/form-data'
import { productModel } from '../../utils/schema'
import { useSelector } from 'react-redux'

const forwardedRef = forwardRef
const CustomEditProductModalWithFormikProps = ({
    errors,
    values,
    handleChange,
    handleSubmit,
    setFieldValue
}) => {
    const [image, setImage] = useState({})
    const [previewImageProduct, setPreviewImageProduct] = useState([])
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const [showPreviewProductModal, setShowPreviewProductModal] = useState(false)
    const modalPreviewRef = createRef()
    const secondModalPreviewRef = createRef()
    const dropzoneProductImageRef = createRef()
    const dropzonePreviewProductImageRef = createRef()
    const [previewImage, setPreviewImage] = useState('')
    const [previewProduct, setPreviewProduct] = useState('')
    const { put } = useSelector(state => state.product, shallowEqual)

    useDidUpdate(() => setFieldValue('single', image[0], false), [image])
    useDidUpdate(() => setFieldValue('multiple', previewImageProduct, false), [previewImageProduct])

    return (
        <Fragment>
            <LoadingOverlay visible={put?.isPending} />
            <form onSubmit={handleSubmit}>
                <InputWrapper
                    id='product-name-id'
                    required
                    label='Name'
                    description='Please enter product name'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='name' />}>
                    <Input
                        variant='filled'
                        id='input-product-name'
                        placeholder='Product name'
                        value={values.name}
                        name='name'
                        onChange={handleChange}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <Textarea
                    label='Description'
                    id='input-product-description'
                    placeholder='Product description'
                    variant='filled'
                    value={values.description}
                    name='description'
                    onChange={handleChange}
                    disabled={put?.isPending}
                    error={errors?.description ? <ErrorMessage name='description' /> : ''}
                    autosize
                    minRows={5}
                    maxRows={10}
                />
                <InputWrapper
                    id='product-price-id'
                    required
                    label='Price'
                    description='Please enter product price'
                    style={{
                        width: '100%'
                    }}
                    error={<ErrorMessage name='price' />}>
                    <Input
                        variant='filled'
                        id='input-product-price'
                        placeholder='Product price'
                        value={values.price}
                        name='price'
                        onChange={handleChange}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <Select
                    label='Choose Category'
                    placeholder='Pick one'
                    searchable
                    nothingFound='No options'
                    value={values.category_id}
                    onChange={(value) => setFieldValue('category_id', value, false)}
                    data={values.category.map(value => ({
                        value: value.id.toString(),
                        label: value.name
                    }))}
                />
                <Select
                    label='Choose Seller'
                    placeholder='Pick one'
                    searchable
                    nothingFound='No options'
                    value={values.seller_id}
                    onChange={(value) => setFieldValue('seller_id', value, false)}
                    data={values.seller.map(value => ({
                        value: value.id.toString(),
                        label: value.name
                    }))}
                />
                <Container mt='xl'>
                    <DropzoneImage
                        ref={dropzoneProductImageRef}
                        setPreview={setImage}
                        isMultiple={false}>
                        <Text size='xl' inline>
                            Drag image here or click to select file
                        </Text>
                        <Text size='sm' color='dimmed' inline mt={7}>
                            Attach only 1 file for product image.
                        </Text>
                    </DropzoneImage>
                    {image.length ? (
                        <Accordion icon={<FaRegEye size='20' />} disableIconRotation>
                            <Accordion.Item mt='5%' mb='5%' label='View Image' style={{
                                borderBottomColor: 'transparent',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
                            }}>
                                <ScrollArea style={{ height: '50%' }} offsetScrollbars>
                                    <Grid mt='xs'>
                                        {image.map((file, fileIndex) => (
                                            <Col key={fileIndex} span={12} md={3} lg={3} sm={6}>
                                                <Center>
                                                    <Image
                                                        fit='cover'
                                                        radius='sm'
                                                        src={file.preview}
                                                        onClick={() => {
                                                            setShowPreviewModal(true)
                                                            setPreviewImage(file.preview)
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
                    ) : <Space />}
                    <DropzoneImage ref={dropzonePreviewProductImageRef} setPreview={setPreviewImageProduct}>
                        <Text size='xl' inline>
                            Drag preview product image here or click to select file
                        </Text>
                        <Text size='sm' color='dimmed' inline mt={7}>
                            Attach only 1 file for preview product image.
                        </Text>
                    </DropzoneImage>
                    {!!previewImageProduct.length && (
                        <Accordion icon={<FaRegEye size='20' />} disableIconRotation>
                            <Accordion.Item mt='5%' label='Preview Image' style={{
                                borderBottomColor: 'transparent',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
                            }}>
                                <ScrollArea style={{ height: '50%' }} offsetScrollbars>
                                    <Grid mt='xs'>
                                        {previewImageProduct.map((file, fileIndex) => (
                                            <Col key={fileIndex} span={12} md={3} lg={3} sm={6}>
                                                <Center>
                                                    <Image
                                                        fit='cover'
                                                        radius='sm'
                                                        src={file.preview}
                                                        onClick={() => {
                                                            setShowPreviewProductModal(true)
                                                            setPreviewProduct(file.preview)
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
                    )}
                </Container>
                <PreviewImageModal
                    ref={modalPreviewRef}
                    isOpen={showPreviewModal}
                    setIsOpen={setShowPreviewModal}
                    source={previewImage}
                />
                <PreviewImageModal
                    ref={secondModalPreviewRef}
                    isOpen={showPreviewProductModal}
                    setIsOpen={setShowPreviewProductModal}
                    source={previewProduct}
                />
                <Button
                    type='submit'
                    mt='xl'
                    fullWidth
                    disabled={put?.isPending}
                    color='indigo'>
                    Submit
                </Button>
            </form>
        </Fragment>
    )
}
const CustomEditProductModalWithFormik = withFormik({
    enableReinitialize: true,
    validationSchema: productModel,
    displayName: 'EditProductModalForm',
    mapPropsToValues: (props) => ({
        name: props?.product?.name,
        description: props?.product?.description,
        price: props?.product?.price,
        category_id: props?.product?.category_id.toString(),
        seller_id: props?.product?.seller_id.toString(),
        category: props?.category,
        seller: props?.seller
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
        const data = {}
        const image = {}

        data.name = values?.name
        data.description = values?.description
        data.price = values?.price
        data.category_id = values?.category_id
        data.seller_id = values?.seller_id
        image.single = values?.single
        image.multiple = values?.multiple

        props.callback({
            id: props?.product?.id,
            value: createFormData(image, data)
        })

        setSubmitting(false)
    },
    validateOnBlur: false,
    validateOnChange: true
})(CustomEditProductModalWithFormikProps)
const CustomEditProductModal = forwardedRef(({
    isOpen,
    setIsOpen,
    product,
    category,
    seller,
    dispatchPutProductAction
}, ref) => {
    const theme = useMantineTheme()

    return (
        <Modal
            itemRef={ref}
            opened={isOpen}
            transition='skew-up'
            onClose={() => setIsOpen(false)}
            title='Edit Product'
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.95}
            size='xl'
            closeOnClickOutside={false}>
            <CustomEditProductModalWithFormik
                callback={(values) => dispatchPutProductAction(values)}
                product={product}
                category={category}
                seller={seller}
            />
        </Modal>
    )
})

export const EditProductModal = memo(CustomEditProductModal, shallowEqual)
