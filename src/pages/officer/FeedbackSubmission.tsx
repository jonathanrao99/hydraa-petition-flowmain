import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileUp, Save, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";

// Mock petition data - in a real app, this would be fetched from an API
const petitionData = {
  id: "1",
  petitionNumber: "PTN00004/2025",
  date: "12-04-2024",
  petitionType: "General",
  petitionerName: "Lakshmi Devi",
  petitionerPhone: "9876543210",
  petitionerAddress: "1-2-3, Miyapur, Hyderabad",
  submittedBy: "Individual",
  complaintDetails: "Illegal construction on government land adjacent to my property, creating drainage issues and affecting structural integrity of neighboring buildings.",
  respondentInfo: "Builder: Manohar Constructions, Site Supervisor: Ganesh",
  encroachmentZone: {
    level1: "Hyderabad",
    level2: "West",
    level3: "Gachibowli",
  },
  encroachmentTypes: ["5"], // Government Land
  initialRemark: "Petitioner has submitted photographs and land records showing clear violation.",
  timeBound: "Priority",
  status: "Assigned",
  assignedOfficers: ["Jane Smith"],
  commissionerInstructions: "Verify the land records and assess the extent of encroachment. Take photographs as evidence."
};

const FeedbackSubmission = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [observations, setObservations] = useState("");
  const [litigationPending, setLitigationPending] = useState("");
  const [findings, setFindings] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);

  const handleAddEvidence = () => {
    // In a real app, this would upload files and add them to the evidence array
    setEvidence([...evidence, `Evidence_${evidence.length + 1}.jpg`]);
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidence(evidence.filter((_, i) => i !== index));
  };

  const handleSubmitFeedback = () => {
    if (!observations || !findings) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send an API request to submit the feedback
    
    toast({
      title: "Feedback submitted successfully",
      description: `Feedback for petition ${petitionData.petitionNumber} has been recorded`,
    });
    
    // Navigate back to officer dashboard
    navigate("/officer");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submit Feedback"
        description="Provide your findings and observations for this petition"
        action={
          <Button variant="outline" onClick={() => navigate("/officer")}>
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
              <Label>Commissioner's Instructions</Label>
              <div className="rounded-md border p-3 mt-1 bg-muted">
                {petitionData.commissionerInstructions}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="observations">Observations</Label>
              <Textarea
                id="observations"
                placeholder="Enter your observations from the site inspection"
                rows={4}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Litigation Pending</Label>
              <RadioGroup defaultValue="no" onValueChange={setLitigationPending}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="litigation-yes" />
                  <Label htmlFor="litigation-yes" className="font-normal">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="litigation-no" />
                  <Label htmlFor="litigation-no" className="font-normal">No</Label>
                </div>
              </RadioGroup>
              {litigationPending === "yes" && (
                <Textarea
                  placeholder="Provide details about the pending litigation"
                  className="mt-2"
                  rows={2}
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Evidence</Label>
              <div className="space-y-2">
                {evidence.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      <FileUp className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{file}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEvidence(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="evidence-upload"
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                      <p className="mb-1 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> evidence
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Photos, documents, videos (MAX. 10MB)
                      </p>
                    </div>
                    <input 
                      id="evidence-upload" 
                      type="file" 
                      className="hidden" 
                      onChange={handleAddEvidence} 
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="findings">Findings & Recommendations</Label>
              <Textarea
                id="findings"
                placeholder="Enter your findings and recommendations"
                rows={5}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Upload Final Report</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="report-upload"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> final report
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF format preferred (MAX. 10MB)
                    </p>
                  </div>
                  <input id="report-upload" type="file" className="hidden" />
                </label>
              </div>
            </div>
            
            <div className="flex gap-4 pt-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/officer")}
              >
                Save as Draft
              </Button>
              <Button 
                className="w-full" 
                onClick={handleSubmitFeedback}
              >
                <Save className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackSubmission;
