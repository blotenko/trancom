import { useAuth } from "./AuthProvider";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button
      onClick={logout}
      variant="ghost"
      className="w-full justify-start text-gray-700 hover:bg-gray-100"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  );
};
