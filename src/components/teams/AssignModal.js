import { memo, useEffect, useState } from "react";
import { useEditTeamMutation, useGetTeamsQuery } from "../../features/teams/teamsApi";
import { useGetUserQuery } from "../../features/users/usersApi";
import debounceHandler from "../../utils/debounceHandler";
import isValidEmail from "../../utils/isValidEmail"
import Error from "../ui/Error";

function AssignModal({ open, control, id, currentUserEmail }) {
    const [memberEmail, setMemberEmail] = useState("");
    const [userCheck, setUserCheck] = useState(false);
    const [responseError, setResponseError] = useState("");
    const [isUserAvailable, setIsUserAvailable] = useState(false);

    const team = useGetTeamsQuery(currentUserEmail, {
        selectFromResult: ({status, data}) => {
            if(status === "fulfilled") {
                const team = data.find((team) => team.id === id);
                return team
            }
            return
        },
    });

    // console.log("team", team)

    const [editTeam, { isSuccess, isLoading, isError, error }] = useEditTeamMutation();

    const { 
        data: member, 
        isSuccess: isUserCheckSuccess, 
        isLoading: isUserCheckLoading,  
        isFetching: isUserCheckFetching,
        isError: isUserCheckError, 
        error: userCheckerror 
    } = useGetUserQuery(memberEmail, { skip: !userCheck });

    // console.log("member", member)

    const init = () => {
        setMemberEmail("");
    };

    useEffect(() => {
        if (isSuccess) {
            init();
            control();
        }
    }, [isSuccess]);

    const doSearch = (value) => {
        if (isValidEmail(value)) {
            // check user API
            setUserCheck(true);
            setMemberEmail(value);
        }
    };

    const handleSearch = debounceHandler(doSearch, 500);

    useEffect(() =>{
        if(member && member.length) {
            // const team = teams.find((team) => (team.id === id) && team.members.includes(member[0].email) );
            if(team.members.includes(member[0].email)) {
                setResponseError("User already in the team.");
                setIsUserAvailable(false);
            } else {
                setResponseError("");
                setIsUserAvailable(true);
            }
        } else {
            setResponseError("User not in the database.");
        }
    }, [member, isUserCheckSuccess]);

    useEffect(() =>{
        if(!memberEmail) {
            setResponseError("");
        }
    }, [isUserAvailable])

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("team", [ ...team.members, memberEmail ]);
        editTeam({
            id,
            member: currentUserEmail,
            data: {
                members: [ ...team.members, memberEmail ],
            },
        });
    };

    return (
        open && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div
                    onClick={control}
                    className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
                ></div>
                {/* modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto */}
                <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Assign Member
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="to" className="sr-only">
                                    Member Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                                    placeholder="Member Email"
                                    onChange={(e) => handleSearch(e.target.value) }
                                />
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
                        {
                            (isUserCheckFetching && isUserCheckLoading) && (
                                <div className="flex justify-center items-center">
                                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                                        <span className="visually-hidden">Checking user...</span>
                                    </div>
                                </div>
                            )
                        }
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                                disabled={isLoading || !memberEmail || !isUserAvailable}
                            >
                                Add Member
                            </button>
                        </div>

                        {isError && <Error message={error} />}
                        {isUserCheckError && <Error message={userCheckerror} />}
                        {responseError && <Error message={responseError} />}
                    </form>

                    <div className="flex justify-center">
                        <div className="block p-6 shadow-lg bg-white max-w-sm">
                            <h5 className="text-gray-900 text-md leading-tight font-medium mb-4">Already in the Team</h5>
                            <div className="flex justify-center">
                                <ul className="bg-white border border-gray-200 w-96 text-gray-900">
                                {
                                    team && team.members.map(email => (
                                        <li 
                                            key={email}
                                            className="px-6 py-2 border-b border-gray-200 w-full"
                                        >
                                            {email}
                                        </li>
                                    ) )
                                }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default memo(AssignModal);