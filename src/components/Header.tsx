
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Database, Search, Upload, LogIn, User } from "lucide-react";

export function Header() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
      <div className="max-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <span className="font-mono text-xl font-bold tracking-tight glow-effect">
              BlockchainSearch
            </span>
          </Link>

          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-5 text-sm">
              <Link
                to="/search"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Search className="h-4 w-4" />
                <span>搜索</span>
              </Link>
              <Link
                to="/upload"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Upload className="h-4 w-4" />
                <span>上传</span>
              </Link>
              <Link
                to="/documents"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Database className="h-4 w-4" />
                <span>文档</span>
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="sm" onClick={logout}>
                退出
              </Button>
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                <span>登录</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
