import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { useRemoveProjectMutation } from "../features/projects/projectsApi";
import { useRemoveTeamMutation } from "../features/teams/teamsApi";
import AssignModal from "./teams/AssignModal";

function MoreMenu({id, routeType, author, stateType}) {
    const [opened, setOpened] = useState(false);
    const controlModal = () => {
        setOpened((prevState) => !prevState);
    };

    const { user: loggedInUser } = useSelector((state) => state.auth) || {};
    const { email: currentUserEmail } = loggedInUser || {};
    const [removeProject] = useRemoveProjectMutation();
    const [removeTeam] = useRemoveTeamMutation();

    const handleDelete = () => {
        routeType === "Team" ? 
            removeTeam({ id, author: currentUserEmail })
            :
            removeProject({ id, author: currentUserEmail, type: stateType });
    }

    return (
        <div>
            <div className="dropdown">
            <button
                className="dropdown-toggle absolute top-0 right-0 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex"
                type="button"
                id={`dropdownMenu-${id}`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <svg
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                    />
                </svg>
            </button>
            <ul
                className="dropdown-menu min-w-max absolute hidden bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none"
                aria-labelledby={`dropdownMenu-${id}`}
            >
                {
                    routeType === "Team" && (
                        <>
                            <li>
                                <button
                                    className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
                                    onClick={controlModal}
                                >
                                    Assign Member
                                </button>
                            </li>
                        </>
                    )
                }
                <li>
                    <button
                        className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-red-700 hover:bg-gray-100"
                        onClick={handleDelete}
                        disabled={author.email !== currentUserEmail}
                    >
                        Delete this {routeType === "Team" ? "Team" : "Project"}
                    </button>
                </li>
            </ul>
            </div>
            {
                opened && <AssignModal 
                    open={opened} 
                    control={controlModal} 
                    id={id}
                    currentUserEmail={currentUserEmail} 
                />
            }
        </div>
    )
}

export default memo(MoreMenu);