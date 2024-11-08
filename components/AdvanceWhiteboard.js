"use client";
import SocketEventHandler from "./SocketEventHandler.js";
import {
    sendCanvasData,
    modifyCanvasData,
    movedCanvas,
    scaledCanvas,
    getObjByID,
    selectedCanvas,
    updateCanvas,
    rotateCanvas,
    getSelectedObjects,
    clearSelection,
    addId,
    mouseMove,
    mouseUp,
} from "./FabricEventHandler.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Paintbrush,
    Square,
    Circle,
    Minus,
    ArrowRight,
    Type,
    Trash2,
    RectangleEllipsis,
    TextCursor,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { BsCursorFill } from "react-icons/bs";
import { useCanvas } from "@/store/canvas";
import { useSocket } from "@/store/socket";
import uniqueID from "short-unique-id";
const uid = new uniqueID({ length: 10 });
import {
    createRect,
    createCircle,
    createLine,
    createPath,
    createText,
} from "./Shapes.js";
import {
    FaArrowRightLong,
    FaPen,
    FaRegCircle,
    FaRegSquare,
} from "react-icons/fa6";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { IoText } from "react-icons/io5";
import ColorPicker from "./ColorPicker.js";
import useWindowSize from "./UseWindowSize.js";

export default function AdvancedWhiteboard() {
    let { canvas, canvasRef, setCanvas } = useCanvas();
    let socket = useSocket();
    const [activeShape, setActiveShape] = useState("cursor");
    const [color, setColor] = useState("#fff");
    // const [active, setActive] = useState("cursor");
    const [zoomLevel, setZoomLevel] = useState(1);
    const windowSize = useWindowSize();
    const activeShapeArr = [
        {
            icon: <BsCursorFill />,
            name: "cursor",
        },
        {
            icon: <FaPen />,
            name: "pencil",
        },
        {
            icon: <FaRegSquare />,
            name: "square",
        },
        {
            icon: <FaRegCircle />,
            name: "circle",
        },
        {
            icon: <TfiLayoutLineSolid />,
            name: "line",
        },
        {
            icon: <FaArrowRightLong />,
            name: "arrow",
        },
        {
            icon: <IoText />,
            name: "text",
        },
    ];

    // FABRIC EVENTS
    useEffect(() => {
        if (canvas) {
            // canvas.width = window.innerWidth;
            // canvas.height = window.innerHeight;
            canvas.selection = true;

            canvas.on("object:added", (e) => sendCanvasData(e, canvas, socket));
            canvas.on("object:modified", (e) =>
                modifyCanvasData(e, canvas, socket)
            );
            canvas.on("object:removed", (e) =>
                sendCanvasData(e, canvas, socket)
            );

            canvas.on("object:moving", (e) => movedCanvas(e, canvas, socket));
            canvas.on("object:scaling", (e) => scaledCanvas(e, canvas, socket));
            canvas.on("object:rotating", (e) =>
                rotateCanvas(e, canvas, socket)
            );
            canvas.on("selection:updated", (e) =>
                updateCanvas(e, canvas, socket)
            );
            canvas.on("selection:created", (e) =>
                selectedCanvas(e, canvas, socket)
            );
            canvas.on("path:created", (event) => {
                const path = event.path;
                path.id = uid.rnd();
                addId(path);
                console.log("New path created:", path);
                socket.emit("freePath", path);
            });

            let isDrawing = false;
            canvas.on("mouse:down", () => {
                isDrawing = true;
            });
            canvas.on("mouse:move", (event) => {
                if (isDrawing) {
                    console.log("mouse Moving");

                    const pointer = event.pointer;
                    mouseMove(canvas);
                }
            });
            canvas.on("mouse:up", () => {
                if (isDrawing) {
                    isDrawing = false;
                    mouseUp();
                    socket.emit("drawEnd"); // Optional event to signal the end of drawing
                }
            });

            return () => {
                canvas.dispose();
            };
        }
    }, [canvas]);

    // Change color of brush and existing objects
    useEffect(() => {
        if (canvas && activeShape === "pencil") {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = color;
            canvas.getActiveObjects().forEach((obj) => {
                if (obj.type !== "path") {
                    obj.set("fill", color);
                }
                obj.set("stroke", color);
                canvas.renderAll();
            });
        }
    }, [color, activeShape, canvas]);

    // Change drawing mode (Brush or Shape)
    useEffect(() => {
        if (canvas) {
            canvas.isDrawingMode = activeShape === "pencil";
        }
    }, [activeShape, canvas]);

    // SHAPE FROM SOCKET
    SocketEventHandler({ canvas, socket, color });

    // useEffect(() => {
    //     const preventSwipe = (e) => {
    //       if (e.touches.length === 2) {
    //         e.preventDefault(); // Prevents two-finger swipe actions
    //       }
    //     };

    //     // Add event listener
    //     window.addEventListener('touchstart', preventSwipe, { passive: false });

    //     // Cleanup event listener on unmount
    //     return () => {
    //       window.removeEventListener('touchstart', preventSwipe);
    //     };
    //   }, []);

    // Add a shape to the canvas
    const addShape = (shapeType) => {
        if (!canvas) return;
        const id = uid.rnd();
        let shape;
        switch (shapeType) {
            case "square":
                shape = createRect(id, color);
                break;
            case "circle":
                shape = createCircle(id, color);
                break;
            case "line":
                shape = createLine(id, color);
                break;
            case "arrow":
                shape = createPath(id, color);
                break;
            case "text":
                shape = createText(id, color);
                break;
        }

        addId(shape);

        if (shape) {
            socket && socket.emit("newShape", shape);
            canvas.add(shape);
            canvas.setActiveObject(shape);
            canvas.renderAll();
        }
    };

    // Clear the canvas and broadcast the clear action
    const clearCanvas = () => {
        if (canvas) {
            let objs = getSelectedObjects(canvas);
            objs.forEach((element) => canvas.remove(element));
            canvas.discardActiveObject();
            canvas.renderAll();
            socket && clearSelection(canvas, socket, objs);
        }
    };

    const handleShapeClick = (shape) => {
        // setActive(shape);
        setActiveShape(shape);
    };

    return (
        <div className="w-screen h-screen items-center  top-0 flex flex-col space-y-4 p-4">
            <div className="w-screen h-screen border border-gray-600 par ent overflow-scroll">
                <canvas
                    ref={canvasRef}
                    className="border border-gray-600 rounded-xl"
                />
            </div>
            <div
                className={`text-white borde r border-red-700 fixed top-0 rounded flex ${
                    windowSize.width <= 700 && "flex-col gap-2"
                } space-x-4 items-center`}
            >
                <div className="flex gap-1 px-2 py-2 border border-gray-700 rounded-xl">
                    {activeShapeArr.map((shape) => (
                        <div
                            id={shape.name}
                            onClick={(e) => {
                                handleShapeClick(e.currentTarget.id);
                            }}
                            key={shape.name}
                            className={`${
                                activeShape === shape.name && "bg-[#212121]"
                            } p-3 rounded-xl`}
                        >
                            {shape.icon}
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 items-center justify-center">
                    <ColorPicker setColor={setColor} />
                    <div className="flex gap-2 items-center justify-center">
                        <Button
                            className="border border-gray-600 text-gray-300 rounded-xl"
                            onClick={() => addShape(activeShape)}
                            disabled={
                                activeShape === "pencil" ||
                                activeShape === "cursor"
                            }
                        >
                            Add Shape
                        </Button>
                        <Button
                            className="border border-gray-600 text-gray-300 rounded-xl"
                            onClick={clearCanvas}
                            variant="destructive"
                        >
                            <Trash2 className="mr h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
