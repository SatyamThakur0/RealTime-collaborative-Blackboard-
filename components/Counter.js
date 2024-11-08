"use client";

import { useSocket } from "@/store/socket";
import { useEffect, useState } from "react";

function Counter() {
    const socket = useSocket();
    const [counter, setCounter] = useState(0);
    function handleCounter(e) {
        let curr = counter;
        if (e.target.innerText == "-") {
            socket.emit("counterUpdated", counter - 1);
        } else {
            socket.emit("counterUpdated", counter + 1);
        }
    }

    useEffect(() => {
        socket &&
            socket.on("updatedValue", (val) => {
                setCounter(val);
            });
    }, [socket]);

    return (
        <div className="text-white items-center m-10 text-8xl flex gap-4">
            <div
                onClick={(e) => handleCounter(e)}
                className="border border-red-700 cursor-pointer"
            >
                +
            </div>
            <input
                className="text-black text-center rounded-xl font-semibold w-[100px]"
                type="number"
                value={counter}
                readOnly
            />
            <div
                onClick={(e) => handleCounter(e)}
                className="border cursor-pointer border-red-700"
            >
                -
            </div>
        </div>
    );
}

export default Counter;
