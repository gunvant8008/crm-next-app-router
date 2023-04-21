interface TextFieldWithLabelProps {
  labelText: string;
  inputType?: "text" | "number" | "email" | "password";
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  error?: string;
  inputProps?: unknown;
  //   {
  //     onChange?: (ev: unknown) => unknown
  //     onBlur?: (ev: unknown) => unknown
  //     ref?: RefCallback<HTMLInputElement>
  //     name?: "string"
  //     min?: string | number
  //     max?: string | number
  //     maxLength?: number
  //     minLength?: number
  //     pattern?: string
  //     required?: boolean
  //     disabled?: boolean
  //   }
}

export const TextFieldWithLabel = ({
  labelText,
  inputType,
  error,
  inputProps,
  ...rest
}: TextFieldWithLabelProps) => {
  return (
    <label className="flex flex-col">
      {labelText}
      <input
        className=" p-1 text-black"
        type={inputType ?? "text"}
        // {...register("albumId", { required: "Album Id is required" })}
        {...(inputProps ?? {})}
        {...rest}
      />
      {error ? <span className=" text-sm text-red-300">{error}</span> : null}
    </label>
  );
};