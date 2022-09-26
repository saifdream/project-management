import { useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import Project from "../components/projects/Project";
import ProjectModal from "../components/projects/ProjectModal";
import { useGetProjectsQuery } from "../features/projects/projectsApi";

const projectTypes = ["BackLog", "Ready", "Doing", "Review", "Blocked", "Done"];

export default function Projects() {
    const [opened, setOpened] = useState(false);
    const controlModal = () => {
        setOpened((prevState) => !prevState);
    };

    const {user} = useSelector((state) => state.auth) || {};
    const {email} = user || {};
    const {data, isLoading, isError, error} = useGetProjectsQuery(email) || [];
    const {projects, projectCounter} = data || {};

    // console.log("teams", teams)

    return (
        <Layout>
            <div className="px-10 mt-6">
                <h1 className="text-2xl font-bold">Project Board</h1>
                {
                    projects && projects.length === 0 && <p>There is no projects found</p>
                }
            </div>
            {
                isLoading && (
                    <div className="flex justify-center items-center">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                            <span className="visually-hidden">Processing...</span>
                        </div>
                    </div>
                )
            }
            <div className="flex flex-grow px-10 mt-4 space-x-6 overflow-auto">
                {
                    projectTypes.map((type, index) => (
                        <div key={type} className="flex flex-col flex-shrink-0 w-72">
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
                    ))
                }
                {/* <div className="flex flex-col flex-shrink-0 w-72">
                    <div className="flex items-center flex-shrink-0 h-10 px-2">
                        <span className="block text-sm font-semibold">Backlog</span>
                        <span
                            className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30"
                            >
                                6
                        </span>
                        <button
                            className="flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100"
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
                    </div>
                    <div className="flex flex-col pb-2 overflow-auto">
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <button
                                className="absolute top-0 right-0 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex"
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
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full"
                            >
                                Design
                            </span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none">
                                        Dec 12
                                    </span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/26.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-green-500 bg-green-100 rounded-full"
                            >
                                Dev
                            </span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none">Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/44.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-green-500 bg-green-100 rounded-full"
                            >
                                Dev
                            </span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none">Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/men/46.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-green-500 bg-green-100 rounded-full"
                            >
                                Dev
                            </span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >
                                            Dec 12
                                            </span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/48.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-yellow-500 bg-yellow-100 rounded-full"
                                >Copywriting</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/26.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-shrink-0 w-72">
                    <div className="flex items-center flex-shrink-0 h-10 px-2">
                        <span className="block text-sm font-semibold">Ready</span>
                        <span
                            className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30"
                            >3</span>
                    </div>
                    <div className="flex flex-col pb-2 overflow-auto">
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full"
                                >Design</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/26.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-green-500 bg-green-100 rounded-full"
                                >Dev</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/men/64.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full"
                                >Design</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>
                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/26.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-shrink-0 w-72">
                    <div className="flex items-center flex-shrink-0 h-10 px-2">
                        <span className="block text-sm font-semibold">Doing</span>
                        <span
                            className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30"
                            >2</span>
                    </div>
                    <div className="flex flex-col pb-2 overflow-auto">
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full"
                                >Design</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/26.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-green-500 bg-green-100 rounded-full"
                                >Dev</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/men/64.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-shrink-0 w-72">
                    <div className="flex items-center flex-shrink-0 h-10 px-2">
                        <span className="block text-sm font-semibold">Review</span>
                        <span
                            className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30"
                            >3</span>
                    </div>
                    <div className="flex flex-col pb-2 overflow-auto">
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-green-500 bg-green-100 rounded-full"
                                >Dev</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/men/64.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-yellow-500 bg-yellow-100 rounded-full"
                                >Copywriting</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/44.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full"
                                >Design</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/44.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-shrink-0 w-72">
                    <div className="flex items-center flex-shrink-0 h-10 px-2">
                        <span className="block text-sm font-semibold">Blocked</span>
                        <span
                            className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30"
                            >1</span>
                    </div>
                    <div className="flex flex-col pb-2 overflow-auto">
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full"
                                >Design</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/26.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-shrink-0 w-72">
                    <div className="flex items-center flex-shrink-0 h-10 px-2">
                        <span className="block text-sm font-semibold">Done</span>
                        <span
                            className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30"
                            >3</span>
                    </div>
                    <div className="flex flex-col pb-2 overflow-auto">
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-yellow-500 bg-yellow-100 rounded-full"
                                >Copywriting</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/26.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-yellow-500 bg-yellow-100 rounded-full"
                                >Copywriting</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/44.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full"
                                >Design</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/men/46.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-pink-500 bg-pink-100 rounded-full"
                                >Design</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/men/46.jpg"
                                />
                            </div>
                        </div>
                        <div
                            className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100"
                            draggable="true"
                        >
                            <span
                                className="flex items-center h-6 px-3 text-xs font-semibold text-green-500 bg-green-100 rounded-full"
                                >Dev</span>
                            <h4 className="mt-3 text-sm font-medium">
                                This is the title of the card for the thing that
                                needs to be done.
                            </h4>
                            <div
                                className="flex items-center w-full mt-3 text-xs font-medium text-gray-400"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="w-4 h-4 text-gray-300 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="ml-1 leading-none"
                                        >Dec 12</span>
                                </div>

                                <img
                                    className="w-6 h-6 ml-auto rounded-full"
                                    src="https://randomuser.me/api/portraits/women/26.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="flex-shrink-0 w-6"></div>
            </div>
            <ProjectModal open={opened} control={controlModal} />
        </Layout>
    )
}