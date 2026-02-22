import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            // If there's a token, the user is authenticated
            return !!token;
        },
    },
});

export const config = {
    // Protect the dashboard and all its sub-routes
    matcher: ["/dashboard/:path*"],
};
