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
    let targetObjs = canvas.getActiveObjects();
    if (socket) {
        socket.emit("moved", targetObjs);
    }
};
export const rotateCanvas = (e, canvas, socket) => {
    let targetObj = e.target;
    if (socket) {
        socket.emit("rotated", targetObj.toJSON());
    }
};
export const scaledCanvas = (e, canvas, socket) => {
    let targetObj = e.target;
    if (socket) {
        socket.emit("scaled", targetObj.toJSON());
    }
};
export let initialBound = null;
export const selectedCanvas = (e, canvas, socket) => {
    const selectedObjects = canvas.getActiveObjects();
    if (selectedObjects.length > 0) {
        initialBound = getBounding(selectedObjects);
    }
};
export const clearSelection = (canvas, socket, objs) => {
    socket.emit("clearSelection", objs);
};

export const getObjByID = (canvas, id) => {
    return canvas.getObjects().filter((ob) => ob.id === id)[0];
};

export const getSelectedObjects = (canvas) => {
    let objs = canvas.getActiveObjects();
    return objs;
};
export const mouseMove = (canvas) => {
    initialBound = getBounding(canvas.getActiveObjects());
};
export const mouseUp = () => {
    initialBound = null;
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

export const getBounding = (objects) => {
    if (objects.length === 0) return { top: 0, left: 0 };
    let top = Math.min(...objects.map((obj) => obj.top));
    let left = Math.min(...objects.map((obj) => obj.left));
    return { top, left };
};
