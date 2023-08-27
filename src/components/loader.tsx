import { Loader2 } from "lucide-react";
import { cn } from "~/utils/cn";

interface LoaderProps {
  className?: string;
  children: JSX.Element;
  isLoading: boolean;
}

function Loader({ className, children, isLoading }: LoaderProps) {
  if (isLoading) return <Loader2 className={cn("animate-spin", className)} />;
  return children;
}

export default Loader;
