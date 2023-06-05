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
import { curriculumManagement } from '../hooks/api/CurriculumManagement/CurriculumManagement';
import { teacherManagement } from '../hooks/api/TeacherManagement/TeacherManagement';
import { theoryGroupManagement } from '../hooks/api/TheoryGroupManagement/TheoryGroupManagement';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

export const store = configureStore({
    reducer: {
        [loginManagement.reducerPath]: loginManagement.reducer,
        [mainManagement.reducerPath]: mainManagement.reducer,
        [contentsManagement.reducerPath]: contentsManagement.reducer,
        [learningMaqnagement.reducerPath]: learningMaqnagement.reducer,
        [eduManagement.reducerPath]: eduManagement.reducer,
        [studentsManagement.reducerPath]: studentsManagement.reducer,
        [preferencesManagement.reducerPath]: preferencesManagement.reducer,
        [curriculumManagement.reducerPath]: curriculumManagement.reducer,
        [teacherManagement.reducerPath]: teacherManagement.reducer,
        [theoryGroupManagement.reducerPath]: theoryGroupManagement.reducer
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
            .concat(curriculumManagement.middleware)
            .concat(teacherManagement.middleware)
            .concat(theoryGroupManagement.middleware)
});

setupListeners(store.dispatch);
