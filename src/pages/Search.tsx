
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search as SearchIcon, FileText, Check } from "lucide-react";
import { api } from "../services/api";
import { SearchResult } from "../types/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const Search = () => {
  const [keywordInput, setKeywordInput] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    content: string;
    name: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState<{ [key: string]: boolean }>({});
  const [verificationResults, setVerificationResults] = useState<{
    [key: string]: { verified: boolean; rootHash: string } | null;
  }>({});
  const [isDecrypting, setIsDecrypting] = useState<{ [key: string]: boolean }>({});

  const handleSearch = async () => {
    if (!keywordInput.trim()) {
      toast.warning("请输入搜索关键词");
      return;
    }

    setIsLoading(true);
    setSearchResults([]);

    try {
      const keywords = keywordInput
        .trim()
        .split(/[\s,，;；]+/)
        .filter(Boolean);

      const response = await api.search({
        keywords,
        topK: 10,
      });

      if (response.code === 200) {
        setSearchResults(response.data.results);
        if (response.data.results.length === 0) {
          toast("没有找到匹配的文档");
        }
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (documentId: string, merkleProof: string[]) => {
    setIsVerifying({ ...isVerifying, [documentId]: true });
    
    try {
      const response = await api.verify({
        documentId,
        merkleProof,
      });

      if (response.code === 200) {
        setVerificationResults({
          ...verificationResults,
          [documentId]: {
            verified: response.data.verified,
            rootHash: response.data.rootHash,
          },
        });
        
        if (response.data.verified) {
          toast.success("文档验证成功，内容未被篡改");
        } else {
          toast.error("文档验证失败，内容可能已被篡改");
        }
      }
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsVerifying({ ...isVerifying, [documentId]: false });
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

  const formatScore = (score: number) => {
    return (score * 100).toFixed(0) + "%";
  };

  const truncateMerkleProof = (proof: string) => {
    return proof.substring(0, 8) + "..." + proof.substring(proof.length - 8);
  };

  return (
    <div className="max-container py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">多关键字搜索</h1>
        <p className="text-muted-foreground mb-6">
          输入多个关键字进行文档检索，关键字可用空格、逗号或分号分隔
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <Input
              placeholder="输入关键字，如：区块链 验证 加密"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="bg-card/50"
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading} className="gap-2">
            <SearchIcon className="h-4 w-4" />
            {isLoading ? "检索中..." : "检索文档"}
          </Button>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">搜索结果</h2>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && searchResults.length === 0 && keywordInput && (
          <p className="text-muted-foreground py-10 text-center">
            没有找到匹配的文档
          </p>
        )}

        {!isLoading &&
          searchResults.map((result) => (
            <Card key={result.documentId} className="border-border/50 bg-card/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{result.documentName}</CardTitle>
                  <Badge variant="secondary">匹配度: {formatScore(result.score)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-muted-foreground">
                      Merkle证明 (部分)
                    </h4>
                    <div className="flex flex-wrap gap-2 font-mono text-xs">
                      {result.merkleProof.map((proof, index) => (
                        <span
                          key={index}
                          className="bg-background/50 p-1 rounded border border-border/50"
                        >
                          {truncateMerkleProof(proof)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {verificationResults[result.documentId] && (
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
                      <div className="flex items-start gap-2">
                        <div className={`rounded-full p-1 ${verificationResults[result.documentId]?.verified ? 'bg-green-500/20 text-green-500' : 'bg-destructive/20 text-destructive'}`}>
                          <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">
                            验证
                            {verificationResults[result.documentId]?.verified
                              ? "成功"
                              : "失败"}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            根哈希:{" "}
                            <span className="font-mono">
                              {truncateMerkleProof(
                                verificationResults[result.documentId]?.rootHash || ""
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleVerify(result.documentId, result.merkleProof)
                  }
                  disabled={isVerifying[result.documentId]}
                >
                  {isVerifying[result.documentId] ? "验证中..." : "验证文档"}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => handleDecrypt(result.documentId)}
                      disabled={isDecrypting[result.documentId]}
                    >
                      {isDecrypting[result.documentId] ? "解密中..." : "查看文档"}
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
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Search;
