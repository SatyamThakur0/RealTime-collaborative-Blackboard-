import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
    return (
        <div className="flex justify-center w-full">
            <div className="flex justify-between mt-10 items-center w-[95%] bg-black/70 backdrop-blur-lg py-3 px-10 sticky top-10 rounded-xl">
                <div className="bor der border-green-600 flex flex-col">
                    <span className="text-xl">Hello,</span>{" "}
                    <span className="font-semibold text-2xl">Satyam 👋</span>
                </div>
                <Button className="bg-red-700 flex items-center justify-center rounded-xl w-[100px] h-[35px] text-sm hover:bg-red-800">
                    logout
                </Button>
            </div>
        </div>
    );
};

export default Navbar;
