import { Button, Input, InputWrapper, Modal, useMantineTheme, LoadingOverlay, Textarea, Select } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { forwardRef, Fragment, memo } from 'react'
import { withFormik } from 'formik'
import { useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'

const forwardedRef = forwardRef
const CustomEditTransactionModalWithFormikProps = ({
    errors,
    values,
    handleChange,
    handleSubmit,
    setFieldValue
}) => {
    const { put } = useSelector(state => state.transaction, shallowEqualRedux)

    return (
        <Fragment>
            <LoadingOverlay visible={put?.isPending} />
            <form onSubmit={handleSubmit}>
                <InputWrapper label='Customer' style={{ width: '100%' }}>
                    <Input
                        variant='filled'
                        value={values.transaction.customer.name}
                        disabled={true}
                    />
                </InputWrapper>
                <InputWrapper label='Seller' style={{ width: '100%' }}>
                    <Input
                        variant='filled'
                        value={values.transaction.product.seller.name}
                        disabled={true}
                    />
                </InputWrapper>
                <InputWrapper label='Customer' style={{ width: '100%' }}>
                    <Input
                        variant='filled'
                        value={values.transaction.customer.name}
                        disabled={true}
                    />
                </InputWrapper>
                <InputWrapper label='Product' style={{ width: '100%' }}>
                    <Input
                        variant='filled'
                        value={values.transaction.product.name}
                        disabled={true}
                    />
                </InputWrapper>
                <InputWrapper label='Category' style={{ width: '100%' }}>
                    <Input
                        variant='filled'
                        value={values.transaction.product.category.name}
                        disabled={true}
                    />
                </InputWrapper>
                <InputWrapper label='Price' style={{ width: '100%' }}>
                    <Input
                        variant='filled'
                        value={values.transaction.price}
                        disabled={true}
                    />
                </InputWrapper>
                <InputWrapper label='Quantity' style={{ width: '100%' }}>
                    <Input
                        variant='filled'
                        value={values.transaction.quantity}
                        disabled={true}
                    />
                </InputWrapper>
                <Textarea
                    label='Detail'
                    variant='filled'
                    value={values.transaction.detail}
                    autosize
                    disabled={true}
                    minRows={5}
                    maxRows={10}
                />
                <Select
                    label='Transaction Status'
                    placeholder='Pick one'
                    searchable
                    nothingFound='No options'
                    value={values.status}
                    onChange={(value) => setFieldValue('status', value, false)}
                    data={[
                        {
                            value: 'PENDING',
                            label: 'PENDING'
                        },
                        {
                            value: 'PACKED',
                            label: 'PACKED'
                        },
                        {
                            value: 'SENT',
                            label: 'SENT'
                        },
                        {
                            value: 'DELIVERED',
                            label: 'DELIVERED'
                        }
                    ]}
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
const CustomEditTransactionModalWithFormik = withFormik({
    enableReinitialize: true,
    displayName: 'EditTransactionModalForm',
    mapPropsToValues: (props) => ({
        status: props?.transaction?.status,
        transaction: props?.transaction
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
        const data = {}

        data.status = values?.status

        props.callback({
            id: props?.transaction?.id,
            value: data
        })
        setSubmitting(false)
    },
    validateOnBlur: false,
    validateOnChange: false
})(CustomEditTransactionModalWithFormikProps)
const CustomEditTransactionModal = forwardedRef(({
    isOpen,
    setIsOpen,
    transaction,
    dispatchPutTransactionAction
}, ref) => {
    const theme = useMantineTheme()

    return (
        <Modal
            itemRef={ref}
            opened={isOpen}
            transition='skew-up'
            onClose={() => setIsOpen(false)}
            title='Edit Transaction'
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.95}
            size='xl'
            closeOnClickOutside={false}>
            <CustomEditTransactionModalWithFormik
                callback={(values) => dispatchPutTransactionAction(values)}
                transaction={transaction}
            />
        </Modal>
    )
})

export const EditTransactionModal = memo(CustomEditTransactionModal, shallowEqual)
