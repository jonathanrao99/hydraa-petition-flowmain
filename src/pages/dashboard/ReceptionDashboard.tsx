
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import StatusBadge from "@/components/common/StatusBadge";

// Mock data - would be fetched from API in a real app
const recentPetitions = [
  {
    id: "1",
    petitionNumber: "PTN000012024",
    petitionerName: "Rajesh Kumar",
    date: "15-04-2024",
    status: "Pending",
  },
  {
    id: "2",
    petitionNumber: "PTN000022024",
    petitionerName: "Priya Sharma",
    date: "14-04-2024",
    status: "Assigned",
  },
  {
    id: "3",
    petitionNumber: "PTN000032024",
    petitionerName: "Suresh Reddy",
    date: "13-04-2024",
    status: "Under Investigation",
  },
  {
    id: "4",
    petitionNumber: "PTN000042024",
    petitionerName: "Lakshmi Devi",
    date: "12-04-2024",
    status: "Decision Made",
  },
];

const ReceptionDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reception Dashboard"
        description="Manage and track petitions submitted to HYDRAA"
        action={
          <Link to="/reception/new-petition">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Petition
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Petitions"
          value="124"
          icon={<FileText className="h-4 w-4" />}
          trend="up"
          trendValue="16% from last month"
          variant="info"
        />
        <StatCard
          title="Pending"
          value="23"
          icon={<Clock className="h-4 w-4" />}
          trend="down"
          trendValue="5% from last month"
          variant="pending"
        />
        <StatCard
          title="In Progress"
          value="45"
          icon={<AlertTriangle className="h-4 w-4" />}
          trend="up"
          trendValue="12% from last month"
          variant="warning"
        />
        <StatCard
          title="Resolved"
          value="56"
          icon={<CheckCircle className="h-4 w-4" />}
          trend="up"
          trendValue="18% from last month"
          variant="success"
        />
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Petitions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {recentPetitions.slice(0, 4).map((petition) => (
                    <Card key={petition.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{petition.petitionNumber}</span>
                            <StatusBadge status={petition.status as any} />
                          </div>
                          <div className="text-sm">{petition.petitionerName}</div>
                          <div className="text-xs text-muted-foreground">{petition.date}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Petitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-1 md:grid-cols-5 p-3 font-medium">
                  <div>Petition Number</div>
                  <div>Petitioner</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {recentPetitions.map((petition) => (
                    <div key={petition.id} className="grid grid-cols-1 md:grid-cols-5 p-3 items-center">
                      <div className="font-medium">{petition.petitionNumber}</div>
                      <div>{petition.petitionerName}</div>
                      <div>{petition.date}</div>
                      <div>
                        <StatusBadge status={petition.status as any} />
                      </div>
                      <div className="flex justify-end">
                        <Link to={`/reception/petitions/${petition.id}`}>
                          <Button variant="ghost" size="sm">
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

export default ReceptionDashboard;
