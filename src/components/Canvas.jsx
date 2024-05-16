// src/components/Canvas.js
import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Image, Transformer } from 'react-konva';
import useImage from 'use-image';

const Canvas = ({ backgroundColor, backgroundImage, textElements, updateTextElement, selectedId, setSelectedId }) => {
    const stageRef = useRef(null);
    const transformerRef = useRef(null);
    const [image] = useImage(backgroundImage);

    useEffect(() => {
        if (selectedId) {
            const selectedNode = stageRef.current.findOne(`#text-${selectedId}`);
            if (selectedNode) {
                transformerRef.current.nodes([selectedNode]);
                transformerRef.current.getLayer().batchDraw();
            }
        } else {
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selectedId, textElements]);

    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            ref={stageRef}
            onMouseDown={(e) => {
                if (e.target === stageRef.current) {
                    setSelectedId(null);
                }
            }}
        >
            <Layer>
                <Rect
                    width={window.innerWidth}
                    height={window.innerHeight}
                    fill={backgroundColor}
                />
                {image && (
                    <Image
                        image={image}
                        width={window.innerWidth}
                        height={window.innerHeight}
                    />
                )}
                {textElements.map(textElement => (
                    <Text
                        key={textElement.id}
                        id={`text-${textElement.id}`}
                        text={textElement.text}
                        fontFamily={textElement.fontFamily}
                        fill={textElement.color}
                        x={textElement.x}
                        y={textElement.y}
                        width={textElement.width}
                        align={textElement.align}
                        fontSize={textElement.fontSize} // Ensure fontSize is correctly applied
                        draggable
                        onClick={() => setSelectedId(textElement.id)}
                        onTap={() => setSelectedId(textElement.id)}
                        onDragEnd={(e) => {
                            updateTextElement(textElement.id, {
                                x: e.target.x(),
                                y: e.target.y()
                            });
                        }}
                        onTransformEnd={(e) => {
                            const node = e.target;
                            const scaleX = node.scaleX();
                            const scaleY = node.scaleY();

                            // Reset the scale to avoid distortion
                            node.scaleX(1);
                            node.scaleY(1);

                            // Calculate the new font size based on the scale
                            const newFontSize = Math.max(5, textElement.fontSize * scaleY);

                            // Update the text element with the new properties
                            updateTextElement(textElement.id, {
                                x: node.x(),
                                y: node.y(),
                                width: Math.max(5, node.width() * scaleX),
                                fontSize: newFontSize
                            });
                        }}
                    />
                ))}
                <Transformer ref={transformerRef} />
            </Layer>
        </Stage>
    );
};

export default Canvas;