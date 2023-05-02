import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { deleteUser, getUser, getUserOrders } from "../../axios/userApi";
import Loading from "../basic/Loading";
import { FaShoppingBag } from "react-icons/fa";

const UserDetails = ({ id }: { id: number }) => {
  //   return <h2>{id}</h2>
  const router = useRouter();

  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    data: user,
  } = useQuery(["user", id], () => (id ? getUser(id) : null));

  const { data: userOrders } = useQuery(["userOrders", id], () =>
    id ? getUserOrders(id) : null,
  );
  console.log(userOrders);
  const { mutate, isLoading: deleteLoading } = useMutation(deleteUser, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["users"]);
      await router.push("/users");
    },
  });
  if (isError) {
    return <h2>Something went wrong!</h2>;
  }
  if (isLoading || deleteLoading) {
    return <Loading />;
  }
  if (user) {
    return (
      <div className="gap-y-10 flex flex-col items-center p-8 bg-gray-100">
        <Link href="/enquiries" className="p-2 font-bold bg-white rounded-md">
          Go To Enquiries
        </Link>

        <div className="flex justify-between w-full p-4 bg-white rounded-md">
          <h2 className="text-2xl font-semibold text-gray-400">
            USER ID- {user.id}
            <span className="block text-sm text-gray-500">
              Status:{user.userStatus}
            </span>
          </h2>
          <div className="gap-x-2 flex items-center">
            <Link
              href={`/edituser/${user.id}`}
              className="p-1.5 bg-blue-200 rounded-md"
            >
              Edit
            </Link>
            <button
              className="bg-red-200 p-1.5 rounded-md"
              onClick={() => mutate(user.id)}
            >
              Delete
            </button>
          </div>
        </div>
        <div className="w-full">
          <h3 className="text-md font-semibold text-gray-400">
            USER INFORMATION
          </h3>
          <div className="flex flex-wrap items-center gap-8 p-4">
            <div className="flex flex-col space-y-2 min-w-[18rem]">
              <p className="text-sm font-semibold text-gray-500">
                INSTITUTE NAME
              </p>
              <span className="p-2 font-thin bg-white rounded-md shadow-md">
                {user.instituteName}
              </span>
            </div>
            <div className="flex flex-col space-y-2 min-w-[18rem]">
              <p className="text-sm font-semibold text-gray-500">OWNER NAME</p>
              <span className="p-2 font-thin bg-white rounded-md shadow-md">
                {user.ownersName}
              </span>
            </div>
            <div className="flex flex-col space-y-2 min-w-[18rem]">
              <p className="text-sm font-semibold text-gray-500">
                MANAGER NAME
              </p>
              <span className="p-2 font-thin bg-white rounded-md shadow-md">
                {user.managersName}
              </span>
            </div>
            <div className="flex flex-col space-y-2 min-w-[18rem]">
              <p className="text-sm font-semibold text-gray-500">DESCRIPTION</p>
              <span className="p-2 font-thin bg-white rounded-md shadow-md">
                {user.description}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full">
          <h3 className="text-md font-semibold text-gray-400">STATUS</h3>
          <div className="flex flex-col p-4 space-y-2">
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex flex-col space-y-2 min-w-[18rem] ">
                <p className="text-sm font-semibold text-gray-500">
                  CURRENT STATUS
                </p>
                <span className="p-2 font-thin bg-white rounded-md shadow-md">
                  {user.userStatus}
                </span>
              </div>
              <div className="flex flex-col min-w-[18rem] space-y-2">
                <p className="text-sm font-semibold text-gray-500">LEAD TYPE</p>
                <span className="p-2 font-thin bg-white rounded-md shadow-md">
                  {user.leadType}
                </span>
              </div>
              <div className="flex flex-col min-w-[18rem] space-y-2">
                <p className="text-sm font-semibold text-gray-500">
                  LEAD SOURCE
                </p>
                <span className="p-2 font-thin bg-white rounded-md shadow-md">
                  {user.leadSource}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <h3 className="text-md font-semibold text-gray-400">PURCHASES</h3>
          <div className="md:grid-cols-9 sm:grid-cols-3 grid items-center justify-between grid-cols-2 gap-4 p-2 my-3 font-semibold">
            <span>Order No</span>
            <span className="sm:text-left text-right">Products</span>
            <span className="md:grid hidden">Total</span>
            <span className="sm:grid hidden">Discount</span>
            <span className="sm:grid hidden">Paid</span>
            <span className="sm:grid hidden">Balance</span>
            <span className="sm:grid hidden">Due Date</span>
            <span className="sm:grid hidden">Method</span>
            <span className="sm:grid hidden">Paid By</span>
          </div>
          <ul className="bg-gray-50 p-1.5 border">
            {userOrders &&
              userOrders.map((order) => (
                <li key={order.id}>
                  <div className="grid grid-cols-9 gap-8 text-sm">
                    <div className="flex">
                      <div className="pl-2">
                        <FaShoppingBag className=" text-orange-800" />
                        <p className="text-cyan-600 text-sm font-semibold cursor-pointer">
                          Order Id: {order.id}
                        </p>
                        <p className=" text-xs text-gray-800">
                          {order.orderDate}
                        </p>
                      </div>
                    </div>
                    <ul className="gap-y-2 flex flex-col">
                      {order.products.map((product) => {
                        if (product?.isSelected) {
                          return (
                            <li key={product.id} className="flex flex-col">
                              <span className="font-semibold">
                                {" "}
                                {product.productName}
                              </span>
                              <span className=" text-xs text-gray-600">
                                {" "}
                                From: {product.validityFrom}
                              </span>
                              <span className=" text-xs text-gray-600">
                                {" "}
                                Until: {product.validityUntil}
                              </span>
                            </li>
                          );
                        }
                      })}
                    </ul>
                    <p>￡{order.totalAmount}</p>
                    <p>￡{order.totalDiscount}</p>
                    <p>￡{order.paidAmount}</p>
                    <p>￡{order.dueAmount}</p>
                    <p>{order.dueDate}</p>
                    <p>{order.paymentMode}</p>
                    <p>{order.paidBy}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <span className="border-b-[1px] border-gray-300 w-full"></span>
        <div className="w-full">
          <h3 className="text-md font-semibold text-gray-400">
            CONTACT INFORMATION
          </h3>
          <div className="flex flex-wrap items-center gap-10 p-4">
            <div className="flex flex-col space-y-2 min-w-[18rem] ">
              <p className="text-sm font-semibold text-gray-500">EMAIL</p>
              <span className="p-2 font-thin bg-white rounded-md shadow-md">
                {user.email}
              </span>
            </div>
            <div className="flex flex-col min-w-[18rem] space-y-2">
              <p className="text-sm font-semibold text-gray-500">PHONE 1</p>
              <span className="p-2 font-thin bg-white rounded-md shadow-md">
                {user.phone1}
              </span>
            </div>
            <div className="flex flex-col space-y-2 min-w-[18rem] ">
              <p className="text-sm font-semibold text-gray-500">PHONE 2</p>
              <span className="p-2 font-thin bg-white rounded-md shadow-md">
                {user.phone2}
              </span>
            </div>
            <div className="flex flex-col space-y-2 min-w-[18rem] ">
              <p className="text-sm font-semibold text-gray-500">WEBSITE</p>
              <span className="p-2 font-thin bg-white rounded-md shadow-md">
                {user.website}
              </span>
            </div>
            <div className="flex flex-col space-y-2 min-w-[18rem] ">
              <p className="text-sm font-semibold text-gray-500">ADDRESS</p>
              <span className="p-2 font-thin bg-white rounded-md shadow-md">
                {user.address}
              </span>
            </div>
          </div>
        </div>
      </div>
    );

    // REVIEW:
  } else return null;
};

export default UserDetails;
