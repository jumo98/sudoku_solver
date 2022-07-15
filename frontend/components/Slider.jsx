import React, { useState } from "react";

export const Slider = (props) => {
    const [value, setValue] = useState(128);

    function onChange(e) {
        setValue(e.target.value)
        props.onChange(e.target.value);
    }

    return (
        <div>
            <label htmlFor="threshold" className="block mb-2 text-sm font-medium">Threshold - {value} </label>
            <input onChange={onChange} disabled={props.disabled} id="threshold" step="1" min="0" max="255" type="range" value={value} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
        </div>
    )
}