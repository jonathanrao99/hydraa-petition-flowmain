import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import StatusBadge from "@/components/common/StatusBadge";

// Mock data - would be fetched from API in a real app
const assignedPetitions = [
  {
    id: "1",
    petitionNumber: "PTN00001/2025",
    petitionerName: "Rajesh Kumar",
    date: "15-04-2024",
    status: "Assigned",
    timeBound: "Priority",
  },
  {
    id: "2",
    petitionNumber: "PTN00002/2025",
    petitionerName: "Priya Sharma",
    date: "14-04-2024",
    status: "Under Investigation",
    timeBound: "Normal",
  },
  {
    id: "3",
    petitionNumber: "PTN00003/2025",
    petitionerName: "Suresh Reddy",
    date: "13-04-2024",
    status: "Under Investigation",
    timeBound: "Immediate",
  },
];

const OfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiry Officer Dashboard"
        description="View and respond to assigned petitions"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Assigned to You"
          value="15"
          icon={<FileText className="h-4 w-4" />}
          trend="up"
          trendValue="3 new this week"
          variant="info"
        />
        <StatCard
          title="Pending Investigation"
          value="8"
          icon={<Clock className="h-4 w-4" />}
          trend="neutral"
          trendValue="2 require immediate attention"
          variant="pending"
        />
        <StatCard
          title="Completed"
          value="7"
          icon={<CheckCircle className="h-4 w-4" />}
          trend="up"
          trendValue="5 this month"
          variant="success"
        />
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assigned">Assigned Petitions</TabsTrigger>
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
                    <div>Time Bound</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {assignedPetitions
                      .filter((p) => p.timeBound === "Priority" || p.timeBound === "Immediate")
                      .map((petition) => (
                        <div key={petition.id} className="grid grid-cols-1 md:grid-cols-5 p-3 items-center">
                          <div className="font-medium">{petition.petitionNumber}</div>
                          <div>{petition.petitionerName}</div>
                          <div>{petition.date}</div>
                          <div>
                            <span 
                              className={`px-2 py-1 rounded-full text-xs ${
                                petition.timeBound === "Priority" 
                                  ? "bg-red-100 text-red-800" 
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {petition.timeBound}
                            </span>
                          </div>
                          <div className="flex justify-end">
                            <Link to={`/officer/assigned/${petition.id}`}>
                              <Button variant="outline" size="sm">
                                View
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
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {assignedPetitions.map((petition) => (
                    <Card key={petition.id} className={
                      petition.timeBound === "Priority" 
                        ? "border-red-200 bg-red-50" 
                        : petition.timeBound === "Immediate"
                          ? "border-orange-200 bg-orange-50"
                          : ""
                    }>
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
                          <div className="pt-2">
                            <Link to={`/officer/assigned/${petition.id}`}>
                              <Button variant="outline" size="sm" className="w-full">
                                Review Petition
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assigned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Assigned Petitions</CardTitle>
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
                  {assignedPetitions.map((petition) => (
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
                        <Link to={`/officer/assigned/${petition.id}`}>
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

export default OfficerDashboard;
