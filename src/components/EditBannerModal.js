import { Button, Container, Input, Image, InputWrapper, Modal, useMantineTheme, Accordion, Grid, Col, ScrollArea, Center, Text } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { createRef, forwardRef, Fragment, memo, useState } from 'react'
import { DropzoneImage } from './DropzoneImage'
import { PreviewImageModal } from './PreviewImageModal'
import { FaRegEye, FaRegWindowClose } from 'react-icons/fa'

const forwardedRef = forwardRef
const CustomEditBannerModal = forwardedRef(({ isOpen, setIsOpen }, ref) => {
    const theme = useMantineTheme()
    const [image, setImage] = useState({})
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const modalPreviewRef = createRef()
    const dropzoneBannerImageRef = createRef()
    const previewImage = image[0]?.preview
    const [viewImage, setViewImage] = useState(false)

    return (
        <Fragment>
            <Modal
                itemRef={ref}
                opened={isOpen}
                transition='skew-up'
                onClose={() => setIsOpen(false)}
                title="Edit Banner"
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.95}
                size='xl'
                closeOnClickOutside={false}>
                <InputWrapper
                    id='banner-name-id'
                    required
                    label='Name'
                    description='Please enter banner Name/Title'
                    style={{
                        width: '100%'
                    }}
                    error='Your credit card expired'
                >
                    <Input variant='filled' id='input-banner-name' placeholder='Banner Name/Title' />
                </InputWrapper>
                <InputWrapper
                    id='banner-description-id'
                    required
                    label='Description'
                    description='Please enter banner description'
                    style={{
                        width: '100%'
                    }}
                    error='Your credit card expired'
                >
                    <Input variant='filled' id='input-banner-description' placeholder='Banner descriptions' />
                </InputWrapper>
                <InputWrapper
                    id='banner-uri-id'
                    required
                    label='URI'
                    description='Please enter banner URI/Deeplink'
                    style={{
                        width: '100%'
                    }}
                    error='Your credit card expired'
                >
                    <Input variant='filled' id='input-banner-uri' placeholder='Banner URI/Deeplink' />
                </InputWrapper>
                <Container mt='xl'>
                    <DropzoneImage
                        ref={dropzoneBannerImageRef}
                        setPreview={setImage}
                        isMultiple={false}>
                        <Text size="xl" inline>
                            Drag image here or click to select file
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                            Attach only 1 file for banner image.
                        </Text>
                    </DropzoneImage>
                    {image.length && (
                        <Accordion icon={viewImage ? <FaRegWindowClose size='20' /> : <FaRegEye size='20' />} onClick={() => setViewImage(!viewImage)} disableIconRotation>
                            <Accordion.Item mt='5%' label="View Image" style={{
                                borderBottomColor: 'transparent',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
                            }}>
                                <ScrollArea style={{ height: '50%' }} offsetScrollbars>
                                    <Grid mt='xs'>
                                        {image.map((file, fileIndex) => (
                                            <Col key={fileIndex} span={12} md={3} lg={3} sm={6}>
                                                <Center>
                                                    <Image
                                                        fit="cover"
                                                        radius='sm'
                                                        src={file.preview}
                                                        onClick={() => setShowPreviewModal(true)}
                                                        style={{
                                                            width: '50%',
                                                            height: '50%',
                                                            cursor: 'zoom-in'
                                                        }}
                                                    />
                                                </Center>
                                            </Col>
                                        ))}
                                    </Grid>
                                </ScrollArea>
                            </Accordion.Item>
                        </Accordion>
                    )}
                </Container>
                <PreviewImageModal
                    ref={modalPreviewRef}
                    isOpen={showPreviewModal}
                    setIsOpen={setShowPreviewModal}
                    source={previewImage}
                />
                <Button mt='xl' fullWidth color='indigo'>
                    Submit
                </Button>
            </Modal>
        </Fragment>
    )
})

export const EditBannerModal = memo(CustomEditBannerModal, shallowEqual)
