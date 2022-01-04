import { Avatar, Group, Text } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { Fragment, memo, useRef } from 'react'

const CustomAutoCompleteItem = ({ description, value, image, ...others }) => {
    const ref = useRef(null)

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
}

export const AutoCompleteItem = memo(CustomAutoCompleteItem, shallowEqual)
