import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProblemInterface } from "../utility/interfaces/supportInterface";

interface IProblemState {
  isLoading: boolean;
  error: string | null;
  problem: ProblemInterface |null;
}

const initialState: IProblemState = {
  isLoading: false,
  error: null,
  problem: null,
};

const ProblemSlice = createSlice({
  name: "problem",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProblem: (state, action: PayloadAction<ProblemInterface | null>) => {
      state.problem = action.payload;
    },
    clearProblem: (state) => {
      state.problem = null;
    },
    
   
  },
});

export const { 
  setLoading, 
  setError, 
  setProblem,
  clearProblem,
} = ProblemSlice.actions;

export default ProblemSlice.reducer;