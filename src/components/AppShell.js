import { Fragment, memo, useState, createRef, useRef, useEffect } from 'react'
import { AppShell as MantineAppShell, Text, Header, MediaQuery, Burger, Navbar, ScrollArea, Group, Box, Image, ThemeIcon, Title, SegmentedControl, Center, Divider, Avatar, Breadcrumbs, Anchor, UnstyledButton, Menu } from '@mantine/core'
import { BiCarousel, BiCategoryAlt, BiHistory, BiMoon, BiSun } from 'react-icons/bi'
import { GiSuitcase } from 'react-icons/gi'
import { FiChevronRight } from 'react-icons/fi'
import { useDocumentTitle } from '@mantine/hooks'
import AppLogo from '../assets/images/logo.png'
import { useSelector, shallowEqual as shallowEqualRedux, useDispatch } from 'react-redux'
import { lightTheme, darkTheme } from '../redux/reducer/theme'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { EditProfileModal } from './EditProfileModal'
import { logoutActionCreator } from '../redux/action/creator/auth'
import { accountProfileActionCreator, accountUpdateActionCreator } from '../redux/action/creator/account'

const { REACT_APP_NAME } = process.env
const segmentedControlData = [
    {
        value: 'dark',
        label: (
            <Center>
                <ThemeIcon variant='gradient' gradient={{ from: 'grape', to: 'violet', deg: 70 }} radius='lg'>
                    <BiMoon size='20' color='#131a3d' />
                </ThemeIcon>
                <Text ml={5}>Dark</Text>
            </Center>
        )
    },
    {
        value: 'light',
        label: (
            <Center>
                <ThemeIcon variant='gradient' gradient={{ from: 'orange', to: 'yellow', deg: 70 }} radius='lg'>
                    <BiSun size='20' color='#ffea05' />
                </ThemeIcon>
                <Text ml={5}>Light</Text>
            </Center>
        )
    }
]

