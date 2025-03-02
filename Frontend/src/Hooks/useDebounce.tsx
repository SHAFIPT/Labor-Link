import { useEffect, useState } from "react"


export const UseDebounce = (value : number, delay : number) => {
    
    const [debouncedValue , setDebouncedValue] = useState(value)


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        
        return () => {
            clearTimeout(handler)
        }
    }, [delay, value])
    
    return debouncedValue

}

export default UseDebounce
