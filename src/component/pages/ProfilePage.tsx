// import React, { useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { ArrowLeft, Camera, Mail, User, Clock, Users, X, Check } from "lucide-react";
// import { api } from "../../api/axios";
// import { useAuthStore } from "../../hooks/useAuthStore";

// interface UserProfile {
//   id: number;
//   username: string;
//   email: string;
//   avatar?: string;
//   online: boolean;
//   createdAt: string;
//   mutualChatRoomsCount: number;
// }

// const fetchProfile = async (username: string): Promise<UserProfile> => {
//   const res = await api.get(`/users/profile/${username}`);
//   return res.data;
// };

// const uploadAvatar = async (file: File): Promise<string> => {
//   const formData = new FormData();
//   formData.append("file", file);
//   const res = await api.post("/users/upload-avatar", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };

// const formatJoinDate = (dateStr: string) => {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });
// };

// const ProfilePage: React.FC = () => {
//   const { username } = useParams<{ username: string }>();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [preview, setPreview] = useState<string | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploadError, setUploadError] = useState<string | null>(null);
//   const [uploadSuccess, setUploadSuccess] = useState(false);

//   const loggedInUsername = useAuthStore((state) => state.username);
//   const isOwnProfile = loggedInUsername === username;
//   const setAvatar = useAuthStore((state) => state.setAvatar);


//   const { data: profile, isLoading, isError } = useQuery<UserProfile>({
//     queryKey: ["profile", username],
//     queryFn: () => fetchProfile(username!),
//     enabled: !!username,
//   });

//   const avatarMutation = useMutation({
//     mutationFn: uploadAvatar,
//     onSuccess: (url) => {
//       setUploadError(null);
//       setPreview(null);
//       setSelectedFile(null);
//       setUploadSuccess(true);
//       setTimeout(() => setUploadSuccess(false), 3000);
//       setAvatar(url);
//       queryClient.invalidateQueries({ queryKey: ["profile", username] });
//     },
//     onError: () => {
//       setUploadError("Failed to upload image. Please try again.");
//     },
//   });

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploadError(null);

//     if (!file.type.startsWith("image/")) {
//       setUploadError("Please select an image file.");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setUploadError("Image must be less than 5MB.");
//       return;
//     }

//     // ✅ show preview before uploading
//     const reader = new FileReader();
//     reader.onload = () => setPreview(reader.result as string);
//     reader.readAsDataURL(file);
//     setSelectedFile(file);
//   };

//   const handleConfirmUpload = () => {
//     if (selectedFile) avatarMutation.mutate(selectedFile);
//   };

//   const handleCancelPreview = () => {
//     setPreview(null);
//     setSelectedFile(null);
//     setUploadError(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   if (isLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-[#0b141a]">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
//           <span className="text-gray-400 text-sm">Loading profile...</span>
//         </div>
//       </div>
//     );
//   }

//   if (isError || !profile) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-[#0b141a]">
//         <div className="text-center">
//           <p className="text-red-400 mb-4">Failed to load profile.</p>
//           <button onClick={() => navigate(-1)} className="text-green-400 hover:text-green-300 text-sm">
//             Go back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen flex flex-col bg-[#0b141a] overflow-y-auto">

//       {/* Header */}
//       <div className="flex items-center gap-4 px-4 py-3 bg-[#202c33] border-b border-gray-700 flex-shrink-0">
//         <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-all">
//           <ArrowLeft className="w-5 h-5" />
//         </button>
//         <span className="text-white font-semibold text-base">Profile</span>

//         {/* Success message in header */}
//         {uploadSuccess && (
//           <div className="ml-auto flex items-center gap-1.5 text-green-400 text-sm">
//             <Check className="w-4 h-4" />
//             <span>Photo updated!</span>
//           </div>
//         )}
//       </div>

//       {/* Avatar section */}
//       <div className="flex flex-col items-center py-8 bg-[#202c33]">
//         <div className="relative">

//           {/* Avatar image — shows preview if selected */}
//           <img
//             src={preview || profile.avatar || "/default-avatar.png"}
//             alt={profile.username}
//             className={`w-32 h-32 rounded-full object-cover border-4 transition-all
//               ${preview ? "border-green-500" : "border-gray-700"}
//               ${avatarMutation.isPending ? "opacity-60" : ""}
//             `}
//           />

//           {/* Upload spinner overlay */}
//           {avatarMutation.isPending && (
//             <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
//               <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
//             </div>
//           )}

//           {/* Online indicator */}
//           {profile.online && !preview && (
//             <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-[#202c33] rounded-full" />
//           )}

