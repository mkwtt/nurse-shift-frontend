import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface User {
    id: number;
    name: string;
    role: 'nurse' | 'head_nurse';
}

interface AuthState {
    user: User | null;
    token: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout(state) {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;