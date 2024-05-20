import React, { useState, useRef } from 'react';
import Canvas from './components/Canvas';
import ControlPanel from './components/ControlPanel';
import html2canvas from 'html2canvas';
import './App.css';

const saveCanvasAsImage = (stageRef) => {
    const stage = stageRef.current;
    html2canvas(stage.container()).then((canvas) => {
        const url = canvas.toDataURL();
        const link = document.createElement('a');
        link.href = url;
        link.download = 'canvas.png';
        link.click();
    });
};

const App = () => {
    const [backgroundColor, setBackgroundColor] = useState('#ebecf0');
    const [images, setImages] = useState([]);
    const [textElements, setTextElements] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [canvasSize, setCanvasSize] = useState({ width: 500, height: 700 }); // Default canvas size

    const addTextElement = () => {
        const newTextElement = {
            id: textElements.length + 1,
            text: 'Your Text',
            fontFamily: 'Arial',
            color: '#000000',
            x: 50,
            y: 50,
            width: 200,
            align: 'center',
            fontSize: 24
        };
        setTextElements([...textElements, newTextElement]);
        setSelectedId(newTextElement.id);
    };

    const updateTextElement = (id, newTextProperties) => {
        setTextElements(textElements.map(textElement =>
            textElement.id === id ? { ...textElement, ...newTextProperties } : textElement
        ));
    };

    const deleteTextElement = (id) => {
        const updatedTextElements = textElements.filter(textElement => textElement.id !== id);
        setTextElements(updatedTextElements);
        setSelectedId(null);
    };

    const addImage = (imageFile) => {
        const newImage = {
            id: images.length + 1,
            src: URL.createObjectURL(imageFile),
            x: 50,
            y: 50,
            width: 200,
            height: 200
        };
        setImages([...images, newImage]);
        setSelectedId(newImage.id);
    };

    const updateImage = (id, newImageProperties) => {
        setImages(images.map(image =>
            image.id === id ? { ...image, ...newImageProperties } : image
        ));
    };

    const stageRef = useRef(null);

    return (
        <div className="app">
            <ControlPanel
                textElements={textElements}
                setBackgroundColor={setBackgroundColor}
                addImage={addImage}
                updateTextElement={updateTextElement}
                addTextElement={addTextElement}
                deleteTextElement={deleteTextElement}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                saveCanvasAsImage={() => saveCanvasAsImage(stageRef)}
                setCanvasSize={setCanvasSize} // Pass setCanvasSize function
            />
            <Canvas
               width={canvasSize.width}
               height={canvasSize.height}
               backgroundColor={backgroundColor}
               images={images}
               textElements={textElements}
               updateTextElement={updateTextElement}
               updateImage={updateImage}
               selectedId={selectedId}
               setSelectedId={setSelectedId}
               stageRef={stageRef}
            />
        </div>
    );
};

export default App;
