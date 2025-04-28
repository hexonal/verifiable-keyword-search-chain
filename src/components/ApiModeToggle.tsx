
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { API_CONFIG } from "../config/api.config";
import { useState } from "react";

const ApiModeToggle = () => {
  const [useMock, setUseMock] = useState(API_CONFIG.useMockData);

  const handleToggle = (checked: boolean) => {
    setUseMock(checked);
    API_CONFIG.useMockData = checked;
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="api-mode"
        checked={useMock}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="api-mode">使用模拟数据</Label>
    </div>
  );
};

export default ApiModeToggle;
