import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCheck, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Mock data for officers
const officers = [
  { id: "officer1", name: "Jane Smith", designation: "ACP", userId: "Jane/ACP" },
  { id: "officer2", name: "Rao Kumar", designation: "Inspector", userId: "Rao/Inspector" },
  { id: "officer3", name: "Anjali Sharma", designation: "Inspector", userId: "Anjali/Inspector" },
  { id: "officer4", name: "Suresh Reddy", designation: "DCP", userId: "Suresh/DCP" },
  { id: "officer5", name: "Prakash Rao", designation: "ACP", userId: "Prakash/ACP" },
];

// Mock petition data - in a real app, this would be fetched from an API
const petitionData = {
  id: "1",
  petitionNumber: "PTN000012024",
  date: "15-04-2024",
  petitionType: "General",
  petitionerName: "Rajesh Kumar",
  petitionerPhone: "9876543210",
  petitionerAddress: "4-5-6, Banjara Hills, Hyderabad",
  submittedBy: "Individual",
  complaintDetails: "Encroachment of public road by neighboring property owner, causing traffic issues and blocking access to my property.",
  respondentInfo: "Neighboring property owner Mr. Venkat, Address: 4-5-7, Banjara Hills, Hyderabad",
  encroachmentZone: {
    level1: "Hyderabad",
    level2: "West",
    level3: "Gachibowli",
  },
  encroachmentTypes: ["1", "3"], // Road, Footpath
  initialRemark: "Petitioner has provided photographic evidence of encroachment.",
  timeBound: "Priority",
  status: "Pending",
  assignedOfficers: [],
};

const formSchema = z.object({
  officerId: z.string().min(1, { message: "Please select an officer" }),
  timeBound: z.string().min(1, { message: "Please select a time bound" }),
});

type FormValues = z.infer<typeof formSchema>;

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    officerId: "",
    timeBound: "",
  },
});

const PetitionAssignment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedOfficers, setSelectedOfficers] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");

  const handleOfficerToggle = (officerId: string) => {
    if (selectedOfficers.includes(officerId)) {
      setSelectedOfficers(selectedOfficers.filter(id => id !== officerId));
    } else {
      // Ensure no more than 3 officers are selected
      if (selectedOfficers.length < 3) {
        setSelectedOfficers([...selectedOfficers, officerId]);
      } else {
        toast({
          title: "Maximum selection reached",
          description: "You can select up to 3 enquiry officers",
          variant: "destructive",
        });
      }
    }
  };

  const handleAssignPetition = () => {
    if (selectedOfficers.length === 0) {
      toast({
        title: "No officers selected",
        description: "Please select at least one enquiry officer",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send an API request to update the petition
    // and notify the assigned officers
    
    toast({
      title: "Petition assigned successfully",
      description: `Assigned to ${selectedOfficers.length} officer(s)`,
    });
    
    // Navigate back to commissioner dashboard
    navigate("/commissioner");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assign Petition"
        description="Assign enquiry officers to investigate this petition"
        action={
          <Button variant="outline" onClick={() => navigate("/commissioner")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Petition Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{petitionData.petitionNumber}</h3>
              <StatusBadge status={petitionData.status as any} />
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Date:</div>
                <div>{petitionData.date}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Petitioner:</div>
                <div>{petitionData.petitionerName}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Contact:</div>
                <div>{petitionData.petitionerPhone}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Type:</div>
                <div>{petitionData.petitionType}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Time Bound:</div>
                <div>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      petitionData.timeBound === "Priority" 
                        ? "bg-red-100 text-red-800" 
                        : petitionData.timeBound === "Immediate"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {petitionData.timeBound}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Location:</div>
                <div>
                  {petitionData.encroachmentZone.level1}
                  {petitionData.encroachmentZone.level2 && ` → ${petitionData.encroachmentZone.level2}`}
                  {petitionData.encroachmentZone.level3 && ` → ${petitionData.encroachmentZone.level3}`}
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Label>Complaint Details</Label>
              <div className="rounded-md border p-3 mt-1">
                {petitionData.complaintDetails}
              </div>
            </div>
            
            <div>
              <Label>Initial Remark</Label>
              <div className="rounded-md border p-3 mt-1">
                {petitionData.initialRemark}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assign Enquiry Officers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select officers (up to 3)</Label>
              <div className="border rounded-md divide-y">
                {officers.map((officer) => (
                  <div key={officer.id} className="flex items-center space-x-2 p-3">
                    <Checkbox
                      id={`officer-${officer.id}`}
                      checked={selectedOfficers.includes(officer.id)}
                      onCheckedChange={() => handleOfficerToggle(officer.id)}
                      disabled={selectedOfficers.length >= 3 && !selectedOfficers.includes(officer.id)}
                    />
                    <Label
                      htmlFor={`officer-${officer.id}`}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      <div className="flex justify-between">
                        <span>{officer.name}</span>
                        <span className="text-sm text-muted-foreground">{officer.designation}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{officer.userId}</div>
                    </Label>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                Selected: {selectedOfficers.length}/3
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions to Officers</Label>
              <Textarea
                id="instructions"
                placeholder="Enter instructions for the assigned officers"
                rows={5}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
            
            <FormField
              control={form.control}
              name="timeBound"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Bound for Enquiry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time bound" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIME_BOUND_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the time bound for this petition's enquiry
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              className="w-full" 
              onClick={handleAssignPetition}
              disabled={selectedOfficers.length === 0}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Assign Officers
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetitionAssignment;
