import { useState } from "react";

export const useErrorHandlingHook = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return { isError, setIsError, errorMessage, setErrorMessage };
};
