function isInvalidEmail(userObject) {
    return !userObject.email.includes("@")
}

function isEmptyPayload(userObject) {
    return Object.keys(userObject).length === 0
}

module.exports = {
    isInvalidEmail,
    isEmptyPayload
}



// This is an alternate way to write isInvalidEmail function and export it
/*exports.isInvalidEmail = (userObject) => {
    return !userObject.email.includes("@")
}*/