import { apiSlice } from "../api/apiSlice";

export const projectsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProjects: builder.query({
            // query: email => `/projects?members_like=${email}`
            query: email => `/teams?_embed=projects&members_like=${email}&_sort=timestamp&_order=desc`,
            transformResponse(apiResponse) {
                // console.log(apiResponse)
                const projects = [];
                const projectCounter = {
                    "BackLog": 0,
                    "Ready": 0,
                    "Doing": 0,
                    "Review": 0,
                    "Blocked": 0,
                    "Done": 0,
                };
                for (let team of apiResponse) {
                    for (let project of team.projects) {
                        projectCounter[project.type] += 1;
                        projects.push({team: {name: team.name, color: team.color}, ...project})
                    }
                }
                return {projects, projectCounter};
            },
        }),
        addProject: builder.mutation({
            query: ({author, team, data}) => ({
                url: "/projects",
                method: "POST",
                body: data
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                try {
                    const project = await queryFulfilled;
                    if(project?.data?.id) {
                        dispatch(
                            apiSlice.util.updateQueryData(
                                "getProjects",
                                arg.author,
                                draft => {
                                    draft.projects.unshift({team: {...arg.team}, ...project.data});
                                    draft.projectCounter['BackLog'] += 1;
                                }
                            )
                        )
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        editProject: builder.mutation({
            query: ({id, member, prevType, data}) => ({
                url: `/projects/${id}`,
                method: "PATCH",
                body: data
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                const pathResult = dispatch(
                    apiSlice.util.updateQueryData(
                        "getProjects",
                        arg.member,
                        draft => {
                            const draftProject = draft.projects.find(t => t.id == arg.id);
                            draftProject.type = arg.data.type;
                            draftProject.teamId = arg.data.teamId;
                            if(arg.prevType !== arg.data.type) {
                                draft.projectCounter[arg.prevType] -= 1;
                                draft.projectCounter[arg.data.type] += 1;
                            }
                        }
                    )
                )
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.log(error);
                    pathResult.undo();
                }
            }
        }),
        removeProject: builder.mutation({
            query: ({id, author, type}) => ({
                url: `/projects/${id}`,
                method: "DELETE"
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                const pathResult = dispatch(
                    apiSlice.util.updateQueryData(
                        "getProjects",
                        arg.author,
                        draft => {
                            draft.data.projects.find(t => t.id != arg.id);
                            draft.projectCounter[arg.type] -= 1;
                        }
                    )
                )
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.log(error);
                    pathResult.undo();
                }
            }
        }),
    })
});

export const {
    useGetProjectsQuery,
    useAddProjectMutation,
    useEditProjectMutation,
    useRemoveProjectMutation
} = projectsApi;