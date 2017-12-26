const unauthorizationHandler = () => {
    return new Promise((resolve, reject) => reject('Unauthorization.'))
}

export { unauthorizationHandler }