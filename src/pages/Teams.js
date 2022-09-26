import { useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import Team from "../components/teams/Team";
import TeamModal from "../components/teams/TeamModal";
import { useGetTeamsQuery } from "../features/teams/teamsApi";

export default function Teams() {
    const [opened, setOpened] = useState(false);
    const controlModal = () => {
        setOpened((prevState) => !prevState);
    };
    const {user} = useSelector((state) => state.auth) || {};
    const {email} = user || {};
    const {data: teams, isLoading, isError, error} = useGetTeamsQuery(email) || [];

    // console.log("Teams", teams)

    return (
        <Layout>
            <div className="px-10 mt-6 flex justify-between">
                <h1 className="text-2xl font-bold">Teams</h1>
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
            <div
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 px-10 mt-4 gap-6 overflow-auto"
            >
                {
                    teams && teams.length === 0 && <p>There is no team found</p>
                }
                {
                    teams && teams.map(team => <Team key={team.id} team={team}/>)
                }
            </div>
            <TeamModal open={opened} control={controlModal} />
        </Layout>
    )
}