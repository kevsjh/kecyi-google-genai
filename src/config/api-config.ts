
const apiBaseURL =
    process.env.NODE_ENV === "production"
        ? process.env.API_URL
        : process.env.DEVELOPMENT_API_URL;



export { apiBaseURL };