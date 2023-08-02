import Image from "next/image";
import Link from "next/link";
import React from "react";
import Error404 from "../../public/404.png";
import Head from "next/head";

const ErrorPage = () => {
  return (
    <>
      <Head>
        <title>404 Page Not Found - 404 Marketplace</title>
        <meta name="description" content="Page Not Found" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <section className="relative py-16 dark:bg-black md:py-24 mt-16">
        <div className="container">
          <div className="mx-auto max-w-lg text-center">
            <Image src={Error404} alt="gradient" className="h-full w-full" />

            <h1 className="mb-6 font-vt323 text-4xl text-jacarta-700 dark:text-white md:text-6xl">
              Page Not Found!
            </h1>
            <p className="mb-12 text-lg leading-normal dark:text-jacarta-300">
              Oops! The page you are looking for does not exist. It might have
              been moved or deleted.
            </p>
            <Link
              href="/"
              className="inline-block rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
            >
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ErrorPage;
