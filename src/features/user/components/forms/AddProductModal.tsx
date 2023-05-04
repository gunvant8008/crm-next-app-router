import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Product } from "../../types/userTypes";
import { addProduct } from "../../axios/userApi";

const AddProductSchema = z.object({
  productName: z
    .string()
    .min(5, {
      message: "Product name must be grater than or equal to 5 characters.",
    })
    .max(100),
  productPrice: z.number().min(0),
  productDescription: z
    .string()
    .min(5, {
      message:
        "Product description must be grater than or equal to 5 characters.",
    })
    .max(100),
  validityInMonths: z
    .number()
    .min(1, {
      message: "Product validity must be the multiple of 1 month.",
    })
    .max(100),
});
type TAddProductSchema = z.infer<typeof AddProductSchema>;
type TModalProps = {
  buttonText: string;
  title: string;
  className: string;
};

const AddProductModal = ({ buttonText, title, className }: TModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation(addProduct, {
    onMutate: async (product: TAddProductSchema) => {
      await queryClient.cancelQueries(["products"]);
      const previousProducts = queryClient.getQueryData<Product[]>([
        "products",
      ]);
      const newId = 0;
      const newProduct = queryClient.setQueryData(
        ["product", newId.toString()],
        {
          ...product,
          id: 0,
        },
      );
      queryClient.setQueryData(["products"], (old: Product[] | undefined) => {
        return newProduct && old ? [newProduct, ...old] : old;
      });
      setShowModal(false);

      return { previousProducts };
    },
    onError: (context: { previousProducts: Product[] }) => {
      queryClient.setQueryData(["products"], context.previousProducts);
      setShowModal(false);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["products"]);
      setShowModal(false);
    },
  });

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAddProductSchema>({
    resolver: zodResolver(AddProductSchema),
  });

  useEffect(() => {
    reset();
  }, [reset, showModal]);

  const onSubmit = (data: TAddProductSchema) => {
    mutate(data);
    // console.log(data)
  };

  return (
    <>
      <button
        className={
          "active:bg-green-400 focus:outline-none px-6 font-semibold text-black bg-green-200 rounded shadow outline-none " +
          className
        }
        type="button"
        onClick={() => setShowModal(true)}
      >
        {buttonText}
      </button>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-25" />
          <div className="focus:outline-none fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none">
            <div className="relative w-[70vw] mx-auto my-6">
              <div className="focus:outline-none relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none">
                <div className=" flex items-start justify-between p-5 border-b border-gray-300 border-solid">
                  <h3 className="text-3xl font=semibold">{title}</h3>
                  <button
                    className=" float-right text-black bg-transparent border-0"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="opacity-7 flex items-center justify-center w-6 h-6 py-0 text-xl text-black bg-gray-300 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative flex-auto p-6">
                  <form
                    className="flex flex-col w-full px-8 pt-6 pb-8 space-y-4 bg-gray-200 rounded shadow-md"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <label className="block mb-1 text-sm font-semibold text-black">
                      Id
                      <input
                        readOnly
                        placeholder="Id"
                        className="w-full px-1 py-2 text-black border rounded shadow appearance-none"
                      />
                    </label>
                    <label className="block mb-1 text-sm font-semibold text-black">
                      Product Name
                      <input
                        className="w-full px-1 py-2 text-black border rounded shadow appearance-none"
                        {...register("productName")}
                      />
                    </label>
                    {errors.productName ? (
                      <span className=" text-sm text-red-400">
                        {errors.productName.message}
                      </span>
                    ) : null}
                    <label className="block mb-1 text-sm font-semibold text-black">
                      Product Price
                      <input
                        className="w-full px-1 py-2 text-black border rounded shadow appearance-none"
                        {...register("productPrice", { valueAsNumber: true })}
                      />
                    </label>
                    {errors.productPrice ? (
                      <span className=" text-sm text-red-400">
                        {errors.productPrice.message}
                      </span>
                    ) : null}
                    <label className="block mb-1 text-sm font-semibold text-black">
                      Description
                      <input
                        className="w-full px-1 py-2 text-black border rounded shadow appearance-none"
                        {...register("productDescription")}
                      />
                    </label>
                    {errors.productDescription ? (
                      <span className=" text-sm text-red-400">
                        {errors.productDescription.message}
                      </span>
                    ) : null}
                    <label className="block mb-1 text-sm font-semibold text-black">
                      Validity in Months
                      <input
                        placeholder="12"
                        className="w-full px-1 py-2 text-black border rounded shadow appearance-none"
                        {...register("validityInMonths", {
                          valueAsNumber: true,
                        })}
                      />
                    </label>
                    <div className="border-blueGray-200 flex items-center justify-between pt-8">
                      <button
                        className="background-transparent focus:outline-none px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase outline-none"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                      <button
                        className="active:bg-blue-700 hover:shadow-lg focus:outline-none px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase bg-blue-500 rounded shadow outline-none"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default AddProductModal;