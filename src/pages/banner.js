import { Card, Text, Button, Image, Col, Grid, Spoiler, useMantineTheme, Box, Center, Pagination, Autocomplete, Menu, LoadingOverlay } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { useState, memo } from 'react'
import { AutoCompleteItem } from '../components/AutoCompleteItem'
import { BiSearch } from 'react-icons/bi'
import { PreviewImageModal } from '../components/PreviewImageModal'
import { useModals } from '@mantine/modals'
import { useNotifications } from '@mantine/notifications'

const Banner = () => {
    const theme = useMantineTheme()
    const secondaryColor = theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7]
    const [showModal, setShowModal] = useState(false)
    const modals = useModals()
    const notifications = useNotifications()
    const openDeleteModal = (subject = '') => modals.openConfirmModal({
        title: 'Delete banner',
        centered: true,
        children: (
            <Text size="sm">
                Are you sure you want to delete <strong><b><i>{subject.toLocaleUpperCase()}</i></b></strong>? This
                action is destructive and data will lost forever.
            </Text>
        ),
        labels: { confirm: 'Yes, delete banner', cancel: 'No, don\'t delete it' },
        confirmProps: { color: 'red' },
        onCancel: () => notifications.showNotification({
            title: 'Canceled',
            message: 'Delete banner was canceled',
            color: 'red',
            autoClose: false
        }),
        onConfirm: () => notifications.showNotification({
            title: 'Confirmed',
            message: 'Delete banner was confirmed',
            color: 'green',
            autoClose: false
        })
    })

    return (
        <Box>
            <Center>
                <Autocomplete
                    placeholder="Search some data..."
                    rightSection={
                        <BiSearch size={25} />
                    }
                    itemComponent={AutoCompleteItem}
                    radius='xl'
                    size='lg'
                    variant='filled'
                    data={[
                        {
                            image: 'avatar.png',
                            value: 'Bender Bending Rodríguez',
                            description: 'Fascinated with cooking, though has no sense of taste'
                        },
                        {
                            image: 'avatar.png',
                            value: 'Carol Miller',
                            description: 'One of the richest people on Earth'
                        }
                    ]}
                    filter={(value, item) =>
                        item.value.toLowerCase().includes(value.toLowerCase().trim()) ||
                        item.description.toLowerCase().includes(value.toLowerCase().trim())
                    }
                    style={{
                        width: '50%'
                    }}
                />
            </Center>
            <Grid mt='5%'>
                <Col span={12} md={3} lg={3} sm={6}>
                    <Card shadow="sm" padding="lg">
                        <LoadingOverlay visible={false} />
                        <Text lineClamp={2}>
                            Card Title
                        </Text>

                        <Card.Section m='xs'>
                            <Image onClick={() => setShowModal(true)} fit='contain' src="https://westmanga.info/wp-content/uploads/2021/08/A-Rank-Party-wo-Ridatsu-Shita-Ore-wa.jpg" height={160} alt="Norway" />
                        </Card.Section>

                        <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5, marginTop: theme.spacing.sm }}>
                            <Spoiler maxHeight={55} showLabel="more..." hideLabel="...less">
                                    With Fjord Tours you can explore more of the magical fjord landscapes with tours and
                                    activities on and around the fjords of Norway
                            </Spoiler>
                        </Text>

                        <Center>
                            <Menu placement='center' shadow='lg' size='xl' withArrow control={
                                <Button variant="light" color="blue" fullWidth style={{ marginTop: 14 }}>
                                    Menu
                                </Button>
                            }>
                                <Menu.Label>Choose an action</Menu.Label>
                                <Menu.Item color='indigo'>Edit</Menu.Item>,
                                <Menu.Item onClick={() => openDeleteModal('Product 1')} color="red">Delete</Menu.Item>
                            </Menu>
                        </Center>
                    </Card>
                </Col>
            </Grid>
            <Center mt='7%' mb='sm'>
                <Pagination total={10} withEdges />
            </Center>
            <PreviewImageModal
                isOpen={showModal}
                setIsOpen={setShowModal}
                source='https://westmanga.info/wp-content/uploads/2021/08/A-Rank-Party-wo-Ridatsu-Shita-Ore-wa.jpg'
            />
        </Box>
    )
}

export const BannerPage = memo(Banner, shallowEqual)
