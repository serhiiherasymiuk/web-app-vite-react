import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <Link
        to={"category"}
        type="button"
        className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
      >
        Categories
      </Link>
      <Link
        to={"product"}
        type="button"
        className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
      >
        Products
      </Link>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
