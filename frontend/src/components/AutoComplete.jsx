import React, { useContext, useEffect, useState } from 'react'
import { PortContext } from '../context/PortContext'

const AutoComplete = ({
    placeholder='',
    dataKey='',
    customLoading='Loading...',
    onSelect=()=>{},
    onChange=()=>{},
    onBlur=()=>{},
    onFocus=()=>{},
    customStyles={}
}) => {

    const [inputValue, setInputValue] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const {vesselNames} = useContext(PortContext)
    console.log('vesselNames:', vesselNames)
    useEffect(() => {
        console.log('suggestions updated:', suggestions)
    }, [suggestions])

    const handleInputChange = (e) => {
        const value = e.target.value
        setInputValue(value);
        onChange(value);
    }

    const getSuggestions = (query) => {
        setError(null)
        setLoading(true)
        try {
            const result = (vesselNames || []).filter((item)=>
                item?.VesselName?.toLowerCase().includes(query.toLowerCase())
            )
            setSuggestions(result || [])
        } catch (error) {
            setError(error.message)
            setSuggestions([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        if (inputValue.length>1) {
            getSuggestions(inputValue)
        } else {
            setSuggestions([])
        }
    },[inputValue])

  return (
    <div>
        <input 
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onBlur={onBlur}
            onFocus={onFocus}
            onChange={handleInputChange}
        />
        {loading && <div className="autocomplete-loading">{customLoading}</div>}
        {error && <div className="autocomplete-error">{error}</div>}
        {!loading && suggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
                {suggestions.map((item, idx) => (
                    <li key={idx} onClick={() => {
                        setInputValue(item.VesselName)
                        setSuggestions([])
                        onSelect(item)
                    }}>
                        {item.VesselName}
                        <span className="vessel-type"> — {item.VesselType}</span>
                    </li>
                ))}
            </ul>
        )}
    </div>
  )
}

export default AutoComplete