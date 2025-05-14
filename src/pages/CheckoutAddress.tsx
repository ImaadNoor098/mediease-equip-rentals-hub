
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

const addressSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  mobileNumber: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  pincode: z.string().regex(/^\d{6}$/, { message: "Please enter a valid 6-digit pincode." }),
  addressLine1: z.string().min(5, { message: "Please enter your house number, building, or street." }),
  addressLine2: z.string().min(5, { message: "Please enter your area or locality." }).optional().or(z.literal('')),
  landmark: z.string().optional(),
  city: z.string().min(2, { message: "Please enter a valid city name." }),
  state: z.string().min(2, { message: "Please enter a valid state name." }),
});

export type AddressFormData = z.infer<typeof addressSchema>;

const CheckoutAddress: React.FC = () => {
  const navigate = useNavigate();
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
    },
  });

  const onSubmit = (data: AddressFormData) => {
    console.log('Address submitted:', data);
    toast({
      title: "Address Saved",
      description: "Proceeding to payment.",
    });
    // Pass address via state to payment page
    navigate('/payment', { state: { shippingAddress: data } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={() => {}} />
      <main className="flex-grow pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">Shipping Address</h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 bg-card p-6 md:p-8 rounded-lg shadow-lg border border-border">
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutAddress;
