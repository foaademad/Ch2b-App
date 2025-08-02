
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileDto } from "../utility/interfaces/profileInterface";

interface ProfileState {
    profile: ProfileDto | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    profile: null,
    isLoading: false,
    error: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<ProfileDto>) => {
            state.profile = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearProfile: (state) => {
            state.profile = null;
            state.isLoading = false;
            state.error = null;
        },
    },
});

export const { setProfile, setLoading, setError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;