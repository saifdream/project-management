import { apiSlice } from "../api/apiSlice";

export const teamsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTeams: builder.query({
            query: email => `/teams?members_like=${email}`
        }),
        addTeam: builder.mutation({
            query: ({author, data}) => ({
                url: "/teams",
                method: "POST",
                body: data
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                try {
                    const team = await queryFulfilled;
                    if(team?.data?.id) {
                        dispatch(
                            apiSlice.util.updateQueryData(
                                "getTeams",
                                arg.author,
                                draft => {
                                    draft.push(team.data);
                                }
                            )
                        )
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        editTeam: builder.mutation({
            query: ({id, member, data}) => ({
                url: `/teams/${id}`,
                method: "PATCH",
                body: data
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                const pathResult = dispatch(
                    apiSlice.util.updateQueryData(
                        "getTeams",
                        arg.member,
                        draft => {
                            const draftTeam = draft.data.find(t => t.id == arg.id);
                            draftTeam = arg.data;
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
        removeTeam: builder.mutation({
            query: ({id}) => ({
                url: `/teams/${id}`,
                method: "DELETE"
            }),
            async onQueryStarted(arg, {queryFulfilled, dispatch}) {
                const pathResult = dispatch(
                    apiSlice.util.updateQueryData(
                        "getTeams",
                        arg.author,
                        draft => {
                            draft.data.find(t => t.id != arg.id);
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
    useGetTeamsQuery,
    useAddTeamMutation,
    useEditTeamMutation,
    useRemoveTeamMutation
} = teamsApi;