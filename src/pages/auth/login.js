import { Button, Group, Box, Input, InputWrapper, Overlay, Paper, ScrollArea, Title, LoadingOverlay, useMantineTheme, PasswordInput } from '@mantine/core'
import { shallowEqual, useDidUpdate, useDocumentTitle } from '@mantine/hooks'
import { ErrorMessage, withFormik } from 'formik'
import { createRef, memo, useState } from 'react'
import { signInModel } from '../../utils/schema'
import { useDispatch, useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { loginActionCreator } from '../../redux/action/creator/auth'
import { DialogBox } from '../../components/DialogBox'

const { REACT_APP_NAME } = process.env
const LoginWithFormikProps = ({
    errors,
    values,
    handleChange,
    handleSubmit
}) => {
    const theme = useMantineTheme()
    const auth = useSelector(state => state.auth, shallowEqualRedux)
    const [showLoginDialog, setShowLoginDialog] = useState(false)
    const [showUnauthorizedDialog, setShowUnauthorizedDialog] = useState(false)
    const loginDialogRef = createRef()
    const unauthorizedDialogRef = createRef()

    useDocumentTitle(`${REACT_APP_NAME} - SIGN IN`)

    useDidUpdate(() => {
        if (auth.login?.isRejected) setShowLoginDialog(true)
        if (auth.login?.isFulfilled && auth.login?.response?.role !== 'ADMIN') setShowUnauthorizedDialog(true)
    }, [auth])

    return (
        <Box style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <Overlay opacity={0.8} gradient={`${theme.colorScheme === 'dark' ? 'linear-gradient(105deg, #343A40 1%, #7048E8 60%, #343A40 95%)' : 'linear-gradient(105deg, #fff 1%, #7048E8 60%, #fff 95%)'}`} zIndex={-1} />
            <Paper component={ScrollArea} padding='xl' shadow='xl' radius='md' style={{
                display: 'flex',
                width: theme.breakpoints.xs,
                height: '70%'
            }}>
                <LoadingOverlay visible={auth.login?.isPending} />
                <form onSubmit={handleSubmit}>
                    <Group grow position='center' direction='column' align='center' style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Title order={2} mb='3%'>
                            Sign in
                        </Title>
                        <InputWrapper
                            id='user-id'
                            required
                            label='E-Mail'
                            description='Please enter your e-mail account'
                            error={<ErrorMessage name='email' />}
                            style={{ width: '70%' }}>
                            <Input
                                type='email'
                                variant='filled'
                                id='input-email'
                                disabled={auth.login?.isPending}
                                placeholder='Your e-mail'
                                value={values.email}
                                onChange={handleChange('email')}
                            />
                        </InputWrapper>
                        <PasswordInput
                            id='input-password'
                            placeholder='Your Password'
                            label='Password'
                            description='Please enter your password account'
                            variant='filled'
                            disabled={auth.login?.isPending}
                            required
                            error={errors.password ? <ErrorMessage name='password' /> : ''}
                            value={values.password}
                            onChange={handleChange('password')}
                            style={{ width: '70%' }}
                        />
                        <Button
                            type='submit'
                            mt='3%'
                            radius='md'
                            size='md'
                            disabled={auth.login?.isPending}
                            uppercase sx={(theme) => ({
                                display: 'flex',
                                backgroundColor: theme.colorScheme === 'dark' ? '#6741D9' : '#101113',
                                '&:hover': {
                                    backgroundColor:
                                        theme.colorScheme === 'dark' ? '#5F3DC4' : '#25262B'
                                }
                            })}>
                            Log in
                        </Button>
                    </Group>
                    <DialogBox
                        ref={loginDialogRef}
                        isDialogOpen={showLoginDialog}
                        onDialogClose={() => setShowLoginDialog(false)}
                        status={auth.login?.statusCode}
                        message={auth.login?.errorMessage}
                    />
                    <DialogBox
                        ref={unauthorizedDialogRef}
                        isDialogOpen={showUnauthorizedDialog}
                        onDialogClose={() => setShowUnauthorizedDialog(false)}
                        status={500}
                        message={'Access denied, you\'re not administrator'}
                    />
                </form>
            </Paper>
        </Box>
    )
}
const LoginWithFormik = withFormik({
    validationSchema: signInModel,
    displayName: 'LoginForm',
    mapPropsToValues: () => ({ email: '', password: '' }),
    handleSubmit: (values, { setSubmitting, props }) => {
        props.callback(values)
        setSubmitting(false)
    },
    validateOnBlur: false,
    validateOnChange: false
})(LoginWithFormikProps)
const Login = () => {
    const dispatch = useDispatch()

    return <LoginWithFormik callback={(values) => dispatch(loginActionCreator(values))} />
}

export const LoginPage = memo(Login, shallowEqual)
