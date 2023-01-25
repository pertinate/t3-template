import { GetServerSideProps, NextComponentType } from "next";
import { useSession, getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const withAuth = (component: NextComponentType) => {
  return () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
      return <p>Loading...</p>;
    }

    if (status === "unauthenticated") {
      return <p>Access Denied</p>;
    }

    return <>{component}</>;
  };
};

export default withAuth;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
