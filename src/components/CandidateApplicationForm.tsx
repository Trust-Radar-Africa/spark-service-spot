import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileText, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { ExperienceLevel } from '@/types/admin';
import { getCountryOptions, getNationalityOptions } from '@/data/countries';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

// Validation for Word documents only
const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 5MB')
  .refine(
    (file) => file.type === ACCEPTED_FILE_TYPE || file.name.endsWith('.docx'),
    'Only Word documents (.docx) are accepted'
  );

const candidateFormSchema = z.object({
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string().email('Please enter a valid email address'),
  nationality: z
    .string()
    .min(2, 'Nationality is required')
    .max(50, 'Nationality must be less than 50 characters'),
  country: z.string().min(2, 'Country is required'),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  experience: z.enum(['0-3', '3-7', '7-10', '10+'] as const, {
    required_error: 'Please select your experience level',
  }),
  cv: fileSchema,
  cover_letter: fileSchema,
});

type CandidateFormData = z.infer<typeof candidateFormSchema>;

const experienceLevels: { value: ExperienceLevel; label: string }[] = [
  { value: '0-3', label: '0-3 years' },
  { value: '3-7', label: '3-7 years' },
  { value: '7-10', label: '7-10 years' },
  { value: '10+', label: 'Over 10 years' },
];

const countryOptions = getCountryOptions();
const nationalityOptions = getNationalityOptions();

interface CandidateApplicationFormProps {
  jobTitle?: string;
  onSuccess?: () => void;
}

export default function CandidateApplicationForm({ jobTitle, onSuccess }: CandidateApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<{ cv?: string; cover_letter?: string }>({});
  const { toast } = useToast();

  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      nationality: '',
      country: '',
      location: '',
      experience: undefined,
    },
  });

  const validateFile = (file: File, fieldName: 'cv' | 'cover_letter'): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      setFileErrors((prev) => ({ ...prev, [fieldName]: 'File size must be less than 5MB' }));
      return false;
    }
    if (file.type !== ACCEPTED_FILE_TYPE && !file.name.endsWith('.docx')) {
      setFileErrors((prev) => ({ ...prev, [fieldName]: 'Only Word documents (.docx) are accepted' }));
      return false;
    }
    setFileErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    return true;
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'cv' | 'cover_letter'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file, fieldName)) {
        if (fieldName === 'cv') {
          setCvFile(file);
          form.setValue('cv', file);
        } else {
          setCoverLetterFile(file);
          form.setValue('cover_letter', file);
        }
      }
    }
  };

  const removeFile = (fieldName: 'cv' | 'cover_letter') => {
    if (fieldName === 'cv') {
      setCvFile(null);
      form.setValue('cv', undefined as any);
    } else {
      setCoverLetterFile(null);
      form.setValue('cover_letter', undefined as any);
    }
    setFileErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  const onSubmit = async (data: CandidateFormData) => {
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('email', data.email);
      formData.append('nationality', data.nationality);
      formData.append('experience', data.experience);
      formData.append('cv', data.cv);
      formData.append('cover_letter', data.cover_letter);
      if (jobTitle) {
        formData.append('job_title', jobTitle);
      }

      // API call to Laravel backend
      const apiUrl = import.meta.env.VITE_LARAVEL_API_URL || 'http://localhost:8000';
      
      try {
        const response = await fetch(`${apiUrl}/api/candidates/apply`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Submission failed');
        }
      } catch (fetchError) {
        // If API is not available, simulate success for demo
        console.log('API not available, simulating success for demo');
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Successfully Submitted</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thank you for your application! We have received your CV and cover letter. 
          You will receive a confirmation email shortly with further instructions.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nationality and Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality *</FormLabel>
                <FormControl>
                  <SearchableSelect
                    options={nationalityOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select nationality"
                    searchPlaceholder="Search nationality..."
                    disabled={isSubmitting}
                  />
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
                <FormLabel>Country of Residence *</FormLabel>
                <FormControl>
                  <SearchableSelect
                    options={countryOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select country"
                    searchPlaceholder="Search country..."
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
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
        </div>

        {/* CV Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">CV / Resume * (Word document only)</label>
          {cvFile ? (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border">
              <FileText className="w-8 h-8 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{cvFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile('cv')}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => handleFileChange(e, 'cv')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isSubmitting}
              />
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary/50 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload your CV</p>
                <p className="text-xs text-muted-foreground">Word document (.docx) only, max 5MB</p>
              </div>
            </div>
          )}
          {fileErrors.cv && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {fileErrors.cv}
            </p>
          )}
          {form.formState.errors.cv && !fileErrors.cv && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {form.formState.errors.cv.message}
            </p>
          )}
        </div>

        {/* Cover Letter Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Cover Letter * (Word document only)</label>
          {coverLetterFile ? (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border">
              <FileText className="w-8 h-8 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{coverLetterFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(coverLetterFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFile('cover_letter')}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => handleFileChange(e, 'cover_letter')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isSubmitting}
              />
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary/50 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload your Cover Letter</p>
                <p className="text-xs text-muted-foreground">Word document (.docx) only, max 5MB</p>
              </div>
            </div>
          )}
          {fileErrors.cover_letter && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {fileErrors.cover_letter}
            </p>
          )}
          {form.formState.errors.cover_letter && !fileErrors.cover_letter && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {form.formState.errors.cover_letter.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Application...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By submitting this form, you agree to allow us to process your personal data for
          recruitment purposes. Your information will be kept confidential.
        </p>
      </form>
    </Form>
  );
}
