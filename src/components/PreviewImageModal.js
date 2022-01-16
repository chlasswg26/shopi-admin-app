import { Anchor, Center, Image, Modal, useMantineTheme } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { forwardRef, Fragment, memo } from 'react'
import { BsBoxArrowUpRight } from 'react-icons/bs'

const forwardedRef = forwardRef
const CustomPreviewImageModal = forwardedRef(({ isOpen, setIsOpen, source }, ref) => {
    const theme = useMantineTheme()

    return (
        <Fragment>
            <Modal
                itemRef={ref}
                opened={isOpen}
                transition='skew-up'
                onClose={() => setIsOpen(false)}
                title="Preview Image"
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.95}
                size='100%'
                closeOnClickOutside={false}>
                <Center style={{
                    display: 'flex'
                }}>
                    {source ? (
                        <Image src={source} alt='Image in preview' />
                    ) : 'There\'s no image'}
                </Center>
                {source && (
                    <Center mt='xl'>
                        <Anchor href={source} target="_blank" style={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none'
                        }}>
                            View source in new tab
                            <BsBoxArrowUpRight style={{
                                marginLeft: 5
                            }} />
                        </Anchor>
                    </Center>
                )}
            </Modal>
        </Fragment>
    )
})

export const PreviewImageModal = memo(CustomPreviewImageModal, shallowEqual)
