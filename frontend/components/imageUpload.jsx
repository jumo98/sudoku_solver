import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPEG", "JPG", "PNG"];

function ProcessImage(file, threshold) {
    const formData = new FormData();
    console.log(file)
    formData.append('file', file, 'test.png');
    formData.append('threshold', threshold)

    const requestOptions = {
        method: 'POST',
        // headers: { 'Content-Type': 'multipart/form-data' },
        body: formData
    };
    
    return fetch('/api/board', requestOptions)
        .then(response => response.blob())
        .then((result) => {
            ;
            const blob = new Blob([result], {type: 'image/png'})
            console.log('Success:', blob)
            return URL.createObjectURL(blob)
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}

function Slider(props) {
    const [value, setValue] = useState(128);
    const [fileURL, setFileURL] = useState('');
    if (fileURL == '') {
        ProcessImage(props["file"], value)
            .then((result) => {
                setFileURL(result)
                console.log(result)
            })
    }
    
    const handleChange = (e) => {
        setValue(e.target.value)
        ProcessImage(props["file"], e.target.value)
            .then((result) => {
                setFileURL(result)
                console.log(result)
            })
    }

    return (
        <div>
            <label htmlFor="threshold" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Threshold - {value} </label>
            <input onChange={handleChange} id="threshold" step="1" min="0" max="255" type="range" value={value} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
            <img src={fileURL}></img>
        </div>   
    )
}

export function UploadImage() {
    const [file, setFile] = useState(null);
    const [fileURL, setFileURL] = useState(null);
    const handleChange = (file) => {
        setFile(file);
        setFileURL(URL.createObjectURL(file));
    };

    return (
        <div>
            {fileURL ? <Slider file={file} fileURL={fileURL}/> : <FileUploader
                        multiple={false}
                        handleChange={handleChange}
                        name="file"
                        types={fileTypes} />
            }
            <img className="w-[400px]" src={fileURL} />
        </div>
    );
}

