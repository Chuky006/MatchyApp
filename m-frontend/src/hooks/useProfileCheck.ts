import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axios";
import { useAuth } from "../context/useAuth";

//Hook for mentees
export const useMenteeProfileCheck = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMenteeProfile = async () => {
      try {
        const res = await axiosInstance.get("/profile/me");
        const profile = res.data.profile;

        const isBioEmpty = !profile.bio || profile.bio.trim() === "";
        const isGoalsEmpty = !Array.isArray(profile.goals) || profile.goals.length === 0;

        if (user?.role === "mentee" && (isBioEmpty || isGoalsEmpty)) {
          console.log("🔁 Redirecting mentee: incomplete profile");
          navigate("/mentee/profile");
        }
      } catch (err) {
        console.error("❌ Mentee profile check failed", err);
        navigate("/mentee/profile");
      }
    };

    if (user?.role === "mentee") {
      checkMenteeProfile();
    }
  }, [user, navigate]);
};

// Hook for mentors
export const useMentorProfileCheck = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMentorProfile = async () => {
      try {
        const res = await axiosInstance.get("/profile/me");
        const profile = res.data.profile;

        const isBioEmpty = !profile.bio || profile.bio.trim() === "";
        const isSkillsEmpty = !Array.isArray(profile.skills) || profile.skills.length === 0;
        const isExperienceEmpty = !profile.experience || profile.experience.trim() === "";

        if (user?.role === "mentor" && (isBioEmpty || isSkillsEmpty || isExperienceEmpty)) {
          console.log("🔁 Redirecting mentor: incomplete profile");
          navigate("/mentor/profile");
        }
      } catch (err) {
        console.error("❌ Mentor profile check failed", err);
        navigate("/mentor/profile");
      }
    };

    if (user?.role === "mentor") {
      checkMentorProfile();
    }
  }, [user, navigate]);
};