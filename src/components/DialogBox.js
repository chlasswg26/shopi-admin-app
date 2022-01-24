import { Dialog, Notification } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { forwardRef, Fragment, memo } from 'react'
import { FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi'
import { BsInfoCircle } from 'react-icons/bs'

const forwardedRef = forwardRef
const CustomDialogBox = forwardedRef(({
    isDialogOpen,
    onDialogClose,
    status,
    message
}, ref) => {
    return (
        <Fragment>
            <Dialog
                ref={ref}
                opened={isDialogOpen}
                padding={0}
                transition='skew-up'
                transitionDuration={500}
                transitionTimingFunction='ease'
                position={{
                    top: 20,
                    right: 20
                }}>
                <Notification icon={status === 500 ? <FiXCircle size='20' /> : (
                    status === 400 ? <FiAlertCircle size='20' /> : (
                        status === 200 ? <FiCheckCircle size='20' /> : <BsInfoCircle size='20' />
                    )
                )} color={status === 500 ? 'red' : (
                    status === 400 ? 'yellow' : (
                        status === 200 ? 'teal' : 'indigo'
                    )
                )} title={status === 500 ? 'Error!' : (
                    status === 400 ? 'Warning!' : (
                        status === 200 ? 'Success!' : 'Info!'
                    )
                )} onClose={onDialogClose}>
                    {message}
                </Notification>
            </Dialog>
        </Fragment>
    )
})

export const DialogBox = memo(CustomDialogBox, shallowEqual)
