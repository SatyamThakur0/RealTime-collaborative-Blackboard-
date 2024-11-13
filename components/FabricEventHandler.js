"use client"
export const sendCanvasData = (e, canvas, socket) => {
    if (canvas && socket) {
        const canvasData = canvas.toJSON();
        socket.emit("canvasUpdate", canvasData); // Broadcast canvas changes
    }
};
export const modifyCanvasData = (e, canvas, socket) => {
    if (canvas && socket) {
        if (e.target.type === "i-text") {
            socket.emit("textChanged", e.target);
        }
    }
};
export const updateCanvas = (e, canvas, socket) => {
    // console.log("update");
    // console.log(e.target);
};

export const movedCanvas = (e, canvas, socket) => {
    let targetObjs = [];
    canvas.getActiveObjects().map((obj) => {
        targetObjs.push({ id: obj.id, top: obj.top, left: obj.left });
    });
    if (socket) socket.emit("moved", targetObjs);
};
export const rotateCanvas = (e, canvas, socket) => {
    let targetObjs = [];
    canvas.getActiveObjects().map((obj) => {
        targetObjs.push({
            id: obj.id,
            angle: obj.angle,
            top: obj.top,
            left: obj.left,
        });
    });
    if (socket) socket.emit("rotated", targetObjs);
};
export const scaledCanvas = (e, canvas, socket) => {
    let targetObjs = [];
    canvas.getActiveObjects().map((obj) => {
        targetObjs.push({
            id: obj.id,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
        });
    });
    if (socket) socket.emit("scaled", targetObjs);
};
export const selectedCanvas = (e, canvas, socket) => {};
export const clearSelection = (canvas, socket, objs) => {
    socket.emit("clearSelection", objs);
    console.log(objs," emmited");
    
};

export const getObjByID = (canvas, id) => {
    return canvas.getObjects().filter((ob) => ob.id === id)[0];
};

export const getSelectedObjects = (canvas) => {
    let objs = canvas.getActiveObjects();
    return objs;
};

export const addId = (shape) => {
    shape.toObject = (function (toObject) {
        return function () {
            const obj = toObject.call(this);
            obj.id = this.id;
            return obj;
        };
    })(shape.toObject);
};