//           {/* Camera button — only on own profile, hidden when previewing */}
//           {isOwnProfile && !preview && !avatarMutation.isPending && (
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="absolute bottom-0 right-0 w-9 h-9 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-all"
//               aria-label="Upload profile picture"
//             >
//               <Camera className="w-4 h-4 text-black" />
//             </button>
//           )}

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={handleFileChange}
//           />
//         </div>

//         {/* Preview confirm/cancel buttons */}
//         {preview && !avatarMutation.isPending && (
//           <div className="flex items-center gap-3 mt-4">
//             <button
//               onClick={handleCancelPreview}
//               className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm transition-all"
//             >
//               <X className="w-4 h-4" />
//               Cancel
//             </button>
//             <button
//               onClick={handleConfirmUpload}
//               className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-black text-sm font-medium transition-all"
//             >
//               <Check className="w-4 h-4" />
//               Upload
//             </button>
//           </div>
//         )}

//         {/* Username */}
//         <h1 className="text-white text-xl font-semibold mt-4">{profile.username}</h1>

//         {/* Online status */}
//         <span className={`text-sm mt-1 ${profile.online ? "text-green-400" : "text-gray-400"}`}>
//           {profile.online ? "Online" : "Offline"}
//         </span>

//         {/* Upload hint */}
//         {isOwnProfile && !preview && (
//           <p className="text-gray-500 text-xs mt-2">Tap the camera to change photo</p>
//         )}

//         {/* Preview hint */}
//         {preview && !avatarMutation.isPending && (
//           <p className="text-green-400 text-xs mt-2">Looking good! Confirm to upload.</p>
//         )}

//         {/* Upload error */}
//         {uploadError && (
//           <p className="text-red-400 text-xs mt-2">{uploadError}</p>
//         )}
//       </div>

//       {/* Info section */}
//       <div className="flex flex-col gap-1 mt-2 px-4">
//         <p className="text-green-400 text-xs font-medium px-2 py-3 uppercase tracking-wider">About</p>

//         <div className="flex items-center gap-4 bg-[#202c33] px-4 py-4 rounded-lg">
//           <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
//           <div className="flex flex-col">
//             <span className="text-white text-sm">{profile.email}</span>
//             <span className="text-gray-400 text-xs mt-0.5">Email</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-4 bg-[#202c33] px-4 py-4 rounded-lg mt-1">
//           <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
//           <div className="flex flex-col">
//             <span className="text-white text-sm">@{profile.username}</span>
//             <span className="text-gray-400 text-xs mt-0.5">Username</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-4 bg-[#202c33] px-4 py-4 rounded-lg mt-1">
//           <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
//           <div className="flex flex-col">
//             <span className="text-white text-sm">{formatJoinDate(profile.createdAt)}</span>
//             <span className="text-gray-400 text-xs mt-0.5">Joined</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-4 bg-[#202c33] px-4 py-4 rounded-lg mt-1">
//           <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
//           <div className="flex flex-col">
//             <span className="text-white text-sm">{profile.mutualChatRoomsCount} mutual chat rooms</span>
//             <span className="text-gray-400 text-xs mt-0.5">Chat Rooms</span>
//           </div>
//         </div>
//       </div>

//       <div className="h-8" />
//     </div>
//   );
// };

// export default ProfilePage;







import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Camera, Mail, User, Clock, Users, X, Check, type LucideIcon } from "lucide-react";
import { api } from "../../api/axios";
import { useAuthStore } from "../../hooks/useAuthStore";

// ── Types ─────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  online: boolean;
  createdAt: string;
  mutualChatRoomsCount: number;
}

// ── API ───────────────────────────────────────────────────────────────────────

const fetchProfile = async (username: string): Promise<UserProfile> => {
  const res = await api.get(`/users/profile/${username}`);
  return res.data;
};

const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/users/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatJoinDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const FILE_VALIDATION = {
  maxSize: 5 * 1024 * 1024,
  validate: (file: File): string | null => {
    if (!file.type.startsWith("image/")) return "Please select an image file.";
    if (file.size > FILE_VALIDATION.maxSize) return "Image must be less than 5MB.";
    return null;
  },
};

// ── Reusable components ───────────────────────────────────────────────────────

// ✅ DRY: single info row component used for all profile fields
const InfoRow: React.FC<{
  icon: LucideIcon;
  value: string;
  label: string;
}> = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-4 bg-[#202c33] px-4 py-4 rounded-lg mt-1">
    <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
    <div className="flex flex-col">
      <span className="text-white text-sm">{value}</span>
      <span className="text-gray-400 text-xs mt-0.5">{label}</span>
    </div>
  </div>
);

