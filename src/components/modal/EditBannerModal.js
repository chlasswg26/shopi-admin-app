import { Button, Container, Input, Image, InputWrapper, Modal, Textarea, useMantineTheme, Accordion, Grid, Col, ScrollArea, Center, Text, LoadingOverlay } from '@mantine/core'
import { shallowEqual, useDidUpdate } from '@mantine/hooks'
import { createRef, forwardRef, Fragment, memo, useState } from 'react'
import { DropzoneImage } from '../DropzoneImage'
import { PreviewImageModal } from './PreviewImageModal'
import { FaRegEye } from 'react-icons/fa'
import { withFormik, ErrorMessage } from 'formik'
import { createFormData } from '../../utils/form-data'
import { bannerModel } from '../../utils/schema'
import { useSelector } from 'react-redux'

const forwardedRef = forwardRef
const CustomEditBannerModalWithFormikProps = ({
    errors,
    values,
    handleChange,
    handleSubmit,
    setFieldValue
}) => {
    const [image, setImage] = useState({})
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const modalPreviewRef = createRef()
    const dropzoneBannerImageRef = createRef()
    const previewImage = image[0]?.preview
    const { put } = useSelector(state => state.banner, shallowEqual)

    useDidUpdate(() => setFieldValue('single', image[0], false), [image])

    return (
        <Fragment>
            <LoadingOverlay visible={put?.isPending} />
            <form onSubmit={handleSubmit}>
                <InputWrapper
                    id='banner-name-id'
                    required
                    label='Name'
                    description='Please enter banner name'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='name' />}>
                    <Input
                        variant='filled'
                        id='input-banner-name'
                        placeholder='Banner name'
                        value={values.name}
                        name='name'
                        onChange={handleChange}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <Textarea
                    label='Description'
                    id='input-banner-description'
                    placeholder='Banner description'
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
                    id='banner-uri-id'
                    required
                    label='URI/Deeplink'
                    description='Please enter banner URI/Deeplink'
                    style={{
                        width: '100%'
                    }}
                    error={<ErrorMessage name='uri' />}>
                    <Input
                        variant='filled'
                        id='input-banner-uri'
                        placeholder='Banner URI/Deeplink'
                        value={values.uri}
                        name='uri'
                        onChange={handleChange}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <Container mt='xl'>
                    <DropzoneImage
                        ref={dropzoneBannerImageRef}
                        setPreview={setImage}
                        isMultiple={false}>
                        <Text size='xl' inline>
                            Drag image here or click to select file
                        </Text>
                        <Text size='sm' color='dimmed' inline mt={7}>
                            Attach only 1 file for banner image.
                        </Text>
                    </DropzoneImage>
                    {image.length && (
                        <Accordion icon={<FaRegEye size='20' />} disableIconRotation>
                            <Accordion.Item mt='5%' label='View Image' style={{
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
                                                        onClick={() => setShowPreviewModal(true)}
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
const CustomEditBannerModalWithFormik = withFormik({
    enableReinitialize: true,
    validationSchema: bannerModel,
    displayName: 'EditBannerModalForm',
    mapPropsToValues: (props) => ({
        name: props?.banner?.name,
        description: props?.banner?.description,
        uri: props?.banner?.uri
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
        const data = {}
        const image = {}

        data.name = values?.name
        data.description = values?.description
        data.uri = values?.uri
        image.single = values?.single

        props.callback({
            id: props?.banner?.id,
            value: createFormData(image, data)
        })

        setSubmitting(false)
    },
    validateOnBlur: false,
    validateOnChange: true
})(CustomEditBannerModalWithFormikProps)
const CustomEditBannerModal = forwardedRef(({
    isOpen,
    setIsOpen,
    banner,
    dispatchPutBannerAction
}, ref) => {
    const theme = useMantineTheme()

    return (
        <Modal
            itemRef={ref}
            opened={isOpen}
            transition='skew-up'
            onClose={() => setIsOpen(false)}
            title='Edit Banner'
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.95}
            size='xl'
            closeOnClickOutside={false}>
            <CustomEditBannerModalWithFormik
                callback={(values) => dispatchPutBannerAction(values)}
                banner={banner}
            />
        </Modal>
    )
})

export const EditBannerModal = memo(CustomEditBannerModal, shallowEqual)
