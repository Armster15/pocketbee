import { Fragment } from "react";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { IoChevronDown } from "react-icons/io5";
import clsx from "clsx";

export const UserDropdown = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  if (!user) return null;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        aria-label={`User dropdown button for ${user.user_metadata.name}`}
        className="flex items-center gap-2"
      >
        <img
          className="h-8 w-8 rounded-full"
          src={user.user_metadata.avatar_url}
          alt=""
        />
        <IoChevronDown className="text-gray-600" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <p className="p-3 text-sm text-gray-500">{user.email}</p>

          <div className="px-1 py-1">
            <Menu.Item>
              <button
                className={clsx(
                  "group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900",
                  "ui-active:bg-red-500 ui-active:text-white",
                )}
                onClick={() => {
                  supabase.auth.signOut();
                  router.push("/auth");
                }}
              >
                Log Out
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