// ✅ DRY: loading state component
const LoadingScreen: React.FC = () => (
  <div className="h-screen flex items-center justify-center bg-[#0b141a]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-gray-400 text-sm">Loading profile...</span>
    </div>
  </div>
);

// ✅ DRY: error state component
const ErrorScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="h-screen flex items-center justify-center bg-[#0b141a]">
    <div className="text-center">
      <p className="text-red-400 mb-4">Failed to load profile.</p>
      <button onClick={onBack} className="text-green-400 hover:text-green-300 text-sm">
        Go back
      </button>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const loggedInUsername = useAuthStore((state) => state.username);
  const setAvatar = useAuthStore((state) => state.setAvatar);
  const isOwnProfile = loggedInUsername === username;

  const { data: profile, isLoading, isError } = useQuery<UserProfile>({
    queryKey: ["profile", username],
    queryFn: () => fetchProfile(username!),
    enabled: !!username,
  });

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (url) => {
      setUploadError(null);
      setPreview(null);
      setSelectedFile(null);
      setUploadSuccess(true);
      setAvatar(url);
      setTimeout(() => setUploadSuccess(false), 3000);
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
    },
    onError: () => setUploadError("Failed to upload image. Please try again."),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = FILE_VALIDATION.validate(file);
    if (error) { setUploadError(error); return; }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const handleConfirmUpload = () => {
    if (selectedFile) avatarMutation.mutate(selectedFile);
  };

  const handleCancelPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isLoading) return <LoadingScreen />;
  if (isError || !profile) return <ErrorScreen onBack={() => navigate(-1)} />;

  // ✅ DRY: profile info rows defined as data, not repeated JSX
  const infoRows = [
    { icon: Mail,  value: profile.email,                                    label: "Email" },
    { icon: User,  value: `@${profile.username}`,                           label: "Username" },
    { icon: Clock, value: formatJoinDate(profile.createdAt),                label: "Joined" },
    { icon: Users, value: `${profile.mutualChatRoomsCount} mutual chat rooms`, label: "Chat Rooms" },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#0b141a] overflow-y-auto">

      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-[#202c33] border-b border-gray-700 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-semibold text-base">Profile</span>
        {uploadSuccess && (
          <div className="ml-auto flex items-center gap-1.5 text-green-400 text-sm">
            <Check className="w-4 h-4" />
            <span>Photo updated!</span>
          </div>
        )}
      </div>

      {/* Avatar section */}
      <div className="flex flex-col items-center py-8 bg-[#202c33]">
        <div className="relative">
          <img
            src={preview || profile.avatar || "/default-avatar.png"}
            alt={profile.username}
            className={`w-32 h-32 rounded-full object-cover border-4 transition-all
              ${preview ? "border-green-500" : "border-gray-700"}
              ${avatarMutation.isPending ? "opacity-60" : ""}
            `}
          />

          {avatarMutation.isPending && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {profile.online && !preview && (
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-[#202c33] rounded-full" />
          )}

          {isOwnProfile && !preview && !avatarMutation.isPending && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-9 h-9 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-all"
            >
              <Camera className="w-4 h-4 text-black" />
            </button>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        {/* Preview actions */}
        {preview && !avatarMutation.isPending && (
          <div className="flex items-center gap-3 mt-4">
            <button onClick={handleCancelPreview} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm transition-all">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button onClick={handleConfirmUpload} className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-black text-sm font-medium transition-all">
              <Check className="w-4 h-4" /> Upload
            </button>
          </div>
        )}

        <h1 className="text-white text-xl font-semibold mt-4">{profile.username}</h1>
        <span className={`text-sm mt-1 ${profile.online ? "text-green-400" : "text-gray-400"}`}>
          {profile.online ? "Online" : "Offline"}
        </span>

        {/* ✅ DRY: single conditional for hint/error messages */}
        {uploadError && <p className="text-red-400 text-xs mt-2">{uploadError}</p>}
        {!uploadError && preview && !avatarMutation.isPending && (
          <p className="text-green-400 text-xs mt-2">Looking good! Confirm to upload.</p>
        )}
        {!uploadError && !preview && isOwnProfile && (
          <p className="text-gray-500 text-xs mt-2">Tap the camera to change photo</p>
        )}
      </div>

      {/* Info section — ✅ DRY: rendered from data array */}
      <div className="flex flex-col gap-1 mt-2 px-4">
        <p className="text-green-400 text-xs font-medium px-2 py-3 uppercase tracking-wider">About</p>
        {infoRows.map((row) => (
          <InfoRow key={row.label} icon={row.icon} value={row.value} label={row.label} />
        ))}
      </div>

      <div className="h-8" />
    </div>
  );
};

export default ProfilePage;
