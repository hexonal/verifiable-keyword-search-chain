import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Document } from "../types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, Database, ArrowLeft, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    content: string;
    name: string;
  } | null>(null);
  const [isDecrypting, setIsDecrypting] = useState<{ [key: string]: boolean }>({});

  // Load document list on mount and page change
  useEffect(() => {
    fetchDocuments();
  }, [currentPage]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    
    try {
      const response = await api.getDocumentList({
        pageNum: currentPage,
        pageSize,
      });

      if (response.code === 200) {
        setDocuments(response.data.documents);
        setTotalDocuments(response.data.total);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrypt = async (documentId: string) => {
    setIsDecrypting({ ...isDecrypting, [documentId]: true });
    
    try {
      const response = await api.decrypt({
        documentId,
      });

      if (response.code === 200) {
        setSelectedDocument({
          id: documentId,
          name: response.data.documentName,
          content: response.data.content,
        });
      }
    } catch (error) {
      console.error("Decryption failed:", error);
    } finally {
      setIsDecrypting({ ...isDecrypting, [documentId]: false });
    }
  };

  const handleCreateIndex = async (documentId: string) => {
    try {
      const response = await api.createIndex({
        documentId,
      });

      if (response.code === 200 && response.data.indexed) {
        toast.success("索引创建成功");
      }
    } catch (error) {
      console.error("Indexing failed:", error);
      toast.error("索引创建失败");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN");
  };

  const totalPages = Math.ceil(totalDocuments / pageSize);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="max-container py-10">
      <h1 className="text-3xl font-bold mb-2">文档管理</h1>
      <p className="text-muted-foreground mb-6">
        管理已上传的加密文档，可进行查看和索引操作
      </p>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span>文档列表</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              {Array(5).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>文档ID</TableHead>
                      <TableHead>文档名称</TableHead>
                      <TableHead>上传时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          暂无文档
                        </TableCell>
                      </TableRow>
                    ) : (
                      documents.map((document) => (
                        <TableRow key={document.documentId}>
                          <TableCell className="font-mono text-xs">
                            {document.documentId}
                          </TableCell>
                          <TableCell>{document.documentName}</TableCell>
                          <TableCell>
                            {formatDate(document.uploadTime)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDecrypt(document.documentId)}
                                    disabled={isDecrypting[document.documentId]}
                                    className="h-8"
                                  >
                                    <Search className="h-3 w-3 mr-1" />
                                    {isDecrypting[document.documentId]
                                      ? "解密中"
                                      : "查看"}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>{selectedDocument?.name}</DialogTitle>
                                  </DialogHeader>
                                  <ScrollArea className="max-h-[60vh]">
                                    <div className="p-4 bg-card/50 rounded-md border border-border/50">
                                      {selectedDocument?.content}
                                    </div>
                                  </ScrollArea>
                                </DialogContent>
                              </Dialog>

                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleCreateIndex(document.documentId)}
                                className="h-8"
                              >
                                <Database className="h-3 w-3 mr-1" />
                                索引
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm">
                  <div className="text-muted-foreground">
                    总计 {totalDocuments} 条记录
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="h-8 w-8"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="px-2 min-w-[5rem] text-center">
                      {currentPage} / {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
