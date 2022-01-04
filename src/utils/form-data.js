export const createFormData = (files, data) => {
    const { single = false, multiple = false } = files
    const formData = new FormData()
    const singleImage = (file) => {
        return {
            uri: file?.source,
            name: file?.name,
            type: file?.file?.type
        }
    }
    const multipleImage = (files) => {
        const randomNumber = Math.random()

        return {
            uri: files?.source,
            name: files?.name,
            type: files?.file?.type || `temporary_file_${randomNumber.replace('.', '')}.jpeg`
        }
    }

    if (single) formData.append('image', singleImage(single))

    if (multiple) for (const key in multiple) formData.append(key, multipleImage(multiple[key]))

    if (data) for (const key in data) formData.append(key, data[key])

    return formData
}
