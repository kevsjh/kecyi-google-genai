import { User } from "firebase/auth";
import { toast } from "sonner";

export async function validateUserProfile({
    apiBaseURL,
    uid,
    authCurrentUser, referralParam }: {
        apiBaseURL: string
        uid: string, authCurrentUser: User,
        referralParam: string | null
    }) {
    try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await authCurrentUser?.getIdToken()}`,
        };

        const userProfileRes = await fetch(
            `${apiBaseURL}/v1/user/profile/validate`,
            {
                method: "POST",
                headers,
            }
        );
        if (userProfileRes.status !== 200) {
            toast.error("Failed to validate user profile");
            return;
        }
        // check if referral link exists
        if (referralParam && referralParam?.length > 0) {
            await fetch(`${apiBaseURL}/v1/user/referral/consume`, {
                method: "POST",
                headers,
                body: JSON.stringify({ referralId: referralParam }),
            });
        }
    } catch (err) {
        console.log("Failed to validate user profile", err);
    }
}