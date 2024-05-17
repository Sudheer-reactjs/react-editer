import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer } from 'react-konva';


const Canvas = ({ backgroundColor, images, textElements, updateTextElement, updateImage, selectedId, setSelectedId }) => {
    const stageRef = useRef(null);
    const transformerRef = useRef(null);
    const [imageObjs, setImageObjs] = useState([]);

    useEffect(() => {
        setImageObjs(images.map(image => {
            return { id: image.id, src: image.src, img: new window.Image() };
        }));
    }, [images]);

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

    useEffect(() => {
        imageObjs.forEach(obj => {
            obj.img.src = obj.src;
            obj.img.onload = () => stageRef.current.batchDraw();
        });
    }, [imageObjs]);

    const imageComponents = imageObjs.map(obj => {
        return (
            <KonvaImage
                key={obj.id}
                id={`element-${obj.id}`}
                image={obj.img}
                x={images.find(image => image.id === obj.id).x}
                y={images.find(image => image.id === obj.id).y}
                width={images.find(image => image.id === obj.id).width}
                height={images.find(image => image.id === obj.id).height}
                draggable
                onClick={() => setSelectedId(obj.id)}
                onTap={() => setSelectedId(obj.id)}
                onDragEnd={(e) => {
                    updateImage(obj.id, {
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

                    updateImage(obj.id, {
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