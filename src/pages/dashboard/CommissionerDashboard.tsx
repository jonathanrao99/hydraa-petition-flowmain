
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckCircle, UserCheck } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import StatusBadge from "@/components/common/StatusBadge";

// Mock data - would be fetched from API in a real app
const pendingPetitions = [
  {
    id: "1",
    petitionNumber: "PTN000012024",
    petitionerName: "Rajesh Kumar",
    date: "15-04-2024",
    status: "Pending",
    timeBound: "Priority",
  },
  {
    id: "2",
    petitionNumber: "PTN000022024",
    petitionerName: "Priya Sharma",
    date: "14-04-2024",
    status: "Pending",
    timeBound: "Normal",
  },
  {
    id: "3",
    petitionNumber: "PTN000032024",
    petitionerName: "Suresh Reddy",
    date: "13-04-2024",
    status: "Pending",
    timeBound: "Immediate",
  },
];

const assignedPetitions = [
  {
    id: "4",
    petitionNumber: "PTN000042024",
    petitionerName: "Lakshmi Devi",
    date: "12-04-2024",
    status: "Assigned",
    assignedTo: ["Jane Smith", "Rao Kumar"],
    timeBound: "Priority",
  },
  {
    id: "5",
    petitionNumber: "PTN000052024",
    petitionerName: "Ravi Reddy",
    date: "11-04-2024",
    status: "Under Investigation",
    assignedTo: ["Jane Smith", "Rao Kumar", "Anjali Sharma"],
    timeBound: "Normal",
  },
];

const decidedPetitions = [
  {
    id: "6",
    petitionNumber: "PTN000062024",
    petitionerName: "Sanjay Kumar",
    date: "10-04-2024",
    status: "Decision Made",
    decision: "Approved",
  },
  {
    id: "7",
    petitionNumber: "PTN000072024",
    petitionerName: "Meena Devi",
    date: "09-04-2024",
    status: "Decision Made",
    decision: "Rejected",
  },
];

const CommissionerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commissioner Dashboard"
        description="Manage petitions and assign enquiry officers"
        showLogo={true}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Assignments"
          value={pendingPetitions.length}
          icon={<Clock className="h-4 w-4" />}
          trend="up"
          trendValue="2 new today"
          variant="pending"
        />
        <StatCard
          title="Under Investigation"
          value={assignedPetitions.length}
          icon={<UserCheck className="h-4 w-4" />}
          trend="neutral"
          trendValue="3 awaiting reports"
          variant="info"
        />
        <StatCard
          title="Decisions Made"
          value={decidedPetitions.length}
          icon={<CheckCircle className="h-4 w-4" />}
          trend="up"
          trendValue="5 this month"
          variant="complete"
        />
        <StatCard
          title="Total Officers"
          value="12"
          icon={<FileText className="h-4 w-4" />}
          trend="neutral"
          trendValue="Current workforce"
        />
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending Assignment</TabsTrigger>
          <TabsTrigger value="assigned">Under Investigation</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Priority Petitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-5 p-3 font-medium">
                    <div>Petition</div>
                    <div>Petitioner</div>
                    <div>Date</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {pendingPetitions
                      .filter((p) => p.timeBound === "Priority")
                      .map((petition) => (
                        <div key={petition.id} className="grid grid-cols-1 md:grid-cols-5 p-3 items-center">
                          <div className="font-medium">{petition.petitionNumber}</div>
                          <div>{petition.petitionerName}</div>
                          <div>{petition.date}</div>
                          <div>
                            <StatusBadge status={petition.status as any} />
                          </div>
                          <div className="flex justify-end">
                            <Link to={`/commissioner/pending/${petition.id}`}>
                              <Button variant="outline" size="sm">
                                Assign
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...pendingPetitions, ...assignedPetitions]
                  .slice(0, 3)
                  .map((petition) => (
                    <Card key={petition.id} className={petition.status === "Pending" ? "border-yellow-200" : "border-blue-200"}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{petition.petitionNumber}</span>
                            <StatusBadge status={petition.status as any} />
                          </div>
                          <div className="text-sm">{petition.petitionerName}</div>
                          <div className="text-xs text-muted-foreground">
                            {petition.date} • {petition.timeBound}
                          </div>
                          {petition.status === "Pending" ? (
                            <div className="pt-2">
                              <Link to={`/commissioner/pending/${petition.id}`}>
                                <Button variant="outline" size="sm" className="w-full">
                                  Assign Officers
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <div className="pt-2">
                              <Link to={`/commissioner/assigned/${petition.id}`}>
                                <Button variant="outline" size="sm" className="w-full">
                                  Review Status
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Petitions Awaiting Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-1 md:grid-cols-6 p-3 font-medium">
                  <div>Petition Number</div>
                  <div>Petitioner</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div>Time Bound</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {pendingPetitions.map((petition) => (
                    <div key={petition.id} className="grid grid-cols-1 md:grid-cols-6 p-3 items-center">
                      <div className="font-medium">{petition.petitionNumber}</div>
                      <div>{petition.petitionerName}</div>
                      <div>{petition.date}</div>
                      <div>
                        <StatusBadge status={petition.status as any} />
                      </div>
                      <div>
                        <span 
                          className={`px-2 py-1 rounded-full text-xs ${
                            petition.timeBound === "Priority" 
                              ? "bg-red-100 text-red-800" 
                              : petition.timeBound === "Immediate"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {petition.timeBound}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <Link to={`/commissioner/pending/${petition.id}`}>
                          <Button size="sm">
                            Assign
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assigned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Petitions Under Investigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-1 md:grid-cols-6 p-3 font-medium">
                  <div>Petition Number</div>
                  <div>Petitioner</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div>Assigned To</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {assignedPetitions.map((petition) => (
                    <div key={petition.id} className="grid grid-cols-1 md:grid-cols-6 p-3 items-center">
                      <div className="font-medium">{petition.petitionNumber}</div>
                      <div>{petition.petitionerName}</div>
                      <div>{petition.date}</div>
                      <div>
                        <StatusBadge status={petition.status as any} />
                      </div>
                      <div>
                        <div className="flex flex-wrap gap-1">
                          {petition.assignedTo.map((officer, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full text-xs">
                              {officer}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Link to={`/commissioner/assigned/${petition.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommissionerDashboard;
