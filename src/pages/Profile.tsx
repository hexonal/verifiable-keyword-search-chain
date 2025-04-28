
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { User, LogIn, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { isLoggedIn, userId, token, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  // Generate some mock profile data
  const joinDate = new Date();
  joinDate.setMonth(joinDate.getMonth() - Math.floor(Math.random() * 6));

  return (
    <div className="max-container py-10">
      <h1 className="text-3xl font-bold mb-6">账户信息</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                基本信息
              </CardTitle>
              <CardDescription>查看和管理您的账户信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 p-4 bg-background/50 rounded-md">
                  <div className="text-muted-foreground text-sm">用户ID</div>
                  <div className="font-mono">{userId}</div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 p-4 bg-background/50 rounded-md">
                  <div className="text-muted-foreground text-sm">访问凭证</div>
                  <div className="font-mono text-xs overflow-hidden text-ellipsis">
                    {token?.substring(0, 15)}...
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 p-4 bg-background/50 rounded-md">
                  <div className="text-muted-foreground text-sm">注册时间</div>
                  <div>{joinDate.toLocaleDateString("zh-CN")}</div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button variant="destructive" onClick={logout}>
                  退出登录
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                访问密钥
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-md">
                  <h3 className="text-sm font-medium mb-1">密钥状态</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">有效</span>
                  </div>
                </div>

                <div className="p-4 bg-background/50 rounded-md space-y-2">
                  <h3 className="text-sm font-medium">过期时间</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("zh-CN")} (7天后)
                  </p>
                </div>
              </div>

              <Button className="mt-4 w-full" variant="outline">
                刷新密钥
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
