
import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { LocationData } from "@/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface CascadingLocationDropdownProps {
  locationData: LocationData[];
  onChange: (location: { level1: string; level2: string; level3: string }) => void;
  value?: { level1: string; level2: string; level3: string };
}

const CascadingLocationDropdown = ({
  locationData,
  onChange,
  value = { level1: "", level2: "", level3: "" }
}: CascadingLocationDropdownProps) => {
  const [level1, setLevel1] = useState<string>(value.level1 || "");
  const [level2, setLevel2] = useState<string>(value.level2 || "");
  const [level3, setLevel3] = useState<string>(value.level3 || "");
  
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [level2Options, setLevel2Options] = useState<LocationData[]>([]);
  const [level3Options, setLevel3Options] = useState<LocationData[]>([]);
  const [displayedSelection, setDisplayedSelection] = useState("");

  // Update level 2 options when level 1 changes
  useEffect(() => {
    if (level1) {
      const selectedLocation = locationData.find(location => location.name === level1);
      setLevel2Options(selectedLocation?.children || []);
      
      if (level2 === "") {
        setCurrentLevel(2);
      }
    } else {
      setLevel2Options([]);
      setLevel2("");
      setLevel3("");
      setCurrentLevel(1);
    }
  }, [level1, locationData]);

  // Update level 3 options when level 2 changes
  useEffect(() => {
    if (level2) {
      const selectedLevel1 = locationData.find(location => location.name === level1);
      const selectedLevel2 = selectedLevel1?.children?.find(location => location.name === level2);
      setLevel3Options(selectedLevel2?.children || []);
      
      if (level3 === "") {
        setCurrentLevel(3);
      }
    } else {
      setLevel3Options([]);
      setLevel3("");
    }
  }, [level2, level1, locationData]);

  // Update parent component when any level changes
  useEffect(() => {
    onChange({ level1, level2, level3 });
    
    // Update displayed selection
    if (level3) {
      setDisplayedSelection(level3);
    } else if (level2) {
      setDisplayedSelection(level2);
    } else if (level1) {
      setDisplayedSelection(level1);
    } else {
      setDisplayedSelection("");
    }
  }, [level1, level2, level3, onChange]);

  const handleGoBack = () => {
    if (currentLevel === 3) {
      setLevel3("");
      setCurrentLevel(2);
    } else if (currentLevel === 2) {
      setLevel2("");
      setCurrentLevel(1);
    }
  };

  const renderCurrentLevelSelector = () => {
    switch (currentLevel) {
      case 1:
        return (
          <div className="space-y-2">
            <Label htmlFor="level1">Select Zone</Label>
            <Select 
              value={level1} 
              onValueChange={setLevel1}
            >
              <SelectTrigger id="level1">
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
        );
      case 2:
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="level2">Select Sub-zone</Label>
              <Button variant="ghost" size="sm" onClick={handleGoBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
            <Select 
              value={level2} 
              onValueChange={setLevel2}
            >
              <SelectTrigger id="level2">
                <SelectValue placeholder="Select sub-zone" />
              </SelectTrigger>
              <SelectContent>
                {level2Options.map((location) => (
                  <SelectItem key={location.name} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 3:
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="level3">Select Area</Label>
              <Button variant="ghost" size="sm" onClick={handleGoBack}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
            <Select 
              value={level3} 
              onValueChange={setLevel3}
            >
              <SelectTrigger id="level3">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {level3Options.map((location) => (
                  <SelectItem key={location.name} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Encroachment Zone</Label>
        {displayedSelection ? (
          <div className="flex items-center justify-between">
            <div className="px-3 py-2 border rounded-md bg-muted/30">
              {displayedSelection}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (level3) {
                  setCurrentLevel(3);
                } else if (level2) {
                  setCurrentLevel(2);
                } else {
                  setCurrentLevel(1);
                }
              }}
            >
              Change
            </Button>
          </div>
        ) : (
          renderCurrentLevelSelector()
        )}
      </div>
    </div>
  );
};

export default CascadingLocationDropdown;
