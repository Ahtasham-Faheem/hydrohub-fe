import { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { staffService } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

interface OnboardingProgressBarProps {
  staffId: string | null;
  currentStep: number;
  totalSteps: number;
  onboardingProgress?: {
    [key: string]: boolean | number;
    'progress percentage'?: number | any;
  };
}

interface ProgressData {
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
  stepStatus: {
    [key: string]: 'completed' | 'in_progress' | 'pending';
  };
}

export const OnboardingProgressBar = ({ 
  staffId, 
  currentStep, 
  totalSteps,
  onboardingProgress
}: OnboardingProgressBarProps) => {
  const { colors } = useTheme();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);

  useEffect(() => {
    if (onboardingProgress) {
      // Use the onboardingProgress data directly from the API response
      const completedSections = Object.entries(onboardingProgress)
        .filter(([key, value]) => key !== 'progress percentage' && value === true)
        .length;
      
      const totalSections = Object.keys(onboardingProgress).length - 1; // Exclude 'progress percentage'
      const progressPercentage = onboardingProgress['progress percentage'] || 
        (completedSections / totalSections) * 100;

      setProgressData({
        completedSteps: completedSections,
        totalSteps: totalSections,
        progressPercentage: progressPercentage,
        stepStatus: {}
      });
    } else if (staffId) {
      fetchProgress();
    }
  }, [staffId, currentStep, onboardingProgress]);

  const fetchProgress = async () => {
    if (!staffId) return;
    try {
      const data = await staffService.getOnboardingProgress(staffId);
      setProgressData(data);
    } catch (error) {
      console.error('Failed to fetch onboarding progress:', error);
      // Fallback to local progress calculation
      setProgressData({
        completedSteps: currentStep,
        totalSteps: totalSteps,
        progressPercentage: (currentStep / totalSteps) * 100,
        stepStatus: {}
      });
    } finally {
    }
  };

  // Calculate progress based on current step if no API data
  const getProgressPercentage = () => {
    if (progressData && typeof progressData.progressPercentage === 'number') {
      return Math.max(0, Math.min(100, progressData.progressPercentage));
    }
    const calculated = (currentStep / totalSteps) * 100;
    return Math.max(0, Math.min(100, calculated || 0));
  };

  const getCompletedSteps = () => {
    if (progressData && typeof progressData.completedSteps === 'number') {
      return progressData.completedSteps;
    }
    return currentStep || 0;
  };

  const getTotalSteps = () => {
    if (progressData && typeof progressData.totalSteps === 'number') {
      return progressData.totalSteps;
    }
    return totalSteps;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ color: colors.text.secondary, fontWeight: 600 }}
        >
          {getCompletedSteps()} of {getTotalSteps()} steps completed
        </Typography>
      </Box>
      
      <LinearProgress
        variant="determinate"
        value={getProgressPercentage()}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.border.secondary,
          '& .MuiLinearProgress-bar': {
            backgroundColor: colors.primary[600],
            borderRadius: 4,
          },
        }}
      />
      
      <Typography 
        variant="caption" 
        sx={{ 
          color: colors.text.tertiary, 
          mt: 0.5,
          display: 'block'
        }}
      >
        {Math.round(getProgressPercentage())}% complete
      </Typography>
    </Box>
  );
};