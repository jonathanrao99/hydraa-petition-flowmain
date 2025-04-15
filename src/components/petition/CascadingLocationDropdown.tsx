import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface Location {
  name: string;
  children?: Location[];
}

interface CascadingLocationDropdownProps {
  locationData: Location[];
  onChange: (location: { level1: string; level2: string; level3: string }) => void;
  value: { level1: string; level2: string; level3: string };
}

const CascadingLocationDropdown = ({
  locationData,
  onChange,
  value,
}: CascadingLocationDropdownProps) => {
  const [level1, setLevel1] = useState(value.level1);
  const [level2, setLevel2] = useState(value.level2);
  const [level3, setLevel3] = useState(value.level3);

  const handleLevel1Change = (value: string) => {
    setLevel1(value);
    setLevel2("");
    setLevel3("");
    onChange({ level1: value, level2: "", level3: "" });
  };

  const handleLevel2Change = (value: string) => {
    setLevel2(value);
    setLevel3("");
    onChange({ level1, level2: value, level3: "" });
  };

  const handleLevel3Change = (value: string) => {
    setLevel3(value);
    onChange({ level1, level2, level3: value });
  };

  const getLevel2Options = () => {
    const selectedLevel1 = locationData.find((loc) => loc.name === level1);
    return selectedLevel1?.children || [];
  };

  const getLevel3Options = () => {
    const selectedLevel1 = locationData.find((loc) => loc.name === level1);
    const selectedLevel2 = selectedLevel1?.children?.find((loc) => loc.name === level2);
    return selectedLevel2?.children || [];
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Encroachment Zone</Label>
        <div className="grid gap-4">
          {/* Zone Selection */}
          <div className="space-y-2">
            <Label>Zone</Label>
            <Select value={level1} onValueChange={handleLevel1Change}>
              <SelectTrigger>
                <SelectValue placeholder="Select zone" />
              </SelectTrigger>
              <SelectContent>
                {locationData.map((location) => (
                  <SelectItem key={location.name} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Area Selection */}
          {level1 && (
            <div className="space-y-2">
              <Label>Area</Label>
              <Select 
                value={level2} 
                onValueChange={handleLevel2Change}
                disabled={!level1}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {getLevel2Options().map((location) => (
                    <SelectItem key={location.name} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sub-Area Selection */}
          {level2 && (
            <div className="space-y-2">
              <Label>Sub-Area</Label>
              <Select 
                value={level3} 
                onValueChange={handleLevel3Change}
                disabled={!level2}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-area" />
                </SelectTrigger>
                <SelectContent>
                  {getLevel3Options().map((location) => (
                    <SelectItem key={location.name} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CascadingLocationDropdown;
