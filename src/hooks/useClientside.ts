import { useEffect, useState } from "react";

function useClientside() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return {
    isClient,
    setIsClient,
  };
}

export default useClientside;
