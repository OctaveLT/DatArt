export type pickerParams = {
    id : number,
    label: string,
    min: number,
    max: number,
    value: number
}[]

export type settingsAttributes = {
    general: {
        colorThreshold: number[],
        rgbColor: string[]
    },
    circle: {
        radius: number[]
    },
    lines: {
        angle: number[]
    },
    rose: {
        angle: number[]
    }
}