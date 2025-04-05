export const BASE_URL=import.meta.env.VITE_API_BASE_URL||"http://localhost:8000";

//utils/apiPaths.js
export const API_PATHS={
    AUTH:{
        LOGIN:"/api/v1/auth/login",
        REGISTER:"/api/v1/auth/register",
        GET_USER_INFO:"/api/v1/auth/getUser",
        LOGOUT: "/api/v1/auth/logout",

    },
    DASHBOARD:{
        GET_DATA:"/api/v1/dashboard",
    },
    INCOME:{
        ADD_INCOME:"/api/v1/income/add",
        GET_ALL_INCOME:"/api/v1/income/get",
        DOWNLOAD_INCOME:"/api/v1/income/downloadexcel",
        DELTE_INCOME:(incomeId)=>`/api/v1/income/${incomeId}`,
    },
    EXPENSE:{
        ADD_EXPENSE:"/api/v1/expense/add",
        GET_ALL_EXPENSE:"/api/v1/expense/get",
        DOWNLOAD_EXPENSE:"/api/v1/expense/downloadexcel",
        DELTE_EXPENSE:(expenseId)=>`/api/v1/expense/${expenseId}`,
    },
    IMAGE:{
        UPLOAD_IMAGE:"/api/v1/auth/upload-image",
    },
};