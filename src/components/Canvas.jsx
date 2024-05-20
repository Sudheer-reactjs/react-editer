import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Image as KonvaImage, Transformer } from 'react-konva';

const Canvas = ({
    width,
    height,
    backgroundColor,
    images,
    textElements,
    updateTextElement,
    updateImage,
    selectedId,
    setSelectedId,
    stageRef,
}) => {
    const transformerRef = useRef(null);
    const [imageObjs, setImageObjs] = useState([]);

    // Effect to load images
    useEffect(() => {
        setImageObjs(
            images.map((image) => {
                const img = new window.Image();
                img.src = image.src;
                return { ...image, img };
            })
        );
    }, [images]);

    // Effect to handle image loading
    useEffect(() => {
        imageObjs.forEach((obj) => {
            obj.img.onload = () => stageRef.current.batchDraw();
        });
    }, [imageObjs]);

    // Effect to handle deselecting elements on stage click
    useEffect(() => {
        const checkDeselect = (e) => {
            if (e.target === stageRef.current) {
                setSelectedId(null);
            }
        };
        const stage = stageRef.current;
        stage.on('mousedown touchstart', checkDeselect);

        return () => {
            stage.off('mousedown touchstart', checkDeselect);
        };
    }, [stageRef, setSelectedId]);

    // Effect to update transformer
    useEffect(() => {
        const updateTransformer = () => {
            if (selectedId) {
                const selectedNode = stageRef.current.findOne(`#element-${selectedId}`);
                if (selectedNode) {
                    transformerRef.current.nodes([selectedNode]);
                    transformerRef.current.getLayer().batchDraw();
                } else {
                    transformerRef.current.nodes([]);
                    transformerRef.current.getLayer().batchDraw();
                }
            } else {
                transformerRef.current.nodes([]);
                transformerRef.current.getLayer().batchDraw();
            }
        };

        updateTransformer();
    }, [selectedId, textElements, imageObjs]);

    const handleDragEnd = (id, type, e) => {
        if (type === 'text') {
            updateTextElement(id, {
                x: e.target.x(),
                y: e.target.y(),
            });
        } else if (type === 'image') {
            updateImage(id, {
                x: e.target.x(),
                y: e.target.y(),
            });
        }
    };

    const handleTransformEnd = (id, type, e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        if (type === 'text') {
            updateTextElement(id, {
                x: node.x(),
                y: node.y(),
                width: Math.max(5, node.width() * scaleX),
                fontSize: Math.max(5, node.fontSize() * scaleY),
            });
        } else if (type === 'image') {
            updateImage(id, {
                x: node.x(),
                y: node.y(),
                width: Math.max(5, node.width() * scaleX),
                height: Math.max(5, node.height() * scaleY),
            });
        }
    };

    const imageComponents = imageObjs.map((obj) => (
        <KonvaImage
            key={obj.id}
            id={`element-${obj.id}`}
            image={obj.img}
            x={obj.x}
            y={obj.y}
            width={obj.width}
            height={obj.height}
            draggable
            onClick={() => setSelectedId(obj.id)}
            onTap={() => setSelectedId(obj.id)}
            onDragEnd={(e) => handleDragEnd(obj.id, 'image', e)}
            onTransformEnd={(e) => handleTransformEnd(obj.id, 'image', e)}
        />
    ));

    const textComponents = textElements.map((textElement) => (
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
            onDragEnd={(e) => handleDragEnd(textElement.id, 'text', e)}
            onTransformEnd={(e) => handleTransformEnd(textElement.id, 'text', e)}
        />
    ));

    return (
        <div>
            <Stage width={width} height={height} ref={stageRef}>
                <Layer>
                    <Rect width={width} height={height} fill={backgroundColor} />
                    {imageComponents}
                    {textComponents}
                    <Transformer ref={transformerRef} />
                </Layer>
            </Stage>
        </div>
    );
};

export default Canvas;
