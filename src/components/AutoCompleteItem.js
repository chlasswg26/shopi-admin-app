import { Avatar, Box, Group, Text } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { forwardRef, Fragment, memo } from 'react'

const forwardedRef = forwardRef
const CustomAutoCompleteItem = forwardedRef(({ name, description, image, id, ...others }, ref) => {
    return (
        <Fragment>
            <Box key={id} ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={image} />

                    <Box>
                        <Text>{name}</Text>
                        <Text size='xs' color='dimmed'>
                            {description}
                        </Text>
                    </Box>
                </Group>
            </Box>
        </Fragment>
    )
})

export const AutoCompleteItem = memo(CustomAutoCompleteItem, shallowEqual)
