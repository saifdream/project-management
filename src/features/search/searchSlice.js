const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    search: "",
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchText: (state, action) => {
            state.search = action.payload;
        },
        resetSearch: (state) => {
            state.search = "";
        },
    },
});

export default searchSlice.reducer;
export const { setSearchText, resetSearch } = searchSlice.actions;
