import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Database, Search, Upload, Lock, FileText, File } from "lucide-react";
import { api } from "../services/api";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { isLoggedIn } = useAuth();
  const [rootHash, setRootHash] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRootHash = async () => {
      setIsLoading(true);
      try {
        const response = await api.getRootHash();
        if (response.code === 200) {
          setRootHash(response.data.rootHash);
          setTimestamp(response.data.timestamp);
        }
      } catch (error) {
        console.error("Failed to fetch root hash:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRootHash();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString("zh-CN");
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 glow-effect">
            基于区块链的可验证多关键字加密检索系统
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-muted-foreground mb-10">
            利用区块链技术实现安全、可验证的文档加密存储与多关键字检索，确保文档真实性与完整性
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/search">
                  <Button size="lg" className="gap-2">
                    <Search className="h-5 w-5" />
                    开始检索
                  </Button>
                </Link>
                <Link to="/upload">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Upload className="h-5 w-5" />
                    上传文档
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <Button size="lg" className="gap-2">
                  <Lock className="h-5 w-5" />
                  立即登录
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* System Information */}
      <section className="bg-card/30 py-16 backdrop-blur-sm">
        <div className="max-container">
          <h2 className="text-center text-3xl font-bold mb-12">系统架构</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card/50 p-6 rounded-xl border border-border/50 backdrop-blur-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                <Lock className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">加密存储</h3>
              <p className="text-muted-foreground">
                文档内容进行加密处理后存储，确保即使数据泄露也无法直接访问原始内容。
              </p>
            </div>
            
            <div className="bg-card/50 p-6 rounded-xl border border-border/50 backdrop-blur-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                <FileText className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">索引构建</h3>
              <p className="text-muted-foreground">
                基于TF-IDF算法建立文档索引，并使用Merkle树结构确保索引内容不被篡改。
              </p>
            </div>
            
            <div className="bg-card/50 p-6 rounded-xl border border-border/50 backdrop-blur-sm">
              <div className="bg-primary/10 w-12 h-12 rounded-lg mb-4 flex items-center justify-center">
                <Search className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">多关键字检索</h3>
              <p className="text-muted-foreground">
                支持基于多个关键字的文档检索，通过Merkle证明验证检索结果的有效性。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blockchain Status */}
      <section className="py-16">
        <div className="max-container">
          <h2 className="text-center text-3xl font-bold mb-12">区块链状态</h2>
          
          <div className="bg-card/30 p-6 rounded-xl border border-border/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-muted-foreground">当前根哈希</h3>
                <div className="font-mono text-sm overflow-x-auto p-3 bg-background/50 rounded-md border border-border/50">
                  {isLoading ? (
                    <div className="animate-pulse h-6 bg-muted/50 rounded"></div>
                  ) : rootHash || "无可用数据"}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-muted-foreground">最后更新时间</h3>
                <div className="font-mono text-sm p-3 bg-background/50 rounded-md border border-border/50">
                  {isLoading ? (
                    <div className="animate-pulse h-6 bg-muted/50 rounded"></div>
                  ) : formatTimestamp(timestamp) || "无可用数据"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
