import { LoginButton } from "@/components/auth/LoginButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl text-gray-900">Welcome to LogiFlow</CardTitle>
          <p className="text-sm text-gray-600">Secure logistics management platform</p>
        </CardHeader>
        <CardContent>
          <LoginButton />
          <p className="text-center text-xs text-gray-500 mt-4">
            Secure authentication powered by Auth0
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
