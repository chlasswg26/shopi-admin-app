import { Button, Container, Input, Image, InputWrapper, Modal, useMantineTheme, Accordion, Grid, Col, ScrollArea, Center, LoadingOverlay, Text } from '@mantine/core'
import { shallowEqual, useShallowEffect } from '@mantine/hooks'
import { createRef, forwardRef, Fragment, memo, useState } from 'react'
import { DropzoneImage } from './DropzoneImage'
import { PreviewImageModal } from './PreviewImageModal'
import { FaRegEye } from 'react-icons/fa'
import { ErrorMessage, withFormik } from 'formik'
import { profileModel } from '../utils/schema'
import { useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { createFormData } from '../utils/form-data'

const forwardedRef = forwardRef
const CustomEditProfileModalWithFormikProps = ({
    values,
    handleChange,
    handleSubmit,
    setFieldValue
}) => {
    const [image, setImage] = useState({})
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const modalPreviewRef = createRef()
    const dropzoneProfileImageRef = createRef()
    const previewImage = image[0]?.preview
    const { update } = useSelector(state => state.account, shallowEqualRedux)

    useShallowEffect(() => setFieldValue('single', image[0], false), [image])

    return (
        <Fragment>
            <LoadingOverlay visible={update?.isPending} />
            <form onSubmit={handleSubmit}>
                <InputWrapper
                    id='profile-name-id'
                    required
                    label='Name'
                    description='Please enter profile name'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='name' />}>
                    <Input
                        variant='filled'
                        id='input-profile-name'
                        placeholder='Profile name'
                        value={values.name}
                        onChange={handleChange('name')}
                        disabled={update?.isPending}
                    />
                </InputWrapper>
                <InputWrapper
                    id='profile-phone-id'
                    required
                    label='Phone'
                    description='Please enter profile phone'
                    style={{
                        width: '100%'
                    }}
                    error={<ErrorMessage name='phone' />}>
                    <Input
                        type='number'
                        variant='filled'
                        id='input-profile-phone'
                        placeholder='Profile phone'
                        value={values.phone}
                        onChange={handleChange('phone')}
                        disabled={update?.isPending}
                    />
                </InputWrapper>
                <InputWrapper
                    id='profile-store-id'
                    required
                    label='Store'
                    description='Please enter profile store name'
                    style={{
                        width: '100%'
                    }}
                    error={<ErrorMessage name='store' />}>
                    <Input
                        variant='filled'
                        id='input-profile-store'
                        placeholder='Profile store name'
                        value={values.store}
                        onChange={handleChange('store')}
                        disabled={update?.isPending}
                    />
                </InputWrapper>
                <Container mt='xl'>
                    <DropzoneImage
                        ref={dropzoneProfileImageRef}
                        setPreview={setImage}
                        isMultiple={false}>
                        <Text size='xl' inline>
                            Drag image here or click to select file
                        </Text>
                        <Text size='sm' color='dimmed' inline mt={7}>
                            Attach only 1 file for profile image.
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
                    disabled={update?.isPending}
                    color='indigo'>
                    Submit
                </Button>
            </form>
        </Fragment>
    )
}
const CustomEditProfileModalWithFormik = withFormik({
    enableReinitialize: true,
    validationSchema: profileModel,
    displayName: 'EditProfileModalForm',
    mapPropsToValues: (props) => ({
        name: props?.profile?.name,
        phone: props?.profile?.phone,
        store: props?.profile?.store
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
        const data = {}
        const image = {}

        data.name = values?.name
        data.phone = values?.phone
        data.store = values?.store
        image.single = values?.single

        props.callback(createFormData(image, data))
        setSubmitting(false)
    },
    validateOnBlur: false,
    validateOnChange: true
})(CustomEditProfileModalWithFormikProps)
const CustomEditProfileModal = forwardedRef(({
    isOpen,
    setIsOpen,
    profile,
    dispatchUpdateProfileAction
}, ref) => {
    const theme = useMantineTheme()

    return (
        <Modal
            itemRef={ref}
            opened={isOpen}
            transition='skew-up'
            onClose={() => setIsOpen(false)}
            title='Edit Profile'
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.95}
            size='xl'
            closeOnClickOutside={false}>
            <CustomEditProfileModalWithFormik
                callback={(values) => dispatchUpdateProfileAction(values)}
                profile={profile}
            />
        </Modal>
    )
})

export const EditProfileModal = memo(CustomEditProfileModal, shallowEqual)
