import { Avatar, Group, Text } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { forwardRef, Fragment, memo } from 'react'

const forwardedRef = forwardRef
const CustomAutoCompleteItem = forwardedRef(({ description, value, image, ...others }, ref) => {
    return (
        <Fragment>
            <div ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={image} />

                    <div>
                        <Text>{value}</Text>
                        <Text size="xs" color="dimmed">
                            {description}
                        </Text>
                    </div>
                </Group>
            </div>
        </Fragment>
    )
})

export const AutoCompleteItem = memo(CustomAutoCompleteItem, shallowEqual)
