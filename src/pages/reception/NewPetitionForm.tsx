
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, FileText, Upload } from "lucide-react";
import { cn, generatePetitionNumber } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import CascadingLocationDropdown from "@/components/petition/CascadingLocationDropdown";
import EncroachmentTypeSelector from "@/components/petition/EncroachmentTypeSelector";
import { LOCATION_DATA, ENCROACHMENT_TYPES, PETITION_TYPES, PETITION_SUBMISSION_TYPES, TIME_BOUND_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";

// Form schema validation
const formSchema = z.object({
  petitionerName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  petitionerPhone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  petitionerAddress: z.string().min(5, { message: "Address must be at least 5 characters" }),
  date: z.date(),
  petitionType: z.string(),
  submittedBy: z.string(),
  complaintDetails: z.string().min(10, { message: "Complaint details must be at least 10 characters" }),
  respondentInfo: z.string().optional(),
  initialRemark: z.string().optional(),
  timeBound: z.string(),
  // These will be handled separately
  // encroachmentZone: z.object({
  //   level1: z.string(),
  //   level2: z.string(),
  //   level3: z.string(),
  // }),
  // encroachmentTypes: z.array(z.string()),
  // petitionFile: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewPetitionForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [location, setLocation] = useState({ level1: "", level2: "", level3: "" });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petitionerName: "",
      petitionerPhone: "",
      petitionerAddress: "",
      date: new Date(),
      petitionType: "",
      submittedBy: "",
      complaintDetails: "",
      respondentInfo: "",
      initialRemark: "",
      timeBound: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Combine form values with location and selected types
    const petitionData = {
      ...values,
      encroachmentZone: location,
      encroachmentTypes: selectedTypes,
      petitionNumber: generatePetitionNumber(),
      status: "Pending",
      createdBy: currentUser?.id || "",
      assignedOfficers: [],
    };
    
    console.log("Petition Data:", petitionData);
    
    // In a real app, this would send the data to an API
    toast({
      title: "Petition submitted successfully",
      description: `Petition number: ${petitionData.petitionNumber}`,
    });
    
    // Navigate back to reception dashboard
    navigate("/reception");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Petition"
        description="Create a new petition in the HYDRAA system"
      />

      <Card>
        <CardHeader>
          <CardTitle>Petition Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Petitioner Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Petitioner Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="petitionerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Petitioner Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="petitionerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="petitionerAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Petition Meta Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Petition Details</h3>
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="petitionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Petition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select petition type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PETITION_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="submittedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Petition Submitted By</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select submission type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PETITION_SUBMISSION_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeBound"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Bound for Enquiry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
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
                          Priority petitions are processed first
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Encroachment Details</h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <CascadingLocationDropdown
                      locationData={LOCATION_DATA}
                      onChange={setLocation}
                      value={location}
                    />
                  </div>
                  
                  <div>
                    <EncroachmentTypeSelector
                      types={ENCROACHMENT_TYPES}
                      selectedTypes={selectedTypes}
                      onChange={setSelectedTypes}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Complaint Details</h3>
                
                <FormField
                  control={form.control}
                  name="complaintDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complaint Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter detailed description of the complaint" 
                          {...field} 
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="respondentInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Respondent Information</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter details about the respondent/accused" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Upload & Remarks</h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <FormLabel>Upload Petition</FormLabel>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="petition-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, JPG or PNG (MAX. 10MB)
                          </p>
                        </div>
                        <input id="petition-upload" type="file" className="hidden" />
                      </label>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="initialRemark"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Remark</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter initial remarks for this petition" 
                            {...field} 
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate("/reception")}>
                  Cancel
                </Button>
                <Button type="submit">
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Petition
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPetitionForm;
