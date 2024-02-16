import { currentUser } from "@clerk/nextjs";
import { CreateBarForm } from "./form";

export default async function CreateBar() {
  const user = await currentUser();
  if (!user) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }
  const userIsAdmin = user?.privateMetadata?.role === "admin";

  return <CreateBarForm userIsAdmin={userIsAdmin} />;
}
