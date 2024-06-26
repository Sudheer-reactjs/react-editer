import React from 'react';

const ControlPanel = ({
    setBackgroundColor,
    addImage,
    textElements,
    updateTextElement,
    addTextElement,
    deleteTextElement,
    selectedId,
    setSelectedId,
    saveCanvasAsImage,
    setCanvasSize // Receive setCanvasSize function
}) => {
    const handleCanvasSizeChange = (e) => {
        const size = e.target.value.split('x');
        setCanvasSize({ width: parseInt(size[0]), height: parseInt(size[1]) });
    };

    const handleInputChange = (id, e) => {
        const { name, value } = e.target;
        updateTextElement(id, { [name]: value });
    };

    const handleColorChange = (e) => {
        if (selectedId && selectedId !== 'background') {
            const selectedTextElement = textElements.find(textElement => textElement.id === selectedId);
            if (selectedTextElement) {
                updateTextElement(selectedId, { color: e.target.value });
            }  
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

    // Safely access selected text element
    const selectedTextElement = textElements.find(textElement => textElement.id === selectedId);

    return (
        <div className="control-panel">
            <label>
                Canvas Size:
                <select onChange={handleCanvasSizeChange}>
                    <option value="500x700">Default (500x700)</option>
                    <option value="800x600">Custom (800x600)</option>
                    {/* Add more options as needed */}
                </select>
            </label>
            <label>
                Background Color:
                <input type="color" value="#ebecf0" onChange={(e) => setBackgroundColor(e.target.value)} />
            </label>
            <label>
                Upload Image:
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            {selectedId && selectedId !== 'background' && selectedTextElement && (
                <div>
                    <h3>Selected Text Element {selectedId}</h3>
                    <label>
                        Text Content:
                        <input
                            type="text"
                            name="text"
                            value={selectedTextElement.text}
                            onChange={(e) => handleInputChange(selectedId, e)}
                        />
                    </label>
                    <label>
                        Text Color:
                        <input
                            type="color"
                            name="color"
                            value={selectedTextElement.color}
                            onChange={handleColorChange}
                        />
                    </label>
                    <label>
                        Font Family:
                        <select
                            value={selectedTextElement.fontFamily}
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
            <button onClick={saveCanvasAsImage} className="button">Save as Image</button>
        </div>
    );
};

export default ControlPanel;
