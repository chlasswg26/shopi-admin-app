import { createRef, Fragment } from 'react'
import { MantineProvider, Overlay } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { useSelector } from 'react-redux'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { LoginPage } from './pages/auth/login'
import { BannerPage } from './pages/banner'
import { CategoryPage } from './pages/category'
import { DialogBox } from './components/DialogBox'
import { RequireAuth } from './router/requireAuth'
import { UnnecessaryAuth } from './router/UnnecessaryAuth'

const App = () => {
    const theme = useSelector(state => state.theme)
    const lostPageDialogRef = createRef()

    return (
        <MantineProvider theme={{
            colorScheme: theme.mode,
            loader: 'bars'
        }} withGlobalStyles>
            <ModalsProvider>
                <Routes>
                    <Route path='/' element={
                        <RequireAuth>
                            <AppShell />
                        </RequireAuth>
                    }>
                        <Route index path='/banner' element={<BannerPage />} />
                        <Route path='/category' element={<CategoryPage />} />
                    </Route>
                    {['/auth', '/auth/signin'].map((page, pageIndex) => <Route key={pageIndex} path={page} element={
                        pageIndex === 0 ? <Navigate to={page[1]} replace /> : (
                            <UnnecessaryAuth>
                                <LoginPage />
                            </UnnecessaryAuth>
                        )
                    } />)}
                    <Route path='*' element={
                        <Fragment>
                            <DialogBox
                                ref={lostPageDialogRef}
                                isDialogOpen={true}
                                onDialogClose={() => alert('You can\'t close these notification, just leave this page.')}
                                status={500}
                                message='Page not found'
                            />
                            <Overlay opacity={0.8} gradient={`${theme.mode === 'dark' ? 'linear-gradient(105deg, #343A40 1%, #7048E8 60%, #343A40 95%)' : 'linear-gradient(105deg, #fff 1%, #7048E8 60%, #fff 95%)'}`} zIndex={-1} />
                        </Fragment>
                    } />
                </Routes>
            </ModalsProvider>
        </MantineProvider>
    )
}

export default App
