import * as Yup from 'yup'

export const signUpModel = Yup.object().shape({
    name: Yup
        .string()
        .label('Name')
        .required('This field is required.'),
    email: Yup
        .string()
        .label('Email')
        .required('This field is required.')
        .email('Please enter a valid email address.'),
    phone: Yup
        .string()
        .label('Phone number')
        .min(11, 'The minimum character length is 11')
        .max(13, 'The maximum character length is 13'),
    store: Yup
        .string()
        .label('Store name')
        .nullable(true),
    password: Yup
        .string()
        .label('Password')
        .required('This field is required.')
        .min(8, 'Password must be at least 8 characters long.')
})

export const signInModel = Yup.object().shape({
    email: Yup
        .string()
        .label('Email')
        .required('This field is required.')
        .email('Email address format is incorrect.'),
    password: Yup
        .string()
        .label('Password')
        .required('This field is required.')
        .min(8, 'Password must be at least 8 characters long.')
})

export const profileModel = Yup.object().shape({
    name: Yup
        .string()
        .label('Name')
        .required('This field is required.'),
    phone: Yup
        .string()
        .label('Phone number')
        .min(11, 'The minimum character length is 11')
        .max(13, 'The maximum character length is 13'),
    store: Yup
        .string()
        .label('Store name')
        .nullable(true)
})

export const changePasswordModel = Yup.object().shape({
    password: Yup
        .string()
        .label('Password')
        .required('This field is required.')
        .min(8, 'Password must be at least 8 characters long.'),
    repeatPassword: Yup
        .string()
        .label('Repeat password')
        .required('This field is required.')
        .min(8, 'Password must be at least 8 characters long.')
        .when('password', {
            is: value => (!!(value && value.length > 0)),
            then: Yup.string().oneOf(
                [Yup.ref('password')],
                'Passwords do not match.'
            )
        })
})

export const bannerModel = Yup.object().shape({
    name: Yup
        .string()
        .label('Name')
        .required('This field is required.'),
    description: Yup
        .string()
        .label('Description')
        .max(700, 'The maximum character length is 13'),
    uri: Yup
        .string()
        .label('URI')
        .nullable(true)
})

export const categoryModel = Yup.object().shape({
    name: Yup
        .string()
        .label('Name')
        .required('This field is required.'),
    description: Yup
        .string()
        .label('Description')
        .max(700, 'The maximum character length is 13')
})
