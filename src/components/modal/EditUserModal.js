import { Button, Container, Input, Image, InputWrapper, Modal, useMantineTheme, Accordion, Grid, Col, ScrollArea, Center, LoadingOverlay, Text, PasswordInput, Select } from '@mantine/core'
import { shallowEqual, useDidUpdate } from '@mantine/hooks'
import { createRef, forwardRef, Fragment, memo, useState } from 'react'
import { DropzoneImage } from '../DropzoneImage'
import { PreviewImageModal } from './PreviewImageModal'
import { FaRegEye } from 'react-icons/fa'
import { ErrorMessage, withFormik } from 'formik'
import { userModel } from '../../utils/schema'
import { useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { createFormData } from '../../utils/form-data'

const forwardedRef = forwardRef
const CustomEditUserModalWithFormikProps = ({
    errors,
    values,
    handleChange,
    handleSubmit,
    setFieldValue
}) => {
    const [image, setImage] = useState({})
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const modalPreviewRef = createRef()
    const dropzoneUserImageRef = createRef()
    const previewImage = image[0]?.preview
    const { put } = useSelector(state => state.user, shallowEqualRedux)

    useDidUpdate(() => setFieldValue('single', image[0], false), [image])

    return (
        <Fragment>
            <LoadingOverlay visible={put?.isPending} />
            <form onSubmit={handleSubmit}>
                <InputWrapper
                    id='user-name-id'
                    required
                    label='Name'
                    description='Please enter user name'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='name' />}>
                    <Input
                        variant='filled'
                        id='input-user-name'
                        placeholder='User name'
                        value={values.name}
                        onChange={handleChange('name')}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <InputWrapper
                    id='user-email-id'
                    required
                    label='E-Mail'
                    description='Please enter user e-mail'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='email' />}>
                    <Input
                        type='email'
                        variant='filled'
                        id='input-user-email'
                        placeholder='User e-mail'
                        value={values.email}
                        onChange={handleChange('email')}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <PasswordInput
                    id='input-password'
                    placeholder='Your Password'
                    label='Password'
                    description='Please enter your password account'
                    variant='filled'
                    disabled={put?.isPending}
                    error={errors.password ? <ErrorMessage name='password' /> : ''}
                    value={values.password}
                    onChange={handleChange('password')}
                />
                <InputWrapper
                    id='user-phone-id'
                    label='Phone'
                    description='Please enter user phone'
                    style={{
                        width: '100%'
                    }}
                    error={<ErrorMessage name='phone' />}>
                    <Input
                        type='number'
                        variant='filled'
                        id='input-user-phone'
                        placeholder='User phone'
                        value={values.phone}
                        onChange={handleChange('phone')}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <InputWrapper
                    id='user-store-id'
                    label='Store'
                    description='Please enter user store name'
                    style={{
                        width: '100%'
                    }}
                    error={<ErrorMessage name='store' />}>
                    <Input
                        variant='filled'
                        id='input-user-store'
                        placeholder='User store name'
                        value={values.store}
                        onChange={handleChange('store')}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <InputWrapper
                    id='user-balance-id'
                    label='Balance'
                    description='Please enter user balance'
                    style={{
                        width: '100%'
                    }}
                    error={<ErrorMessage name='balance' />}>
                    <Input
                        type='number'
                        variant='filled'
                        id='input-user-balance'
                        placeholder='User balance'
                        value={values.balance}
                        onChange={handleChange('balance')}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <Select
                    label='Choose Role'
                    placeholder='Pick one'
                    searchable
                    nothingFound='No options'
                    value={values.role}
                    onChange={(value) => setFieldValue('role', value, false)}
                    data={[
                        { value: 'CUSTOMER', label: 'Customer' },
                        { value: 'SELLER', label: 'Seller' },
                        { value: 'ADMIN', label: 'Admin' }
                    ]}
                />
                <Container mt='xl'>
                    <DropzoneImage
                        ref={dropzoneUserImageRef}
                        setPreview={setImage}
                        isMultiple={false}>
                        <Text size='xl' inline>
                            Drag image here or click to select file
                        </Text>
                        <Text size='sm' color='dimmed' inline mt={7}>
                            Attach only 1 file for user avatar image.
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
const CustomEditUserModalWithFormik = withFormik({
    enableReinitialize: true,
    validationSchema: userModel,
    displayName: 'EditUserModalForm',
    mapPropsToValues: (props) => ({
        name: props?.user?.name,
        email: props?.user?.email,
        password: '',
        phone: props?.user?.phone,
        store: props?.user?.store,
        balance: parseInt(props?.user?.balance),
        role: props?.user?.role
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
        const data = {}
        const image = {}

        if (values?.password) data.password = values?.password

        data.name = values?.name
        data.email = values?.email
        data.phone = values?.phone
        data.store = values?.store
        data.balance = parseInt(values?.balance)
        data.role = values?.role.toUpperCase()
        image.single = values?.single

        props.callback({
            id: props?.user?.id,
            value: createFormData(image, data)
        })
        setSubmitting(false)
    },
    validateOnBlur: false,
    validateOnChange: false
})(CustomEditUserModalWithFormikProps)
const CustomEditUserModal = forwardedRef(({
    isOpen,
    setIsOpen,
    user,
    dispatchUpdateUserAction
}, ref) => {
    const theme = useMantineTheme()

    return (
        <Modal
            itemRef={ref}
            opened={isOpen}
            transition='skew-up'
            onClose={() => setIsOpen(false)}
            title='Edit User'
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.95}
            size='xl'
            closeOnClickOutside={false}>
            <CustomEditUserModalWithFormik
                callback={(values) => dispatchUpdateUserAction(values)}
                user={user}
            />
        </Modal>
    )
})

export const EditUserModal = memo(CustomEditUserModal, shallowEqual)
