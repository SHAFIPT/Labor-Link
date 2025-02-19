import { useEffect, useState } from "react"


export const UseDebounce = (value, delay) => {
    
    const [debouncedValue , setDebouncedValue] = useState(value)


    useEffect(() => {
         console.log('Kyu3333333333333333333333333llllaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$$############################')
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
