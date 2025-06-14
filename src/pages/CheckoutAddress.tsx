import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { MapPin, Plus, Trash2, Home, Briefcase, GraduationCap, Building, Users } from 'lucide-react';

const addressSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  mobileNumber: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  pincode: z.string().regex(/^\d{6}$/, { message: "Please enter a valid 6-digit pincode." }),
  addressLine1: z.string().min(5, { message: "Please enter your house number, building, or street." }),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, { message: "Please enter a valid city name." }),
  state: z.string().min(2, { message: "Please enter a valid state name." }),
  type: z.enum(['home', 'work', 'hostel', 'college', 'friend'], { message: "Please select an address type." }),
});

export type AddressFormData = z.infer<typeof addressSchema>;

const addressTypeIcons = {
  home: Home,
  work: Briefcase,
  hostel: Building,
  college: GraduationCap,
  friend: Users,
};

const addressTypeLabels = {
  home: 'Home',
  work: 'Work',
  hostel: 'Hostel',
  college: 'College',
  friend: "Friend's Home",
};

const CheckoutAddress: React.FC = () => {
  const navigate = useNavigate();
  const { user, addSavedAddress, deleteSavedAddress, setDefaultAddress } = useAuth();
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  
  const savedAddresses = user?.savedAddresses || [];
  const defaultAddress = savedAddresses.find(addr => addr.isDefault);

  // Set default selection
  React.useEffect(() => {
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [defaultAddress, selectedAddressId]);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      pincode: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: '',
      type: 'home',
    },
  });

  const onSubmit = (data: AddressFormData) => {
    console.log('Address submitted:', data);
    
    // Save the new address
    addSavedAddress(data);
    
    toast({
      title: "Address Saved",
      description: "New address saved successfully. Proceeding to payment.",
    });
    
    // Navigate to payment with the new address
    navigate('/payment', { state: { shippingAddress: data } });
  };

  const handleExistingAddressSubmit = () => {
    if (!selectedAddressId) {
      toast({
        title: "Please select an address",
        description: "Choose a saved address or add a new one.",
        variant: "destructive"
      });
      return;
    }

    const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);
    if (selectedAddress) {
      toast({
        title: "Address Selected",
        description: "Proceeding to payment with selected address.",
      });
      navigate('/payment', { state: { shippingAddress: selectedAddress } });
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    deleteSavedAddress(addressId);
    if (selectedAddressId === addressId) {
      setSelectedAddressId('');
    }
    toast({
      title: "Address Deleted",
      description: "Address removed from your saved addresses.",
    });
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setDefaultAddress(addressId);
    toast({
      title: "Default Address Updated",
      description: "This address is now your default shipping address.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={() => {}} />
      <main className="flex-grow pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">Shipping Address</h1>
            
            {/* Saved Addresses Section */}
            {savedAddresses.length > 0 && !showNewAddressForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Saved Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                    {savedAddresses.map((address) => {
                      const TypeIcon = addressTypeIcons[address.type];
                      return (
                        <div key={address.id} className="flex items-start space-x-3 border rounded-lg p-4">
                          <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={address.id} className="font-medium cursor-pointer">
                                {address.fullName}
                              </Label>
                              <div className="flex items-center gap-1">
                                <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                <Badge variant="secondary" className="text-xs">
                                  {addressTypeLabels[address.type]}
                                </Badge>
                              </div>
                              {address.isDefault && (
                                <Badge variant="secondary" className="text-xs">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p className="text-sm text-muted-foreground">Mobile: {address.mobileNumber}</p>
                            <div className="flex gap-2 mt-2">
                              {!address.isDefault && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSetDefaultAddress(address.id)}
                                >
                                  Set as Default
                                </Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Address</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this address? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteAddress(address.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleExistingAddressSubmit}
                      className="flex-1 bg-medieaze-600 hover:bg-medieaze-700"
                      disabled={!selectedAddressId}
                    >
                      Continue with Selected Address
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewAddressForm(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add New
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* New Address Form */}
            {(showNewAddressForm || savedAddresses.length === 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Add New Address
                    {savedAddresses.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNewAddressForm(false)}
                      >
                        Cancel
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select address type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(addressTypeLabels).map(([value, label]) => {
                                  const Icon = addressTypeIcons[value as keyof typeof addressTypeIcons];
                                  return (
                                    <SelectItem key={value} value={value}>
                                      <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        {label}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <FormField
                          control={form.control}
                          name="mobileNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mobile Number</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="10-digit mobile number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pincode</FormLabel>
                              <FormControl>
                                <Input placeholder="6-digit pincode" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address (House No, Building, Street, Area)</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g. 123, Main Street, Jayanagar" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area, Colony, Road (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g. Near City Park" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="landmark"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Landmark (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g. Opposite Post Office" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Town/City</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your state" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-medieaze-600 hover:bg-medieaze-700 text-white py-3 text-base" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving Address...' : 'Save Address & Continue'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutAddress;
