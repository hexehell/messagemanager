
export const replaceAll = (change: string, pattern: string, replacement: string) => {

    let different: string = change

    do {

        different = change

        for (let patterPart of Array.from(pattern))
            change = change.replace(pattern, replacement)



    }
    while (change !== different)


    return change

}

export const ImageSize = (base64: string) => {

    return Buffer.from(base64, 'base64').byteLength

}

export const translateSizeIntoString = (size: number) => {

    if (size < 1000)
        return `${size} Bytes`
    else if (size < 1000 * 1000)
        return `${size / 1000} KB`
    else if (size < 1000 * 1000 * 1000)
        return `${size / 1000*1000} MB`
    else return ` ${size/1000*1000*1000} GB` 
}