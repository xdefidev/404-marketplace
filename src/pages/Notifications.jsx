import { React, useState, useEffect } from "react";
import * as PushAPI from "@pushprotocol/restapi";
import Image from "next/image";
import PushSvg from "../../public/download.svg";
import Head from "next/head";

const Notifications = ({ connectToWallet, signer_address, chainIdMain }) => {
  const [notificationData, setNotificationData] = useState();
  const [propShow, setPropShow] = useState(true);

  const getNotifications = () => {
    PushAPI.user
      .getFeeds({
        user: `eip155:${chainIdMain}:${signer_address}`,
        env: "staging",
        page: 1,
        limit: 10,
      })
      .then((feeds) => {
        setNotificationData(feeds);
      })
      .catch((err) => {
        console.error("failed to get user notifications: ", err);
      });
  };

  useEffect(() => {
    connectToWallet();
    // getNotifications();
  }, [chainIdMain, signer_address]);

  return (
    <>
      <Head>
        <title>Push Notifications - 404 Marketplace</title>
        <meta name="description" content="Push Notifications" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <section className="relative py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="img/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
          />
        </picture>
        <div className="container">
          <h1 className="mt-16 text-center font-display text-4xl font-medium text-jacarta-700 dark:text-white">
            Notifications
          </h1>
          <p className="mb-16 mt-2 text-[18px] text-center leading-normal dark:text-jacarta-300">
            <div className="flex justify-center align-middle mt-4">
              <Image src={PushSvg} height={170} width={170} />
            </div>
          </p>

          <div className="scrollbar-custom overflow-x-auto rounded-lg">
            <div className="min-w-fit">
              <ul className="nav nav-tabs flex items-center" role="tablist">
                <li
                  className="nav-item"
                  role="presentation"
                  onClick={() => setPropShow(true)}
                >
                  <button
                    className={`nav-link ${propShow &&
                      "active relative"} flex items-center whitespace-nowrap py-3 px-6 text-jacarta-400 hover:text-jacarta-700 dark:hover:text-white`}
                    id="properties-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#properties"
                    type="button"
                    role="tab"
                    aria-controls="properties"
                    aria-selected="false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="mr-1 h-5 w-5 fill-current"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M6.17 18a3.001 3.001 0 0 1 5.66 0H22v2H11.83a3.001 3.001 0 0 1-5.66 0H2v-2h4.17zm6-7a3.001 3.001 0 0 1 5.66 0H22v2h-4.17a3.001 3.001 0 0 1-5.66 0H2v-2h10.17zm-6-7a3.001 3.001 0 0 1 5.66 0H22v2H11.83a3.001 3.001 0 0 1-5.66 0H2V4h4.17z" />
                    </svg>
                    <span className="font-display text-base font-medium">
                      Marketplace Notifications
                    </span>
                  </button>
                </li>

                {/* <!-- Details --> */}
                <li
                  className="nav-item"
                  role="presentation"
                  onClick={() => setPropShow(false)}
                >
                  <button
                    className={`nav-link ${!propShow &&
                      "active relative"} flex items-center whitespace-nowrap py-3 px-6 text-jacarta-400 hover:text-jacarta-700 dark:hover:text-white`}
                    id="details-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#details"
                    type="button"
                    role="tab"
                    aria-controls="details"
                    aria-selected="false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="mr-1 h-5 w-5 fill-current"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2V4H5v16h14zM7 6h4v4H7V6zm0 6h10v2H7v-2zm0 4h10v2H7v-2zm6-9h4v2h-4V7z" />
                    </svg>
                    <span className="font-display text-base font-medium">
                      All Notification
                    </span>
                  </button>
                </li>
              </ul>

              {/* <!-- Tab Contents --> */}
              <div className="tab-content">
                {propShow ? (
                  <div>
                    <div className="rounded-t-2lg rounded-b-2lg rounded-tl-none border border-jacarta-100 bg-white p-6 dark:border-jacarta-600 dark:bg-jacarta-700 md:p-10">
                      <div className="mb-10 shrink-0 basis-8/12 space-y-5 lg:mb-0 lg:pr-10">
                        {notificationData?.map((e) => {
                          return (
                            e.app === "404 Marketplace" && (
                              <div key={e.sid}>
                                <a
                                  href={e.cta}
                                  className="relative flex items-center rounded-2.5xl border border-jacarta-100 bg-white p-8 transition-shadow hover:shadow-lg dark:border-jacarta-700 dark:bg-jacarta-700"
                                >
                                  <div className="mr-5 self-start">
                                    <Image
                                      src={e.icon}
                                      alt="avatar 2"
                                      className="rounded-2lg"
                                      loading="lazy"
                                      height={100}
                                      width={100}
                                    />
                                  </div>

                                  <div>
                                    <h3 className="mb-1 font-display text-base font-semibold text-jacarta-700 dark:text-white">
                                      {e.notification.title}
                                    </h3>
                                    <span className="mb-3 block text-sm text-jacarta-500 dark:text-jacarta-200">
                                      {e.notification.body}
                                    </span>
                                    <span className="block text-xs text-jacarta-300">
                                      Via : {e.app} | Chain : {e.blockchain}{" "}
                                    </span>
                                  </div>

                                  <div className="ml-auto rounded-full font-bold border border-jacarta-100 p-3 dark:border-jacarta-600">
                                    <svg
                                      width="24"
                                      height="24"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                    >
                                      <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
                                    </svg>
                                  </div>
                                </a>
                              </div>
                            )
                          );
                        })}
                        {notificationData?.length == 0 && (
                          <h3 className="mb-1 text-[26px] text-center font-semibold text-jacarta-700 dark:text-white">
                            No Notifications
                          </h3>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="rounded-t-2lg rounded-b-2lg rounded-tl-none border border-jacarta-100 bg-white p-6 dark:border-jacarta-600 dark:bg-jacarta-700 md:p-10">
                      <div className="mb-10 shrink-0 basis-8/12 space-y-5 lg:mb-0 lg:pr-10">
                        {notificationData?.map((e) => {
                          return (
                            <div key={e.sid}>
                              <a
                                href={e.cta}
                                className="relative flex items-center rounded-2.5xl border border-jacarta-100 bg-white p-8 transition-shadow hover:shadow-lg dark:border-jacarta-700 dark:bg-jacarta-700"
                              >
                                <div className="mr-5 self-start">
                                  <Image
                                    src={e.icon}
                                    alt="avatar 2"
                                    className="rounded-2lg"
                                    loading="lazy"
                                    height={100}
                                    width={100}
                                  />
                                </div>

                                <div>
                                  <h3 className="mb-1 font-display text-base font-semibold text-jacarta-700 dark:text-white">
                                    {e.notification.title}
                                  </h3>
                                  <span className="mb-3 block text-sm text-jacarta-500 dark:text-jacarta-200">
                                    {e.notification.body}
                                  </span>
                                  <span className="block text-xs text-jacarta-300">
                                    Via : {e.app}
                                  </span>
                                </div>

                                <div className="ml-auto rounded-full font-bold border border-jacarta-100 p-3 dark:border-jacarta-600">
                                  <svg
                                    width="24"
                                    height="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                  >
                                    <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
                                  </svg>
                                </div>
                              </a>
                            </div>
                          );
                        })}
                        {notificationData?.length == 0 && (
                          <h3 className="mb-1 text-[26px] text-center font-semibold text-jacarta-700 dark:text-white">
                            No Notifications
                          </h3>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Notifications;