const CustomAppShell = () => {
    const [opened, setOpened] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const { theme, account: { profile, update } } = useSelector(state => ({
        theme: state.theme,
        account: state.account
    }), shallowEqualRedux)
    const dispatch = useDispatch()
    const toggleTheme = (value) => value === 'dark' ? dispatch(darkTheme()) : dispatch(lightTheme())
    const editModalRef = createRef()
    const { pathname } = useLocation()
    const [breadcrumbItems, setBreadcrumbItems] = useState([])
    const mounted = useRef()
    const isUpdateFulfilled = update?.isFulfilled
    const profileResponse = profile?.response
    const [accountInfo, setAccountInfo] = useState({})

    useDocumentTitle(`${REACT_APP_NAME} - App`)

    useEffect(() => {
        if (pathname !== '/') {
            setBreadcrumbItems([
                { title: REACT_APP_NAME, href: '/' },
                { title: 'DASHBOARD', href: '/' },
                { title: pathname.replace('/', '').toUpperCase(), href: pathname }
            ])
        } else {
            setBreadcrumbItems([
                { title: REACT_APP_NAME, href: '/' },
                { title: 'DASHBOARD', href: '/' }
            ])
        }

        if (!Object.keys(profile).length) dispatch(accountProfileActionCreator())
    }, [pathname, profile])

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
        } else {
            if (isUpdateFulfilled) dispatch(accountProfileActionCreator())
        }
    }, [isUpdateFulfilled])

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
        } else {
            if (profileResponse) setAccountInfo(profileResponse)
        }
    }, [profileResponse])

    return (
        <Fragment>
            <MantineAppShell
                navbarOffsetBreakpoint={!opened ? 'xl' : 'sm'}
                fixed
                navbar={
                    <Navbar
                        padding='md'
                        hiddenBreakpoint='xl'
                        hidden={!opened}
                        fixed
                        position={{ top: 0, left: 0 }}
                        width={{ sm: 200, lg: 300 }}>
                        <Navbar.Section
                            grow
                            component={ScrollArea}
                            ml={-10}
                            mr={-10}
                            mt='sm'
                            sx={{ paddingLeft: 10, paddingRight: 10 }}>
                            <Group grow direction='column' spacing={0}>
                                <Box
                                    component={Link}
                                    to='/banner'
                                    sx={(theme) => ({
                                        display: 'block',
                                        color: theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[7],
                                        textAlign: 'center',
                                        padding: theme.spacing.xs,
                                        borderRadius: theme.radius.md,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            backgroundColor:
                                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
                                        }
                                    })}>
                                    <Group spacing='sm'>
                                        <ThemeIcon variant='gradient' gradient={{ from: 'orange', to: 'blue', deg: 60 }}>
                                            <BiCarousel size='17' />
                                        </ThemeIcon>
                                        <Text weight={500}>
                                            Banner
                                        </Text>
                                    </Group>
                                </Box>
                                <Box
                                    component={Link}
                                    to='/category'
                                    sx={(theme) => ({
                                        display: 'block',
                                        color: theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[7],
                                        textAlign: 'center',
                                        padding: theme.spacing.xs,
                                        borderRadius: theme.radius.md,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            backgroundColor:
                                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
                                        }
                                    })}>
                                    <Group spacing='sm'>
                                        <ThemeIcon variant='gradient' gradient={{ from: 'dark', to: 'lime', deg: 105 }}>
                                            <BiCategoryAlt size='17' />
                                        </ThemeIcon>
                                        <Text weight={500}>
                                            Category
                                        </Text>
                                    </Group>
                                </Box>
                                <Box
                                    component='a'
                                    href='https://mantine.dev'
                                    target='_blank'
                                    sx={(theme) => ({
                                        display: 'block',
                                        color: theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[7],
                                        textAlign: 'center',
                                        padding: theme.spacing.xs,
                                        borderRadius: theme.radius.md,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            backgroundColor:
                                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
                                        }
                                    })}>
                                    <Group spacing='sm'>
                                        <ThemeIcon variant='gradient' gradient={{ from: 'dark', to: 'white', deg: 60 }}>
                                            <GiSuitcase size='17' />
                                        </ThemeIcon>
                                        <Text weight={500}>
                                            Product
                                        </Text>
                                    </Group>
                                </Box>
                                <Box
                                    component='a'
                                    href='https://mantine.dev'
                                    target='_blank'
                                    sx={(theme) => ({
                                        display: 'block',
                                        color: theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[7],
                                        textAlign: 'center',
                                        padding: theme.spacing.xs,
                                        borderRadius: theme.radius.md,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            backgroundColor:
                                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
                                        }
                                    })}>
                                    <Group spacing='sm'>
                                        <ThemeIcon variant='gradient' gradient={{ from: 'indigo', to: 'violet' }}>
                                            <BiHistory size='17' />
                                        </ThemeIcon>
                                        <Text weight={500}>
                                            Transaction
                                        </Text>
                                    </Group>
                                </Box>
                            </Group>
                        </Navbar.Section>

                        <Navbar.Section>
                            <Divider mb='md' />
                            <Menu style={{
                                width: '100%'
                            }} placement='center' shadow='xl' withArrow control={
                                <UnstyledButton
                                    mb='xs'
                                    sx={(theme) => ({
                                        display: 'block',
                                        width: '100%',
                                        padding: theme.spacing.md,
                                        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                                        borderRadius: 20,
                                        '&:hover': {
                                            backgroundColor:
                                                theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3]
                                        }
                                    })}>
                                    <Group>
                                        <Avatar src={profile?.response?.image} alt='User Avatar' radius="xl" />

                                        <div style={{ flex: 1, width: '25%' }}>
                                            <Text size="sm" weight={500} lineClamp={2}>
                                                {profile?.response?.name}
                                            </Text>

                                            <Text color="dimmed" size="xs" lineClamp={2}>
                                                {profile?.response?.email}
                                            </Text>
                                        </div>

                                        <FiChevronRight />
                                    </Group>
                                </UnstyledButton>
                            }>
                                <Menu.Label>Choose an action</Menu.Label>
                                <Menu.Item onClick={() => setShowEditModal(true)} color='indigo'>Edit Profile</Menu.Item>,
                                <Menu.Item onClick={() => dispatch(logoutActionCreator())} color="red">Sign Out</Menu.Item>
                            </Menu>
                            {showEditModal && (
                                <EditProfileModal
                                    ref={editModalRef}
                                    isOpen={showEditModal}
                                    setIsOpen={setShowEditModal}
                                    profile={accountInfo}
                                    dispatchUpdateProfileAction={(values) => dispatch(accountUpdateActionCreator(values))}
                                />
                            )}
                        </Navbar.Section>
                    </Navbar>
                }
                header={
                    <Header height={70} padding='md' style={{
                        justifyContent: 'space-between',
                        display: 'flex'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <MediaQuery largerThan='xl' styles={{ display: 'none' }}>
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size='sm'
                                    mr='xl'
                                />
                            </MediaQuery>

                            <Group spacing={5} align='center'>
                                <Image
                                    fit='contain'
                                    height={40}
                                    src={AppLogo}
                                />
                                <Title order={3}>
                                    Shopi
                                </Title>
                            </Group>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <SegmentedControl
                                data={segmentedControlData}
                                size='sm'
                                defaultValue={theme.mode}
                                transitionDuration={500}
                                transitionTimingFunction='linear'
                                radius='lg'
                                mr='xs'
                                onChange={(value) => toggleTheme(value)}
                            />
                        </div>
                    </Header>
                }>
                <Breadcrumbs mb='3%'>
                    {breadcrumbItems.map((item, index) => (
                        <Anchor href={item.href} key={index} style={{
                            textDecoration: 'none'
                        }}>
                            {item.title}
                        </Anchor>
                    ))}
                </Breadcrumbs>
                <Outlet />
            </MantineAppShell>
        </Fragment>
    )
}

export const AppShell = memo(CustomAppShell)
