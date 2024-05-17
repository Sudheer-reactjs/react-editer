// src/components/Canvas.jsx
import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';

const Canvas = ({ backgroundColor, images, textElements, updateTextElement, updateImage, selectedId, setSelectedId }) => {
    const stageRef = useRef(null);
    const transformerRef = useRef(null);

    useEffect(() => {
        if (selectedId) {
            const selectedNode = stageRef.current.findOne(`#element-${selectedId}`);
            if (selectedNode) {
                transformerRef.current.nodes([selectedNode]);
                transformerRef.current.getLayer().batchDraw();
            }
        } else {
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selectedId, textElements, images]);

    const imageComponents = images.map(image => {
        const [img] = useImage(image.src);
        return (
            <KonvaImage
                key={image.id}
                id={`element-${image.id}`}
                image={img}
                x={image.x}
                y={image.y}
                width={image.width}
                height={image.height}
                draggable
                onClick={() => setSelectedId(image.id)}
                onTap={() => setSelectedId(image.id)}
                onDragEnd={(e) => {
                    updateImage(image.id, {
                        x: e.target.x(),
                        y: e.target.y()
                    });
                }}
                onTransformEnd={(e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);

                    updateImage(image.id, {
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(5, node.height() * scaleY)
                    });
                }}
            />
        );
    });

    const textComponents = textElements.map(textElement => (
        <Text
            key={textElement.id}
            id={`element-${textElement.id}`}
            text={textElement.text}
            fontFamily={textElement.fontFamily}
            fill={textElement.color}
            x={textElement.x}
            y={textElement.y}
            width={textElement.width}
            align={textElement.align}
            fontSize={textElement.fontSize}
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

                node.scaleX(1);
                node.scaleY(1);

                const newFontSize = Math.max(5, textElement.fontSize * scaleY);

                updateTextElement(textElement.id, {
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(5, node.width() * scaleX),
                    fontSize: newFontSize
                });
            }}
        />
    ));

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
                {imageComponents}
                {textComponents}
                <Transformer ref={transformerRef} />
            </Layer>
        </Stage>
    );
};

export default Canvas;
