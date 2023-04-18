/* eslint-disable no-param-reassign */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Comment } from '../../types/Comment';
import {
  createComment,
  getPostComments,
} from '../../api/comments';

type CommentsState = {
  items: Comment[];
  loaded: boolean;
  hasError: boolean;
};

const initialState: CommentsState = {
  items: [],
  loaded: false,
  hasError: false,
};

export const init = createAsyncThunk('comments/fetch', getPostComments);
export const addCommentItem = createAsyncThunk('comments/add', createComment);

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        comment => comment.id !== action.payload,
      );
    },
  },

  extraReducers: (builder) => {
    builder.addCase(init.pending, (state) => {
      state.loaded = false;
    });
    builder.addCase(init.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loaded = true;
    });
    builder.addCase(init.rejected, (state) => {
      state.hasError = true;
      state.loaded = true;
    });
    builder.addCase(addCommentItem.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    builder.addCase(addCommentItem.rejected, (state) => {
      state.hasError = true;
    });
  },
});

export default commentsSlice.reducer;
export const { setComments } = commentsSlice.actions;
