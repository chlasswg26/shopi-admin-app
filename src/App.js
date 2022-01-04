import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { LoginPage } from './pages/auth/login'
import { BannerPage } from './pages/banner'

const App = () => {
    const theme = useSelector(state => state.theme)

    return (
        <MantineProvider theme={{
            colorScheme: theme.mode,
            loader: 'bars'
        }} withGlobalStyles>
            <ModalsProvider>
                <NotificationsProvider position='bottom-center'>
                    <Routes>
                        <Route path='/' element={<AppShell />}>
                            <Route index />
                            <Route path='/banner' element={<BannerPage />} />
                        </Route>
                        <Route path='/auth'>
                            <Route index element={<Navigate to='./signin' />} />
                            <Route path='signin' element={<LoginPage />} />
                        </Route>
                    </Routes>
                </NotificationsProvider>
            </ModalsProvider>
        </MantineProvider>
    )
}

export default App
