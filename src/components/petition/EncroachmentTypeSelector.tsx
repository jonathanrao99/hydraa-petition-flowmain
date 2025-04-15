import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EncroachmentType } from "@/types";
import { X } from "lucide-react";

interface EncroachmentTypeSelectorProps {
  types: EncroachmentType[];
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

const EncroachmentTypeSelector = ({
  types,
  selectedTypes,
  onChange,
}: EncroachmentTypeSelectorProps) => {
  const handleToggle = (id: string) => {
    if (selectedTypes.includes(id)) {
      onChange(selectedTypes.filter((typeId) => typeId !== id));
    } else {
      onChange([...selectedTypes, id]);
    }
  };

  const handleRemove = (id: string) => {
    onChange(selectedTypes.filter((typeId) => typeId !== id));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Type of Encroachment</Label>
        <ScrollArea className="h-[300px] rounded-md border p-2">
          <div className="space-y-2">
            {types.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.id}`}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={() => handleToggle(type.id)}
                />
                <Label
                  htmlFor={`type-${type.id}`}
                  className="cursor-pointer font-normal"
                >
                  {type.name}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {selectedTypes.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Types</Label>
          <div className="flex flex-wrap gap-2">
            {selectedTypes.map((typeId) => {
              const type = types.find((t) => t.id === typeId);
              return (
                type && (
                  <Badge key={type.id} variant="secondary" className="flex items-center gap-1">
                    {type.name}
                    <button
                      type="button"
                      onClick={() => handleRemove(type.id)}
                      className="rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {type.name}</span>
                    </button>
                  </Badge>
                )
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EncroachmentTypeSelector;
