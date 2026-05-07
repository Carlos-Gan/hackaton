export const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const isIOS = () => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export const isAndroid = () => {
    return /Android/i.test(navigator.userAgent)
}

export const getCameraFacingMode = (): 'environment' | 'user' => {
return isMobile() ? 'environment' : 'user'
}