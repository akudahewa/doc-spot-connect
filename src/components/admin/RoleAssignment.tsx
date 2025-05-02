
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AuthService } from '@/api/services/AuthService';
import { DispensaryService } from '@/api/services';
import { User, UserRole } from '@/api/models';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RoleAssignmentProps {
  currentUserRole: UserRole;
  dispensaryId?: string; // Only needed for dispensary admins
}

const RoleAssignment = ({ currentUserRole, dispensaryId }: RoleAssignmentProps) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<Omit<User, 'passwordHash'>[]>([]);
  const [dispensaries, setDispensaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.DISPENSARY_STAFF,
    dispensaryIds: [] as string[],
    isActive: true
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dispensariesData = await DispensaryService.getAllDispensaries();
        setDispensaries(dispensariesData);
        
        // Get users based on current user role
        let usersData;
        if (currentUserRole === UserRole.SUPER_ADMIN) {
          usersData = await AuthService.getAllUsers();
        } else if (currentUserRole === UserRole.DISPENSARY_ADMIN && dispensaryId) {
          usersData = await AuthService.getUsersByDispensary(dispensaryId);
        } else {
          usersData = [];
        }
        
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast, currentUserRole, dispensaryId]);
  
  const handleCreateUser = async () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    // For dispensary admin, enforce their dispensary ID for staff they create
    let dispensaryIds = formData.dispensaryIds;
    if (currentUserRole === UserRole.DISPENSARY_ADMIN && dispensaryId) {
      dispensaryIds = formData.role === UserRole.DISPENSARY_STAFF ? [dispensaryId] : [];
    }
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        dispensaryIds: dispensaryIds.length > 0 ? dispensaryIds : undefined,
        isActive: formData.isActive,
      };
      
      const newUser = await AuthService.createUser(userData, formData.password);
      
      if (!newUser) {
        throw new Error("Failed to create user");
      }
      
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      toast({
        title: "Success",
        description: "User created successfully.",
      });
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user. Email may already be in use.",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: currentUserRole === UserRole.SUPER_ADMIN ? UserRole.DISPENSARY_ADMIN : UserRole.DISPENSARY_STAFF,
      dispensaryIds: [],
      isActive: true
    });
  };
  
  const getRoleName = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      case UserRole.DISPENSARY_ADMIN:
        return 'Dispensary Admin';
      case UserRole.DISPENSARY_STAFF:
        return 'Dispensary Staff';
      default:
        return role;
    }
  };
  
  const getDispensaryNames = (dispensaryIds?: string[]) => {
    if (!dispensaryIds || !dispensaryIds.length) return 'N/A';
    
    return dispensaryIds
      .map(id => {
        const dispensary = dispensaries.find(d => d.id === id);
        return dispensary ? dispensary.name : id;
      })
      .join(', ');
  };
  
  // Determine available roles based on current user's role
  const getAvailableRoles = () => {
    if (currentUserRole === UserRole.SUPER_ADMIN) {
      return [UserRole.DISPENSARY_ADMIN, UserRole.DISPENSARY_STAFF];
    } else if (currentUserRole === UserRole.DISPENSARY_ADMIN) {
      return [UserRole.DISPENSARY_STAFF];
    }
    return [];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new system user.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmPassword" className="text-right">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              {getAvailableRoles().length > 1 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData({...formData, role: value as UserRole})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableRoles().map((role) => (
                        <SelectItem key={role} value={role}>{getRoleName(role)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {currentUserRole === UserRole.SUPER_ADMIN && formData.role === UserRole.DISPENSARY_ADMIN && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dispensaries" className="text-right">Dispensaries</Label>
                  <div className="col-span-3">
                    {dispensaries.map(dispensary => (
                      <div key={dispensary.id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="checkbox"
                          id={`dispensary-${dispensary.id}`}
                          checked={formData.dispensaryIds.includes(dispensary.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                dispensaryIds: [...formData.dispensaryIds, dispensary.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                dispensaryIds: formData.dispensaryIds.filter(id => id !== dispensary.id)
                              });
                            }
                          }}
                          className="h-4 w-4"
                        />
                        <label htmlFor={`dispensary-${dispensary.id}`}>{dispensary.name}</label>
                      </div>
                    ))}
                    
                    {dispensaries.length === 0 && <p className="text-sm text-gray-500">No dispensaries available</p>}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="status"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4"
                  />
                  <label htmlFor="status">Active</label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Dispensaries</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleName(user.role)}</TableCell>
                  <TableCell>{getDispensaryNames(user.dispensaryIds)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString() 
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RoleAssignment;
