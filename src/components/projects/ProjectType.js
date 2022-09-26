import { useDrop } from "react-dnd";
import { ItemTypes } from './ItemTypes';
import Project from "./Project";

const style = {
    height: '12rem',
    width: '12rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
}

function selectBackgroundColor(isActive, canDrop) {
    if (isActive) {
      return 'darkgreen'
    } else if (canDrop) {
      return 'darkkhaki'
    } else {
      return '#222'
    }
}

export default function ProjectType({type, projectCounter, controlModal, projects, allowedDropEffect}) {
    const [{ canDrop, isOver }, drop] = useDrop(
        () => ({
          accept: ItemTypes.Project,
          drop: () => ({
            // name: `${allowedDropEffect, type} State`,
            type,
            allowedDropEffect,
          }),
          collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
          }),
        }),
        [allowedDropEffect],
    )
    const isActive = canDrop && isOver;
    const backgroundColor = selectBackgroundColor(isActive, canDrop);

    return (
        <div 
            className={`flex flex-col flex-shrink-0 w-72 ${isOver && "bg-gray-50"}`}
            ref={drop} 
            // style={{ backgroundColor }}
        >
            <div className="flex items-center flex-shrink-0 h-10 px-2">
                <span className="block text-sm font-semibold">{type}</span>
                <span
                    className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30"
                >
                    {projectCounter && projectCounter[type]}
                </span>
                {
                    type === "BackLog" && (
                        <button 
                            className="flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100"
                            onClick={controlModal}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                ></path>
                            </svg>
                        </button>
                    )
                }
            </div>
            <div className="flex flex-col pb-2 overflow-auto">
                {
                    projects && projects
                        .filter((project, index) => project.type === type)
                        // .slice()
                        // .sort((a, b) => a.timestamp - b.timestamp)
                        .map((project, index) => (
                            <Project key={project.id} project={project} />
                        ))
                }
            </div>
        </div>
    )
}