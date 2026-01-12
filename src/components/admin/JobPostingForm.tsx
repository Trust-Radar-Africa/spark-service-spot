import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { JobPosting, JobPostingFormData, ExperienceLevel } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Loader2 } from 'lucide-react';
import { AVAILABLE_CURRENCIES, getCurrencyFromLocation } from '@/utils/currencyUtils';
import { getCountryOptions } from '@/data/countries';

const experienceLevels: { value: ExperienceLevel; label: string }[] = [
  { value: '0-3', label: '0-3 years' },
  { value: '3-7', label: '3-7 years' },
  { value: '7-10', label: '7-10 years' },
  { value: '10+', label: 'Over 10 years' },
];

const countryOptions = getCountryOptions();

const jobPostingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  country: z.string().min(2, 'Country is required'),
  location: z.string().min(2, 'Specific location is required').max(100),
  experience_required: z.enum(['0-3', '3-7', '7-10', '10+'] as const),
  requirements: z.string().max(2000).optional(),
  benefits: z.string().max(2000).optional(),
  salary_range: z.string().max(100).optional(),
  currency_override: z.string().optional(),
  is_active: z.boolean(),
});

interface JobPostingFormProps {
  initialData?: JobPosting;
  onSubmit: (data: JobPostingFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function JobPostingForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: JobPostingFormProps) {
  const form = useForm<JobPostingFormData & { country: string }>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      country: initialData?.location?.split(',').pop()?.trim() || '',
      location: initialData?.location?.split(',').slice(0, -1).join(',').trim() || '',
      experience_required: initialData?.experience_required || '0-3',
      requirements: initialData?.requirements || '',
      benefits: initialData?.benefits || '',
      salary_range: initialData?.salary_range || '',
      currency_override: initialData?.currency_override || '',
      is_active: initialData?.is_active ?? true,
    },
  });

  const watchedCountry = form.watch('country');
  const watchedLocation = form.watch('location');
  const fullLocation = watchedLocation && watchedCountry ? `${watchedLocation}, ${watchedCountry}` : watchedCountry || '';
  const detectedCurrency = fullLocation ? getCurrencyFromLocation(fullLocation) : 'USD';

  const handleSubmit = async (data: JobPostingFormData & { country: string }) => {
    const formData: JobPostingFormData = {
      ...data,
      location: `${data.location}, ${data.country}`,
    };
    await onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Senior Accountant" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <FormControl>
                  <SearchableSelect
                    options={countryOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select country"
                    searchPlaceholder="Search country..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Location *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., London, Dublin, Atlanta" {...field} />
                </FormControl>
                <FormDescription>City or region within the selected country</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="experience_required"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Required *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
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
            name="salary_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Range</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 50000 - 70000" {...field} />
                </FormControl>
                <FormDescription>
                  Enter numbers only, currency will be formatted automatically
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="currency_override"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(value === 'auto' ? '' : value)} 
                defaultValue={field.value || 'auto'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Auto-detect from location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60">
                  <SelectItem value="auto">
                    Auto-detect ({detectedCurrency})
                  </SelectItem>
                  {AVAILABLE_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Currency is auto-detected from location. Override if detection is wrong.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the role, responsibilities, and what the ideal candidate looks like..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List the skills, qualifications, and experience required..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Optional: List key requirements for candidates</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="benefits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benefits</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List the benefits and perks offered..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Optional: Highlight company benefits</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  When active, this job posting will be visible to candidates
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : initialData ? (
              'Update Job'
            ) : (
              'Create Job'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
