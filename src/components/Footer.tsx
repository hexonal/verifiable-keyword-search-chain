
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-6 bg-background/50">
      <div className="max-container flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} 区块链可验证多关键字加密检索系统
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            首页
          </Link>
          <Link to="/about" className="hover:text-foreground transition-colors">
            关于
          </Link>
        </div>
      </div>
    </footer>
  );
}
