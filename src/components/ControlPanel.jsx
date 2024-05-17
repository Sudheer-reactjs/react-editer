// src/components/ControlPanel.js
import React from 'react';

const ControlPanel = ({
    setBackgroundColor,
    addImage,
    textElements,
    updateTextElement,
    addTextElement,
    deleteTextElement,
    selectedId,
    setSelectedId
}) => {
    const handleInputChange = (id, e) => {
        const { name, value } = e.target;
        updateTextElement(id, { [name]: value });
    };

    const handleColorChange = (e) => {
        if (selectedId && selectedId !== 'background') {
            updateTextElement(selectedId, { color: e.target.value });
        }
    };

    const handleFontFamilyChange = (id, e) => {
        const fontFamily = e.target.value;
        updateTextElement(id, { fontFamily });
    };

    const handleDeleteTextElement = () => {
        if (selectedId && selectedId !== 'background') {
            const updatedTextElements = textElements.filter(textElement => textElement.id !== selectedId);
            deleteTextElement(updatedTextElements);
            setSelectedId(null);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        addImage(file);
    };

    return (
        <div className="control-panel">
            <label>
                Background Color:
                <input type="color" onChange={(e) => setBackgroundColor(e.target.value)} />
            </label>
            <label>
                Upload Image:
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            {selectedId && selectedId !== 'background' && (
                <div>
                    <h3>Selected Text Element {selectedId}</h3>
                    <label>
                        Text Content:
                        <input
                            type="text"
                            name="text"
                            value={textElements.find(textElement => textElement.id === selectedId).text}
                            onChange={(e) => handleInputChange(selectedId, e)}
                        />
                    </label>
                    <label>
                        Text Color:
                        <input
                            type="color"
                            name="color"
                            value={textElements.find(textElement => textElement.id === selectedId).color}
                            onChange={handleColorChange}
                        />
                    </label>
                    <label>
                        Font Family:
                        <select
                            value={textElements.find(textElement => textElement.id === selectedId).fontFamily}
                            onChange={(e) => handleFontFamilyChange(selectedId, e)}
                        >
                            <option value="Arial">Arial</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Tahoma">Tahoma</option>
                            {/* Add more options as needed */}
                        </select>
                    </label>
                    <button onClick={handleDeleteTextElement}>Delete</button>
                </div>
            )}
            <button onClick={addTextElement} className="button">Add Text Element</button>
        </div>
    );
};

export default ControlPanel;
