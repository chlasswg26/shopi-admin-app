import { Button, Input, InputWrapper, Modal, useMantineTheme, LoadingOverlay, Textarea } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { forwardRef, Fragment, memo } from 'react'
import { ErrorMessage, withFormik } from 'formik'
import { categoryModel } from '../../utils/schema'
import { useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'

const forwardedRef = forwardRef
const CustomEditCategoryModalWithFormikProps = ({
    errors,
    values,
    handleChange,
    handleSubmit
}) => {
    const { put } = useSelector(state => state.category, shallowEqualRedux)

    return (
        <Fragment>
            <LoadingOverlay visible={put?.isPending} />
            <form onSubmit={handleSubmit}>
                <InputWrapper
                    id='category-name-id'
                    required
                    label='Name'
                    description='Please enter category name'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='name' />}>
                    <Input
                        variant='filled'
                        id='input-category-name'
                        placeholder='Category name'
                        value={values.name}
                        name='name'
                        onChange={handleChange}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <Textarea
                    label='Description'
                    id='input-category-description'
                    placeholder='Category description'
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
const CustomEditCategoryModalWithFormik = withFormik({
    enableReinitialize: true,
    validationSchema: categoryModel,
    displayName: 'EditCategoryModalForm',
    mapPropsToValues: (props) => ({
        name: props?.category?.name,
        description: props?.category?.description
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
        props.callback({
            id: props?.category?.id,
            value: values
        })
        setSubmitting(false)
    },
    validateOnBlur: false,
    validateOnChange: true
})(CustomEditCategoryModalWithFormikProps)
const CustomEditCategoryModal = forwardedRef(({
    isOpen,
    setIsOpen,
    category,
    dispatchPutCategoryAction
}, ref) => {
    const theme = useMantineTheme()

    return (
        <Modal
            itemRef={ref}
            opened={isOpen}
            transition='skew-up'
            onClose={() => setIsOpen(false)}
            title='Edit Category'
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.95}
            size='xl'
            closeOnClickOutside={false}>
            <CustomEditCategoryModalWithFormik
                callback={(values) => dispatchPutCategoryAction(values)}
                category={category}
            />
        </Modal>
    )
})

export const EditCategoryModal = memo(CustomEditCategoryModal, shallowEqual)
