import { Card, Text, Button, Image, Col, Grid, Spoiler, useMantineTheme, Box, Center, Pagination, Autocomplete, Menu, LoadingOverlay } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { useState, memo, createRef } from 'react'
import { AutoCompleteItem } from '../components/AutoCompleteItem'
import { BiSearch } from 'react-icons/bi'
import { PreviewImageModal } from '../components/PreviewImageModal'
import { EditBannerModal } from '../components/EditBannerModal'
import { useModals } from '@mantine/modals'
import { DialogBox } from '../components/DialogBox'

const Banner = () => {
    const theme = useMantineTheme()
    const secondaryColor = theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7]
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const autoCompleteItemRef = createRef()
    const modalPreviewRef = createRef()
    const editBannerModalRef = createRef()
    const bannerDialogRef = createRef()
    const modals = useModals()

    const openDeleteModal = () => modals.openConfirmModal({
        title: 'Delete your profile',
        centered: true,
        children: (
            <Text size="sm">
                Are you sure you want to delete <strong><b><i>{'Product 1'.toLocaleUpperCase()}</i></b></strong>? This
                action is destructive and data will lost forever.
            </Text>
        ),
        labels: { confirm: 'Delete account', cancel: 'No don\'t delete it' },
        confirmProps: { color: 'red' },
        onCancel: () => setShowDialog(true),
        onConfirm: () => setShowDialog(true)
    })

    return (
        <Box>
            <Center>
                <Autocomplete
                    placeholder="Search some data..."
                    rightSection={<BiSearch size={25} />}
                    itemComponent={AutoCompleteItem}
                    itemRef={autoCompleteItemRef}
                    limit={5}
                    radius='xl'
                    size='lg'
                    switchDirectionOnFlip={true}
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
                            <Image style={{
                                cursor: 'zoom-in'
                            }} onClick={() => setShowPreviewModal(true)} src="https://westmanga.info/wp-content/uploads/2021/08/A-Rank-Party-wo-Ridatsu-Shita-Ore-wa.jpg" height={160} alt="Norway" />
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
                                <Menu.Item onClick={() => setShowEditModal(true)} color='indigo'>Edit</Menu.Item>,
                                <Menu.Item onClick={() => openDeleteModal()} color="red">Delete</Menu.Item>
                            </Menu>
                        </Center>
                        <EditBannerModal
                            ref={editBannerModalRef}
                            isOpen={showEditModal}
                            setIsOpen={setShowEditModal}
                        />
                    </Card>
                </Col>
            </Grid>
            <Center mt='7%' mb='sm'>
                <Pagination total={10} withEdges />
            </Center>
            <PreviewImageModal
                ref={modalPreviewRef}
                isOpen={showPreviewModal}
                setIsOpen={setShowPreviewModal}
                source='https://westmanga.info/wp-content/uploads/2021/08/A-Rank-Party-wo-Ridatsu-Shita-Ore-wa.jpg'
            />
            <DialogBox
                ref={bannerDialogRef}
                isDialogOpen={showDialog}
                onDialogClose={() => setShowDialog(false)}
                status='200'
                message='Just a message'
            />
        </Box>
    )
}

export const BannerPage = memo(Banner, shallowEqual)
