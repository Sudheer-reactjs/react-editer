// App Component
import React, { useState } from 'react';
import Canvas from './components/Canvas';
import ControlPanel from './components/ControlPanel';
import './App.css';

const App = () => {
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [images, setImages] = useState([]);
    const [textElements, setTextElements] = useState([
        {
            id: 1,
            text: '',
            fontFamily: 'Arial',
            color: '#000000',
            x: 50,
            y: 50,
            width: 200,
            align: 'left',
            fontSize: 24
        }
    ]);
    const [selectedId, setSelectedId] = useState(null);

    const addTextElement = () => {
        const colors = ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000'];
        const colorIndex = Math.floor(Math.random() * colors.length);
        const color = colors[colorIndex];

        const newTextElement = {
            id: textElements.length + 1,
            text: 'Your Text',
            fontFamily: 'Arial',
            color: color,
            x: 50,
            y: 50,
            width: 500,
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

    const deleteTextElement = (updatedTextElements) => {
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

    const deleteImage = (updatedImages) => {
        setImages(updatedImages);
        setSelectedId(null);
    };

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
            />
            <Canvas
                backgroundColor={backgroundColor}
                images={images}
                textElements={textElements}
                updateTextElement={updateTextElement}
                updateImage={updateImage}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
            />
        </div>
    );
};

export default App;
