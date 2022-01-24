import { Button, Input, InputWrapper, Modal, useMantineTheme, LoadingOverlay, Textarea } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { forwardRef, Fragment, memo } from 'react'
import { ErrorMessage, withFormik } from 'formik'
import { categoryModel } from '../../utils/schema'
import { useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'

const forwardedRef = forwardRef
const CustomAddCategoryModalWithFormikProps = ({
    errors,
    values,
    handleChange,
    handleSubmit
}) => {
    const { post } = useSelector(state => state.category, shallowEqualRedux)

    return (
        <Fragment>
            <LoadingOverlay visible={post?.isPending} />
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
                        disabled={post?.isPending}
                    />
                </InputWrapper>
                <Textarea
                    label='Description'
                    id='input-category-description'
                    placeholder='Category description'
                    value={values.description}
                    name='description'
                    onChange={handleChange}
                    disabled={post?.isPending}
                    error={errors?.description ? <ErrorMessage name='description' /> : ''}
                    autosize
                    minRows={5}
                    maxRows={10}
                />
                <Button
                    type='submit'
                    mt='xl'
                    fullWidth
                    disabled={post?.isPending}
                    color='indigo'>
                    Submit
                </Button>
            </form>
        </Fragment>
    )
}
const CustomAddCategoryModalWithFormik = withFormik({
    validationSchema: categoryModel,
    displayName: 'AddCategoryModalForm',
    mapPropsToValues: () => ({
        name: '',
        description: ''
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
        props.callback(values)
        setSubmitting(false)
    },
    validateOnBlur: false,
    validateOnChange: true
})(CustomAddCategoryModalWithFormikProps)
const CustomAddCategoryModal = forwardedRef(({
    isOpen,
    setIsOpen,
    dispatchPostCategoryAction
}, ref) => {
    const theme = useMantineTheme()

    return (
        <Modal
            itemRef={ref}
            opened={isOpen}
            transition='skew-up'
            onClose={() => setIsOpen(false)}
            title='Add Category'
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.95}
            size='xl'
            closeOnClickOutside={false}>
            <CustomAddCategoryModalWithFormik callback={(values) => dispatchPostCategoryAction(values)} />
        </Modal>
    )
})

export const AddCategoryModal = memo(CustomAddCategoryModal, shallowEqual)
