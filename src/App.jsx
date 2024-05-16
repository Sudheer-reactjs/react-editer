// App Component
import React, { useState } from 'react';
import Canvas from './components/Canvas';
import ControlPanel from './components/ControlPanel';
import './App.css';

const App = () => {
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [backgroundImage, setBackgroundImage] = useState(null); // Change to hold the image file
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
        setSelectedId(textElements.length + 1);
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

    const uploadBackgroundImage = (imageFile) => {
        setBackgroundImage(imageFile);
    };

    return (
        <div className="app">
            <ControlPanel
                textElements={textElements}
                setBackgroundColor={setBackgroundColor}
                setBackgroundImage={setBackgroundImage}
                uploadBackgroundImage={uploadBackgroundImage} // Pass the upload handler
                updateTextElement={updateTextElement}
                addTextElement={addTextElement}
                deleteTextElement={deleteTextElement}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
            />
            <Canvas
                backgroundColor={backgroundColor}
                backgroundImage={backgroundImage}
                textElements={textElements}
                updateTextElement={updateTextElement}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
            />
        </div>
    );
};

export default App; 