import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import axiosInstance from "@/api/axiosInstance";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  AlertTriangle,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type VerificationState =
  | "loading"
  | "success"
  | "error"
  | "invalid-token"
  | "expired"
  | "already-verified";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [verificationState, setVerificationState] =
    useState<VerificationState>("loading");
  const [error, setError] = useState<string>("");
  const [isResending, setIsResending] = useState(false);

  const checkVerificationStatus = async (
    userEmail: string,
    signal?: AbortSignal
  ) => {
    try {
      const response = await axiosInstance.get(
        `/check-verification-status?email=${encodeURIComponent(userEmail)}`,
        { signal }
      );

      if (response.data?.success && response.data.isVerified) {
        setVerificationState("already-verified");
        toast.success(
          `Selamat datang, ${
            response.data.name || ""
          }! Alamat email ini sudah diverifikasi.`,
          {
            duration: 5000,
            position: "top-center",
          }
        );
        return true;
      }
      return false;
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
        return false;
      }

      console.error("Error checking verification status:", err);

      // Handle different error cases
      if (err.response?.data?.error === "user_not_found") {
        navigate("/register");
        toast.error("Kamu belum terdaftar. Silakan registrasi untuk melanjutkan.");
      } else {
        toast.error("Gagal memeriksa status verifikasi. Please try again.");
      }
      return false;
    }
  };

  const verifyEmail = async (
    verificationToken: string,
    signal?: AbortSignal
  ) => {
    try {
      setVerificationState("loading");
      setError("");

      if (email) {
        const isVerified = await checkVerificationStatus(email, signal);
        if (isVerified) return;
      }

      const response = await axiosInstance.get(
        `/verify-email/${verificationToken}`,
        {
          signal,
        }
      );

      if (response.status === 200 && response.data?.success) {
        setVerificationState("success");
        toast.success("Email berhasil diverifikasi! Kamu sekarang bisa login.", {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
        return;
      }

      console.error("Email verification error:", err);
      let errorMessage =
        "Terjadi kesalahan saat proses verifikasi. Please try again.";
      let state: VerificationState = "error";

      if (err.response?.data?.error === "invalid_or_expired_token") {
        state = "expired";
        errorMessage =
          "Tautan verifikasi sudah kedaluwarsa atau tidak valid. Silakan minta tautan baru.";
      } else if (
        err.response?.status === 400 &&
        err.response?.data?.message === "User sudah terverifikasi"
      ) {
        state = "already-verified";
        errorMessage = "Email address ini sudah terverifikasi.";
      } else if (err.response?.status === 500) {
        errorMessage =
          "An internal server error occurred. Please try again later.";
      }

      setVerificationState(state);
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const verify = async () => {
      if (!token) {
        if (email) {
          const isVerified = await checkVerificationStatus(
            email,
            controller.signal
          );
          if (!isVerified) {
            setVerificationState("invalid-token");
          }
        } else {
          setVerificationState("invalid-token");
        }
        return;
      }

      await verifyEmail(token, controller.signal);
    };

    verify();

    return () => {
      controller.abort();
    };
  }, [token, email]);

  const resendVerificationEmail = async () => {
    try {
      setIsResending(true);

      if (!email) {
        toast.error("Email tidak ditemukan. Please register again.", {
          duration: 4000,
          position: "top-center",
        });
        navigate("/register");
        return;
      }

      const response = await axiosInstance.post("/resend-verification", {
        email,
      });

      if (response.status === 200) {
        toast.success("Verification email sent! Check your inbox.", {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Resend verification error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to resend verification email. Please try again.";

      if (
        err.response?.status === 400 &&
        err.response?.data?.message === "User is already verified"
      ) {
        setVerificationState("already-verified");
      }

      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (verificationState) {
      case "loading":
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="mt-4 text-xl sm:text-2xl font-bold">
                Verifying Email
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full animate-pulse w-3/4"></div>
                </div>
                <p className="text-sm text-gray-600">
                  This may take a few seconds
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case "success":
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="mt-4 text-xl sm:text-2xl font-bold text-green-700">
                Email Verified Successfully!
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Your email has been verified. You can now sign in to your
                account.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-3">
              <Button asChild className="w-full">
                <Link to="/login">Sign In to Your Account</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">Go to Home</Link>
              </Button>
            </CardFooter>
          </Card>
        );

      case "already-verified":
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="mt-4 text-xl sm:text-2xl font-bold text-blue-700">
                Email Already Verified
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Your email address has already been verified.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  No further action is required. You can proceed to sign in.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button asChild className="w-full">
                <Link to="/login">Sign In to Your Account</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">Go to Home</Link>
              </Button>
            </CardFooter>
          </Card>
        );

      case "invalid-token":
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="mt-4 text-xl sm:text-2xl font-bold text-red-700">
                Invalid Verification Link
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                This verification link is invalid or malformed. Please check
                your email or request a new verification link.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Make sure you clicked the complete link from your email.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              {email && (
                <Button
                  onClick={resendVerificationEmail}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link to="/register">Register Again</Link>
              </Button>
            </CardFooter>
          </Card>
        );

      case "expired":
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="mt-4 text-xl sm:text-2xl font-bold text-orange-700">
                Verification Link Expired
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                This verification link has expired. Please request a new
                verification email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Verification links expire after 24 hours for security reasons.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button
                onClick={resendVerificationEmail}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send New Verification Email
                  </>
                )}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Back to Login</Link>
              </Button>
            </CardFooter>
          </Card>
        );

      case "error":
      default:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="mt-4 text-xl sm:text-2xl font-bold text-red-700">
                Verification Failed
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                We couldn't verify your email address. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              {token && (
                <Button onClick={() => verifyEmail(token)} className="w-full">
                  Try Again
                </Button>
              )}
              {email && (
                <Button
                  onClick={resendVerificationEmail}
                  disabled={isResending}
                  variant="outline"
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">{renderContent()}</div>
    </div>
  );
}
