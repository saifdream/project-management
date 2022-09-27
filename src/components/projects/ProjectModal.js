import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAddProjectMutation } from "../../features/projects/projectsApi";
import { useGetTeamsQuery } from "../../features/teams/teamsApi";
import Error from "../ui/Error";

export default function ProjectModal({ open, control }) {
    const [title, setTitle] = useState("");
    const [team, setTeam] = useState("");
    const { user: loggedInUser } = useSelector((state) => state.auth) || {};
    const { id: currentUserId, email: currentUserEmail } = loggedInUser || {};

    const { teams } = useGetTeamsQuery(currentUserEmail, {
        selectFromResult: ({status, data}) => {
            // console.log("data", data)
            return {
                teams: status === "fulfilled" ? data : []
            }
        },
    });

    const init = () => {
        setTitle("");
        setTeam("");
    }

    const [addProject, { isSuccess, isLoading, isError, error }] = useAddProjectMutation();

    useEffect(() => {
        if (isSuccess) {
            init();
            control();
        }
    }, [isSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const teamObj = teams.find(t => +t.id === +team);
        addProject({
            author: currentUserEmail,
            team: teamObj,
            data: {
                type: "BackLog",
                title,
                teamId: +team,
                author: {
                    userId: currentUserId, 
                    email: currentUserEmail
                },
                timestamp: new Date().getTime(),
            },
        });
    };

    return (
        open && (
            <>
                <div
                    onClick={control}
                    className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
                ></div>
                <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Add Project
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="to" className="sr-only">
                                    Project Title
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                                    placeholder="Project Title"
                                    onChange={(e) => setTitle(e.target.value) }
                                    value={title}
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="sr-only">
                                    Chhose Team
                                </label>
                                <select 
                                    className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-violet-600 focus:outline-none" 
                                    aria-label="Default select example"
                                    onChange={(e) => setTeam(e.target.value)}
                                >
                                    <option value="">Choose a team</option>
                                    {
                                        teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)
                                    }
                                </select>
                            </div>
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

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                                disabled={isLoading || !title || !team}
                            >
                                Add Project
                            </button>
                        </div>

                        {isError && <Error message={error} />}
                    </form>
                </div>
            </>
        )
    );
}