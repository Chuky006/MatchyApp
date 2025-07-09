import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axios";
import { useAuth } from "../context/useAuth";

// 🚫 Disabled mentee profile check
export const useMenteeProfileCheck = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMenteeProfile = async () => {
      try {
        const res = await axiosInstance.get("/profile/me");
        const profile = res.data.profile;
        console.log("📥 Mentee profile loaded", profile);
        // 🚫 No redirect logic
      } catch (err) {
        console.error("❌ Mentee profile check failed", err);
      }
    };

    if (user?.role === "mentee") {
      checkMenteeProfile();
    }
  }, [user, navigate]);
};

// 🚫 Disabled mentor profile check
export const useMentorProfileCheck = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMentorProfile = async () => {
      try {
        const res = await axiosInstance.get(`/mentor/${user?.id}`);
        const profile = res.data.profile;
        console.log("📥 Mentor profile loaded", profile);
        // 🚫 No redirect logic
      } catch (err) {
        console.error("❌ Mentor profile check failed", err);
      }
    };

    if (user?.role === "mentor") {
      checkMentorProfile();
    }
  }, [user, navigate]);
};
