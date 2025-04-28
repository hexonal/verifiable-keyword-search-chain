
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Blockchain, Search, Lock, Database } from "lucide-react";

const About = () => {
  return (
    <div className="max-container py-10">
      <h1 className="text-3xl font-bold mb-6">关于系统</h1>
      
      <div className="space-y-8">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Blockchain className="h-5 w-5 text-primary" />
              系统简介
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              本系统是一个基于区块链技术的可验证多关键字加密检索系统。通过结合区块链的不可篡改特性与加密技术，实现了对敏感文档的安全存储和高效检索。
            </p>
            <p>
              系统主要解决了传统检索系统中存在的数据安全性、检索结果可信度以及多关键字检索等问题，为用户提供了一个安全可靠的文档管理与检索平台。
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              技术特点
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">区块链存储</h3>
                <p className="text-muted-foreground">
                  利用区块链技术的不可篡改特性，确保存储的文档和索引的完整性和真实性，防止数据被非法修改。
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">加密存储</h3>
                <p className="text-muted-foreground">
                  采用高效的加密算法对文档内容进行加密，保护文档内容的机密性，即使数据泄露也无法直接获取原始内容。
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">多关键字检索</h3>
                <p className="text-muted-foreground">
                  基于改进的TF-IDF算法，支持多个关键字的复合检索，提高检索的精确度和灵活性。
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Merkle验证</h3>
                <p className="text-muted-foreground">
                  通过Merkle树结构，为检索结果提供密码学证明，用户可验证检索结果的有效性和完整性。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              使用流程
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-border"></div>
              
              <ol className="space-y-8 relative">
                <li className="pl-10 relative">
                  <div className="absolute left-[14.5px] -translate-x-1/2 top-1.5 w-3 h-3 rounded-full bg-primary"></div>
                  <h3 className="text-lg font-medium mb-1">文档上传</h3>
                  <p className="text-muted-foreground">
                    用户上传文档，系统自动对文档内容进行加密处理，并存储到区块链上确保安全性。
                  </p>
                </li>
                
                <li className="pl-10 relative">
                  <div className="absolute left-[14.5px] -translate-x-1/2 top-1.5 w-3 h-3 rounded-full bg-primary"></div>
                  <h3 className="text-lg font-medium mb-1">索引构建</h3>
                  <p className="text-muted-foreground">
                    系统为上传的文档构建索引，提取关键词并计算权重，构建Merkle树结构用于后续验证。
                  </p>
                </li>
                
                <li className="pl-10 relative">
                  <div className="absolute left-[14.5px] -translate-x-1/2 top-1.5 w-3 h-3 rounded-full bg-primary"></div>
                  <h3 className="text-lg font-medium mb-1">多关键字检索</h3>
                  <p className="text-muted-foreground">
                    用户输入多个关键字进行检索，系统返回最相关的文档列表及各文档的相关度评分。
                  </p>
                </li>
                
                <li className="pl-10 relative">
                  <div className="absolute left-[14.5px] -translate-x-1/2 top-1.5 w-3 h-3 rounded-full bg-primary"></div>
                  <h3 className="text-lg font-medium mb-1">结果验证</h3>
                  <p className="text-muted-foreground">
                    用户可对检索结果进行验证，确认文档内容未被篡改，结果可靠有效。
                  </p>
                </li>
                
                <li className="pl-10 relative">
                  <div className="absolute left-[14.5px] -translate-x-1/2 top-1.5 w-3 h-3 rounded-full bg-primary"></div>
                  <h3 className="text-lg font-medium mb-1">文档解密查看</h3>
                  <p className="text-muted-foreground">
                    对验证有效的文档，用户可进行解密并查看原始内容。
                  </p>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              系统构成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                本系统由以下几个核心模块组成：
              </p>
              
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <span className="font-medium">用户认证模块</span>：
                  <span className="text-muted-foreground">负责用户登录及身份验证</span>
                </li>
                <li>
                  <span className="font-medium">文档管理模块</span>：
                  <span className="text-muted-foreground">处理文档的上传、加密存储和索引构建</span>
                </li>
                <li>
                  <span className="font-medium">检索引擎模块</span>：
                  <span className="text-muted-foreground">实现多关键字检索算法，支持高效检索</span>
                </li>
                <li>
                  <span className="font-medium">区块链存储模块</span>：
                  <span className="text-muted-foreground">使用区块链技术存储文档和索引数据</span>
                </li>
                <li>
                  <span className="font-medium">验证模块</span>：
                  <span className="text-muted-foreground">基于Merkle树实现检索结果的密码学验证</span>
                </li>
              </ul>
              
              <p className="text-sm text-muted-foreground mt-6">
                注：本系统仅用于演示和学习目的，使用模拟数据和简化的加密算法。在实际应用中，应采用更强大的加密技术和真实的区块链网络。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
