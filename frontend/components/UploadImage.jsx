import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Button } from "./Button";
import { Slider } from "./Slider";

const fileTypes = ["JPEG", "JPG", "PNG"];




export const UploadImage = (props) => {
    const [file, setFile] = useState(null);
    const [boardFile, setBoardFile] = useState(null);
    const [boardFileURL, setBoardFileURL] = useState(null);
    const [sliderDisabled, toggleSlider] = useState(false);

    function ProcessImage(file, threshold) {
        const formData = new FormData();
        formData.append('file', file, 'test.png');
        formData.append('threshold', threshold)
    
        const requestOptions = {
            method: 'POST',
            body: formData
        };
        
        return fetch('/api/board', requestOptions)
            .then(response => response.blob())
            .then((result) => {
                const blob = new Blob([result], {type: 'image/png'})
                setBoardFile(blob)
                return URL.createObjectURL(blob)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleOriginalImageChange = (file) => {
        setFile(file);
        ProcessImageWrapper(file, 128)
    };

    function handleSliderChange(value) {
        ProcessImageWrapper(file, value)
    }

    function ProcessImageWrapper(file, value) {
        toggleSlider(true)
        ProcessImage(file, value)
            .then((result) => {
                setBoardFileURL(result)
            })
            .then(() => toggleSlider(false))
    }

    function SaveBoardImage() {
        props.setBoardImage(boardFile)
    }


    return (
        <div>
            {file ?
                <div>
                    <Slider onChange={handleSliderChange} disabled={sliderDisabled}/>
                    <img className="w-[400px]" src={boardFileURL} />
                    <FileUploader
                        multiple={false}
                        handleChange={handleOriginalImageChange}
                        name="file"
                        types={fileTypes} />
                    <Button onClick={SaveBoardImage} text="Submit"/>
                </div>
                :
                <div>
                    <FileUploader
                        multiple={false}
                        handleChange={handleOriginalImageChange}
                        name="file"
                        types={fileTypes} />
                </div>
            }

        </div>
    );
}

