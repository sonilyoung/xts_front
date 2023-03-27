// third-party
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { mainManagement } from '../hooks/api/MainManagement/MainManagement';
import { loginManagement } from '../hooks/api/LoginManagement/LoginManagement';
import { contentsManagement } from '../hooks/api/ContentsManagement/ContentsManagement';
import { learningMaqnagement } from '../hooks/api/LearningMaqnagement/LearningMaqnagement';
import { eduManagement } from '../hooks/api/EduManagement/EduManagement';
import { studentsManagement } from '../hooks/api/StudentsManagement/StudentsManagement';
import { preferencesManagement } from '../hooks/api/PreferencesManagement/PreferencesManagement';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

export const store = configureStore({
    reducer: {
        [loginManagement.reducerPath]: loginManagement.reducer,
        [mainManagement.reducerPath]: mainManagement.reducer,
        [contentsManagement.reducerPath]: contentsManagement.reducer,
        [learningMaqnagement.reducerPath]: learningMaqnagement.reducer,
        [eduManagement.reducerPath]: eduManagement.reducer,
        [studentsManagement.reducerPath]: studentsManagement.reducer,
        [preferencesManagement.reducerPath]: preferencesManagement.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(loginManagement.middleware)
            .concat(mainManagement.middleware)
            .concat(contentsManagement.middleware)
            .concat(learningMaqnagement.middleware)
            .concat(eduManagement.middleware)
            .concat(studentsManagement.middleware)
            .concat(preferencesManagement.middleware)
});

setupListeners(store.dispatch);
