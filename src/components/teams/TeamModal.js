import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAddTeamMutation } from "../../features/teams/teamsApi";
import Error from "../ui/Error";

export default function TeamModal({ open, control }) {
    const [teamName, setTeamName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const { user: loggedInUser } = useSelector((state) => state.auth) || {};
    const { id: currentUserId, email: currentUserEmail } = loggedInUser || {};

    const [addTeam, { isSuccess, isLoading, isError, error }] = useAddTeamMutation();

    const init = () => {
        setTeamName("");
        setDescription("");
        setColor("");
    };

    useEffect(() => {
        if (isSuccess) {
            init();
            control();
        }
    }, [isSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();
        addTeam({
            author: currentUserEmail,
            data: {
                name: teamName,
                color: color,
                description: description,
                members: [ currentUserEmail ],
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
                        Add Team
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="to" className="sr-only">
                                    Team Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                                    placeholder="Team Name"
                                    onChange={(e) => setTeamName(e.target.value) }
                                    value={teamName}
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="sr-only">
                                    Description
                                </label>
                                <input
                                    id="description"
                                    name="description"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                                    placeholder="Description"
                                    onChange={(e) => setDescription(e.target.value) }
                                    value={description}
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="sr-only">
                                    Chhose Team Color
                                </label>
                                <select 
                                    className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-violet-600 focus:outline-none" 
                                    aria-label="Default select example"
                                    onChange={(e) => setColor(e.target.value)}
                                >
                                    <option value="">Choose a color for your team</option>
                                    <option value="gray">Gray</option>
                                    <option value="red">Red</option>
                                    <option value="orange">Orange</option>
                                    <option value="yellow">Yellow</option>
                                    <option value="green">Green</option>
                                    <option value="teal">Teal</option>
                                    <option value="blue">Blue</option>
                                    <option value="indigo">Indigo</option>
                                    <option value="purple">Purple</option>
                                    <option value="pink">Pink</option>
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
                                disabled={isLoading || !teamName || !description || !color}
                            >
                                Add Team
                            </button>
                        </div>

                        {isError && <Error message={error} />}
                    </form>
                </div>
            </>
        )
    );
}