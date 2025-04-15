
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, Search, Edit, Trash, Info } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DESIGNATIONS, ROLES } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateUserId } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock users data - would be fetched from an API in a real app
const mockUsers = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "John Doe",
    designation: "DCP",
    role: "Reception",
    email: "reception@hydraa.gov.in",
    phone: "9876543210",
    userId: "John/DCP",
  },
  {
    id: "2",
    employeeId: "EMP002",
    name: "Jane Smith",
    designation: "ACP",
    role: "EnquiryOfficer",
    email: "officer@hydraa.gov.in",
    phone: "9876543211",
    userId: "Jane/ACP",
  },
  {
    id: "3",
    employeeId: "EMP003",
    name: "Michael Brown",
    designation: "DCP",
    role: "HOD",
    email: "commissioner@hydraa.gov.in",
    phone: "9876543212",
    userId: "Michael/DCP",
  },
  {
    id: "4",
    employeeId: "EMP004",
    name: "Admin User",
    designation: "Other",
    role: "Admin",
    email: "admin@hydraa.gov.in",
    phone: "9876543213",
    userId: "Admin/Other",
  },
  {
    id: "5",
    employeeId: "EMP005",
    name: "Raj Kumar",
    designation: "Inspector",
    role: "EnquiryOfficer",
    email: "raj@hydraa.gov.in",
    phone: "9876543214",
    userId: "Raj/Inspector",
  },
  {
    id: "6",
    employeeId: "EMP006",
    name: "Priya Sharma",
    designation: "ACP",
    role: "EnquiryOfficer",
    email: "priya@hydraa.gov.in",
    phone: "9876543215",
    userId: "Priya/ACP",
  },
];

// Form schema for user creation/editing
const userFormSchema = z.object({
  employeeId: z
    .string()
    .min(3, { message: "Employee ID must be at least 3 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  designation: z.string().min(1, { message: "Please select a designation" }),
  role: z.string().min(1, { message: "Please select a role" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof mockUsers[0] | null>(null);

  // Setup form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      employeeId: "",
      name: "",
      designation: "",
      role: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission (create/edit user)
  const onSubmit = (data: UserFormValues) => {
    // Generate user ID based on name and designation
    const userId = generateUserId(data.name, data.designation);

    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              employeeId: data.employeeId,
              name: data.name,
              designation: data.designation,
              role: data.role,
              email: data.email,
              phone: data.phone,
              userId,
            }
          : user
      );
      setUsers(updatedUsers);
      toast({
        title: "User updated",
        description: `${data.name} has been updated successfully`,
      });
    } else {
      // Create new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        employeeId: data.employeeId,
        name: data.name,
        designation: data.designation,
        role: data.role,
        email: data.email,
        phone: data.phone,
        userId,
      };
      setUsers([...users, newUser]);
      toast({
        title: "User created",
        description: `${data.name} has been added to the system`,
      });
    }

    // Reset form and close dialog
    form.reset();
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  // Handle edit user
  const handleEditUser = (user: typeof mockUsers[0]) => {
    setEditingUser(user);
    form.reset({
      employeeId: user.employeeId,
      name: user.name,
      designation: user.designation,
      role: user.role,
      email: user.email,
      phone: user.phone,
      password: "password", // Placeholder password
    });
    setIsDialogOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (userId: string) => {
    // Filter out the user with the given ID
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    toast({
      title: "User deleted",
      description: "The user has been removed from the system",
    });
  };

  // Handle dialog close
  const handleDialogClose = () => {
    form.reset();
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  // Open dialog for creating a new user
  const openNewUserDialog = () => {
    setEditingUser(null);
    form.reset({
      employeeId: "",
      name: "",
      designation: "",
      role: "",
      email: "",
      phone: "",
      password: "",
    });
    setIsDialogOpen(true);
  };

  // Role descriptions for tooltips
  const roleDescriptions = {
    Reception: "Can create petitions and view all petition statuses",
    EnquiryOfficer: "Can investigate assigned petitions and submit reports",
    HOD: "Can assign officers, review reports, and make final decisions",
    Admin: "Has full access to all system features and user management",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage user accounts and access permissions"
        action={
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={openNewUserDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new user account in the system</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            System Users
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full md:w-[300px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 p-3 font-medium border-b">
              <div className="col-span-2">User ID</div>
              <div className="col-span-2">Name</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Designation</div>
              <div className="col-span-2">Email</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user.id} className="grid grid-cols-12 p-3 items-center">
                    <div className="col-span-2 font-medium">{user.userId}</div>
                    <div className="col-span-2">{user.name}</div>
                    <div className="col-span-2 flex items-center">
                      {user.role}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{roleDescriptions[user.role as keyof typeof roleDescriptions]}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="col-span-2">{user.designation}</div>
                    <div className="col-span-2 truncate">{user.email}</div>
                    <div className="col-span-2 flex justify-end space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit user details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete user account</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No users found matching your search.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Create New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update the user details below"
                : "Fill in the details to create a new user account"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., EMP001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DESIGNATIONS.map((designation) => (
                            <SelectItem
                              key={designation.value}
                              value={designation.value}
                            >
                              {designation.label}
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {field.value && roleDescriptions[field.value as keyof typeof roleDescriptions]}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g., user@hydraa.gov.in"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {editingUser ? "Reset Password" : "Password"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {editingUser
                        ? "Leave unchanged to keep current password"
                        : "Must be at least 6 characters"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingUser ? "Update User" : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
