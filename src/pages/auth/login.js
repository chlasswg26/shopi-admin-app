import { Button, Group, Container, Input, InputWrapper, Overlay, Paper, ScrollArea, Title, LoadingOverlay, useMantineTheme } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { memo } from 'react'

const Login = () => {
    const theme = useMantineTheme()

    return (
        <Container size='xl' padding='sm' fluid style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '95vh'
        }}>
            <Overlay opacity={0.8} gradient={`${theme.colorScheme === 'dark' ? 'linear-gradient(105deg, #343A40 1%, #7048E8 60%, #343A40 95%)' : 'linear-gradient(105deg, #fff 1%, #7048E8 60%, #fff 95%)'}`} zIndex={-1} />
            <Paper component={ScrollArea} padding='xl' shadow='xl' radius='md' style={{
                display: 'flex',
                width: '70%',
                height: '80%'
            }}>
                <LoadingOverlay visible />
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
                        label='Username'
                        description='Please enter your username account'
                        style={{
                            width: '40%'
                        }}
                        error='Your credit card expired'
                    >
                        <Input variant='filled' id='input-demo' placeholder='Your email' />
                    </InputWrapper>
                    <InputWrapper
                        id='user-passphrase'
                        required
                        label='Password'
                        description='Please enter your password account'
                        style={{
                            width: '40%'
                        }}
                        error='Your credit card expired'
                    >
                        <Input variant='filled' id='input-demo' placeholder='Your email' />
                    </InputWrapper>
                    <Button mt='3%' radius='md' size='md' uppercase sx={(theme) => ({
                        backgroundColor: theme.colorScheme === 'dark' ? '#6741D9' : '#101113',
                        '&:hover': {
                            backgroundColor:
                                theme.colorScheme === 'dark' ? '#5F3DC4' : '#25262B'
                        }
                    })}>
                        Log in
                    </Button>
                </Group>
            </Paper>
        </Container>
    )
}

export const LoginPage = memo(Login, shallowEqual)
