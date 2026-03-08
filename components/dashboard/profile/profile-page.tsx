"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ShieldAlert, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UploadField } from "@/components/globals/upload/upload-field";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type UserProfile = {
  id: string;
  address: string | null;
  phoneNumber: string | null;
  pictureUrl: string | null;
};

type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isSuspended: boolean;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
};

type AuthMeResponseData = {
  user: AuthUser;
};

const userProfileResponse = {
  message: "User profile fetched",
  data: {
    user: {
      id: "6e4230a7-c525-4c44-9bc3-cc3bb407c23d",
      fullName: "Alec Beer",
      email: "admin.1@rtmclass.test",
      role: "ADMIN",
      isSuspended: false,
      profile: {
        id: "01da198e-d8ed-48da-8697-1b4fc4e9ad15",
        address: "6972 Ledner Turnpike, Port Danahaven",
        phoneNumber: "+6252215575786",
        pictureUrl: "https://avatars.githubusercontent.com/u/21774123",
      },
      createdAt: "2026-03-04T11:48:56.834Z",
      updatedAt: "2026-03-04T11:48:56.834Z",
    },
  },
} as const;

const roleLabelMap: Record<string, string> = {
  ADMIN: "Administrator",
  TEACHER: "Teacher",
  STUDENT: "Student",
};

const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  phoneNumber: z
    .string()
    .regex(/^\+\d{8,15}$/, "Phone number must use international format."),
  pictureUrl: z.url("Please enter a valid profile picture URL."),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password must be at least 8 characters."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        "Password must include uppercase, lowercase, number, and symbol."
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Password confirmation does not match.",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type ChangePasswordValues = z.infer<typeof passwordSchema>;

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-US", {
    dateStyle: "long",
  });
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });
};

export function ProfilePage() {
  const fallbackUser = userProfileResponse.data.user;
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: meData } = useGetData<AuthMeResponseData>({
    key: ["auth", "me"],
    endpoint: "/auth/me",
    errorMessage: "Failed to load profile data.",
  });

  const user = meData?.user ?? fallbackUser;
  const roleLabel = roleLabelMap[user.role] ?? user.role;
  const createdAtLabel = formatDate(user.createdAt);
  const updatedAtLabel = formatDateTime(user.updatedAt);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName,
      address: user.profile.address ?? "",
      phoneNumber: user.profile.phoneNumber ?? "",
      pictureUrl: user.profile.pictureUrl ?? "",
    },
  });
  const watchedPictureUrl = profileForm.watch("pictureUrl");

  const passwordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!meData?.user) {
      return;
    }

    profileForm.reset({
      fullName: meData.user.fullName,
      address: meData.user.profile.address ?? "",
      phoneNumber: meData.user.profile.phoneNumber ?? "",
      pictureUrl: meData.user.profile.pictureUrl ?? "",
    });
  }, [meData?.user, profileForm]);

  const updateProfileMutation = usePatchData<{ user: AuthUser }, ProfileFormValues>({
    key: ["auth", "profile", "update"],
    endpoint: "/auth/profile",
    successMessage: "Profile updated successfully.",
    errorMessage: "Failed to update profile.",
    invalidateKeys: [["auth", "me"]],
  });

  const changePasswordMutation = usePatchData<
    null,
    { currentPassword: string; newPassword: string }
  >({
    key: ["auth", "profile", "change-password"],
    endpoint: "/auth/change-password",
    successMessage: "Password changed successfully.",
    errorMessage: "Failed to change password.",
    options: {
      onSuccess: () => {
        passwordForm.reset();
      },
    },
  });

  const onSubmitProfile = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  const onSubmitPassword = (values: ChangePasswordValues) => {
    changePasswordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and account security in one place.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>Your key account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-border/70 p-3">
              <Avatar size="lg">
                <AvatarImage
                  src={watchedPictureUrl || user.profile.pictureUrl || undefined}
                  alt={user.fullName}
                />
                <AvatarFallback>
                  <UserRound className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold leading-none">{user.fullName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge>{roleLabel}</Badge>
              {user.isSuspended ? (
                <Badge variant="destructive">
                  <ShieldAlert className="h-3 w-3" />
                  Account Suspended
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <ShieldCheck className="h-3 w-3" />
                  Account Active
                </Badge>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="rounded-md border border-border/70 bg-muted/25 p-3">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="mt-1 break-all font-medium">{user.email}</p>
              </div>
              <div className="rounded-md border border-border/70 bg-muted/25 p-3">
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="mt-1 font-medium">{createdAtLabel}</p>
              </div>
              <div className="rounded-md border border-border/70 bg-muted/25 p-3">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="mt-1 font-medium">{updatedAtLabel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Keep your profile information up to date.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <FormField
                    control={profileForm.control}
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
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        value={user.email}
                        placeholder="name@example.com"
                        disabled
                        className="bg-muted/40"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <Input
                        value={roleLabel}
                        placeholder="Account role"
                        disabled
                        className="bg-muted/40"
                      />
                    </FormControl>
                  </FormItem>
                  <FormField
                    control={profileForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+6281234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="pictureUrl"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormControl>
                          <UploadField
                            value={field.value}
                            onChange={field.onChange}
                            accept="image/*"
                            label="Profile Picture"
                            showValueInput={false}
                            uploadButtonLabel="Upload Image"
                            successMessage="Profile image uploaded."
                            errorMessage="Failed to upload profile image."
                            validateFile={(file) =>
                              file.type.startsWith("image/")
                                ? null
                                : "Please upload an image file."
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end md:col-span-2">
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Use a strong password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                  className="grid gap-4 md:grid-cols-2"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <PasswordField
                            field={field}
                            placeholder="Enter your current password"
                            shown={showCurrentPassword}
                            toggleShown={() =>
                              setShowCurrentPassword((previous) => !previous)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <PasswordField
                            field={field}
                            placeholder="Create a new password"
                            shown={showNewPassword}
                            toggleShown={() =>
                              setShowNewPassword((previous) => !previous)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <PasswordField
                            field={field}
                            placeholder="Confirm your new password"
                            shown={showConfirmPassword}
                            toggleShown={() =>
                              setShowConfirmPassword((previous) => !previous)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="text-xs text-muted-foreground md:col-span-2">
                    Use uppercase, lowercase, numbers, and symbols.
                  </p>

                  <div className="flex justify-end md:col-span-2">
                    <Button type="submit" disabled={changePasswordMutation.isPending}>
                      {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

type PasswordFieldProps = {
  field: {
    value: string;
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
    name: string;
  };
  placeholder: string;
  shown: boolean;
  toggleShown: () => void;
};

function PasswordField({ field, placeholder, shown, toggleShown }: PasswordFieldProps) {
  return (
    <div className="relative">
      <Input
        type={shown ? "text" : "password"}
        placeholder={placeholder}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        name={field.name}
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-7 w-7 text-muted-foreground"
        onClick={toggleShown}
      >
        {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        <span className="sr-only">{shown ? "Hide password" : "Show password"}</span>
      </Button>
    </div>
  );
}
