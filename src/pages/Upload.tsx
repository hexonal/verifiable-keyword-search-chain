
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { api } from "../services/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload as UploadIcon, File, Database, Index } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Upload = () => {
  const [documentName, setDocumentName] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null);
  const [isIndexing, setIsIndexing] = useState(false);
  
  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

  const handleUpload = async () => {
    if (!documentName.trim()) {
      toast.warning("请输入文档名称");
      return;
    }

    if (!documentContent.trim()) {
      toast.warning("请输入文档内容");
      return;
    }

    setIsUploading(true);
    const cleanup = simulateProgress();
    
    try {
      const response = await api.uploadDocument({
        documentName: documentName.trim(),
        content: documentContent.trim(),
      });

      if (response.code === 200) {
        setUploadProgress(100);
        setUploadedDocId(response.data.documentId);
        toast.success("文档上传成功");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("文档上传失败");
    } finally {
      setIsUploading(false);
      cleanup();
    }
  };

  const handleCreateIndex = async () => {
    if (!uploadedDocId) return;
    
    setIsIndexing(true);
    
    try {
      const response = await api.createIndex({
        documentId: uploadedDocId,
      });

      if (response.code === 200 && response.data.indexed) {
        toast.success("索引创建成功");
      }
    } catch (error) {
      console.error("Indexing failed:", error);
      toast.error("索引创建失败");
    } finally {
      setIsIndexing(false);
    }
  };

  const resetForm = () => {
    setDocumentName("");
    setDocumentContent("");
    setUploadedDocId(null);
    setUploadProgress(0);
  };

  return (
    <div className="max-container py-10">
      <h1 className="text-3xl font-bold mb-2">上传文档</h1>
      <p className="text-muted-foreground mb-6">
        上传文档将进行加密处理并建立索引，以支持安全的多关键字检索
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" />
                文档信息
              </CardTitle>
              <CardDescription>
                输入文档名称和内容，系统将进行加密处理
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="document-name">
                    文档名称
                  </label>
                  <Input
                    id="document-name"
                    placeholder="输入文档名称"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    disabled={isUploading || !!uploadedDocId}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="document-content">
                    文档内容
                  </label>
                  <Textarea
                    id="document-content"
                    placeholder="输入文档内容"
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    rows={10}
                    disabled={isUploading || !!uploadedDocId}
                    className="resize-none bg-background/50"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              {!uploadedDocId ? (
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !documentName || !documentContent}
                  className="gap-2"
                >
                  <UploadIcon className="h-4 w-4" />
                  {isUploading ? "上传中..." : "上传文档"}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    disabled={isIndexing}
                  >
                    上传新文档
                  </Button>
                  <Button
                    onClick={handleCreateIndex}
                    disabled={isIndexing}
                    className="gap-2"
                  >
                    <Index className="h-4 w-4" />
                    {isIndexing ? "索引中..." : "创建索引"}
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                上传状态
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">上传进度</span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>

                {uploadedDocId && (
                  <div className="space-y-2 p-3 bg-primary/5 border border-primary/20 rounded-md">
                    <h3 className="text-sm font-medium">上传成功</h3>
                    <p className="text-xs text-muted-foreground">
                      文档ID:{" "}
                      <span className="font-mono">{uploadedDocId}</span>
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">上传流程</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <div className={`rounded-full p-1 mt-0.5 ${uploadProgress > 0 ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                        <div className="h-2 w-2 rounded-full" />
                      </div>
                      <span className={uploadProgress > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                        文档加密
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className={`rounded-full p-1 mt-0.5 ${uploadProgress > 50 ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                        <div className="h-2 w-2 rounded-full" />
                      </div>
                      <span className={uploadProgress > 50 ? 'text-foreground' : 'text-muted-foreground'}>
                        区块链存储
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className={`rounded-full p-1 mt-0.5 ${uploadProgress === 100 ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                        <div className="h-2 w-2 rounded-full" />
                      </div>
                      <span className={uploadProgress === 100 ? 'text-foreground' : 'text-muted-foreground'}>
                        上传完成
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;
