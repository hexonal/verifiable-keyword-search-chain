
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterFormData>();
  
  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.register({
        username: data.username,
        password: data.password,
      });
      
      if (response.code === 200) {
        toast.success("注册成功，请登录");
        navigate("/login");
      } else {
        toast.error(response.message || "注册失败，请重试");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3 ring-1 ring-primary/20">
              <Database className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">创建账户</CardTitle>
          <CardDescription>
            注册一个新账户以访问区块链可验证检索系统
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="username">
                用户名
              </label>
              <div className="relative">
                <Input
                  id="username"
                  placeholder="输入用户名"
                  className="bg-background/50"
                  disabled={isLoading}
                  {...register("username", { required: "用户名不能为空" })}
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                密码
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="设置密码"
                  className="bg-background/50"
                  disabled={isLoading}
                  {...register("password", { 
                    required: "密码不能为空",
                    minLength: {
                      value: 6,
                      message: "密码长度不能少于6位"
                    }
                  })}
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
                确认密码
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  className="bg-background/50"
                  disabled={isLoading}
                  {...register("confirmPassword", { 
                    required: "请确认密码",
                    validate: value => value === password || "两次输入的密码不匹配" 
                  })}
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "注册中..." : "注册"}
            </Button>
            <p className="text-center text-sm">
              已有账户？{" "}
              <Link to="/login" className="text-primary hover:underline">
                立即登录
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
