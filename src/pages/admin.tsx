import { clerkClient, getAuth } from "@clerk/nextjs/server";
import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import { Layout } from "~/components/layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/table";
import { api } from "~/utils/api";

const AdminPage: NextPage = () => {
  const { data, isLoading, refetch } = api.bars.getAllUnverified.useQuery();
  const {
    mutate,
    variables,
    isLoading: isVerifying,
  } = api.bars.verify.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });
  const { bars } = data || {};

  return (
    <Layout>
      <h1 className="text-4xl font-bold">Admin</h1>

      <Table>
        <TableCaption>Verify bars</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Bar name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Postcode</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell className="font-medium">Loading...</TableCell>
            </TableRow>
          ) : !bars || bars.length === 0 ? (
            <TableRow>
              <TableCell className="font-medium">All clear 😁</TableCell>
            </TableRow>
          ) : (
            bars.map((bar) => (
              <TableRow
                key={bar.id}
                className={`${
                  isVerifying && variables?.id === bar.id
                    ? "bg-green-300 hover:bg-green-300"
                    : ""
                }`}
              >
                <TableCell className="font-medium">{bar.name}</TableCell>
                <TableCell>{bar.city}</TableCell>
                <TableCell>{bar.postcode}</TableCell>
                <TableCell className="text-right">
                  <button
                    className="underline"
                    onClick={() => {
                      mutate({ id: bar.id });
                    }}
                  >
                    Verify
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = getAuth(context.req);
  const user = userId ? await clerkClient.users.getUser(userId) : undefined;

  if (user?.privateMetadata?.role !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default AdminPage;
