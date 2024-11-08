export const TaskStats = () => {
    const taskStats = [
        { stat: 1, name: "New Task", color: "bg-orange-600" },
        { stat: 2, name: "Completed", color: "bg-yellow-600" },
        { stat: 3, name: "Accepted", color: "bg-green-600" },
        { stat: 4, name: "Failed", color: "bg-red-600" },
    ];
    return (
        <div className="flex w-[100%] p-5">
            {taskStats.map((task) => (
                <div key={task.name}
                    className={`flex flex-col justify-end text-2xl font-bold font-sans ${task.color} rounded-xl w-[90%] h-[120px] p-2 mx-3 my-6 bo rder-2 border-red-600`}
                >
                    <span className="text-5xl">{task.stat}</span> {task.name}
                </div>
            ))}
        </div> 
    );
};
