import moment from "moment";
import { memo } from "react";
import { useDrag } from"react-dnd";
import { useSelector } from "react-redux";
import { useEditProjectMutation } from "../../features/projects/projectsApi";
import MoreMenu from "../MoreMenu";
import { ItemTypes } from "./ItemTypes";

function Project({project}) {
    const {id, type, team, title, author, teamId, timestamp} = project;
    const search = useSelector((state) => state.search.search);
    const { user: loggedInUser } = useSelector((state) => state.auth) || {};
    const { email: currentUserEmail } = loggedInUser || {};

    const [editProject, { isSuccess, isLoading, isError, error }] = useEditProjectMutation();
    const [{ opacity }, drag] = useDrag(
        () => ({
          type: ItemTypes.Project,
          item: project,
          end(item, monitor) {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
              const isDropAllowed = dropResult.allowedDropEffect === 'move';
              if (isDropAllowed && dropResult.type !== type) {
                editProject({
                    id,
                    member: currentUserEmail,
                    team,
                    prevType: type,
                    data: {
                        type: dropResult.type,
                    },
                });
              }
            }
          },
          collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
          }),
        }),
        [id],
    );

    // console.log("Project", id)

    return (
        <div
            className={`relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg cursor-pointer bg-opacity-90 group hover:bg-opacity-100 ${search && title.match(search) && "border-4 border-indigo-500"}`}
            draggable="true"
            ref={drag} style={{ opacity }}
        >
            {
                type === "BackLog" && (
                    <MoreMenu id={id} routeType="Project" author={author} stateType={type} />
                )
            }
            <span
                className={`flex items-center h-6 px-3 text-xs font-semibold text-${team?.color}-500 bg-${team?.color}-100 rounded-full`}
            >
                {team?.name}
            </span>
            <h4 className="mt-3 text-sm font-medium">{title}</h4>
            {
                isLoading && (
                    <div className="flex justify-center items-center m-auto">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )
            }
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
                    <span className="ml-1 leading-none">{moment(timestamp).format("MMM DD")}</span>
                </div>

                <img
                    className="w-6 h-6 ml-auto rounded-full"
                    src={`https://randomuser.me/api/portraits/men/${author.userId}.jpg`}
                />
            </div>
        </div>
    )
}

export default memo(Project);