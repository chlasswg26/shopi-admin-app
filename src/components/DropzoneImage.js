import { Fragment, memo, forwardRef } from 'react'
import { shallowEqual } from '@mantine/hooks'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { Group, useMantineTheme } from '@mantine/core'
import { HiOutlineUpload } from 'react-icons/hi'
import { MdOutlineDangerous } from 'react-icons/md'
import { FaRegImage } from 'react-icons/fa'

const ImageUploadIcon = ({ status, ...props }) => {
    if (status.accepted) return <HiOutlineUpload {...props} />

    if (status.rejected) return <MdOutlineDangerous {...props} />

    return <FaRegImage {...props} />
}
const getIconColor = (status, theme) => {
    return status.accepted ? theme.colors[theme.primaryColor][6] : status.rejected ? theme.colors.red[6] : theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black
}

const forwardedRef = forwardRef
const CustomDropzoneImage = forwardedRef(({ setPreview, isMultiple = true, children }, ref) => {
    const theme = useMantineTheme()

    return (
        <Fragment>
            <Dropzone ref={ref} onDrop={(image) => setPreview(image.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })))} maxSize={3 * 1024 ** 2} multiple={isMultiple} accept={IMAGE_MIME_TYPE}>
                {(status) => (
                    <Group position='center' spacing='xl' style={{ minHeight: 150, pointerEvents: 'none' }}>
                        <ImageUploadIcon
                            status={status}
                            style={{ width: 80, height: 80, color: getIconColor(status, theme) }}
                        />

                        <div>
                            {children}
                        </div>
                    </Group>
                )}
            </Dropzone>
        </Fragment>
    )
})

export const DropzoneImage = memo(CustomDropzoneImage, shallowEqual)
