import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tab,
  Tabs,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BrainIcon from '@mui/icons-material/Psychology';
import MemoryIcon from '@mui/icons-material/Memory';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SpeedIcon from '@mui/icons-material/Speed';
import FocusIcon from '@mui/icons-material/CenterFocusStrong';
import FlexibilityIcon from '@mui/icons-material/SettingsInputComponent';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  icon: React.ReactNode;
  color: string;
  progress: number;
  rating: number;
  sessions: number;
}

const TrainingModules: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const modules: TrainingModule[] = [
    {
      id: 'attention-focus',
      title: 'Attention & Focus Training',
      description: 'Enhance your ability to maintain sustained attention and resist distractions through targeted EEG-based exercises.',
      category: 'Attention',
      difficulty: 'Beginner',
      duration: 15,
      icon: <FocusIcon />,
      color: theme.palette.primary.main,
      progress: 65,
      rating: 4.8,
      sessions: 12,
    },
    {
      id: 'working-memory',
      title: 'Working Memory Enhancement',
      description: 'Strengthen your working memory capacity and improve information processing abilities.',
      category: 'Memory',
      difficulty: 'Intermediate',
      duration: 20,
      icon: <MemoryIcon />,
      color: theme.palette.secondary.main,
      progress: 40,
      rating: 4.6,
      sessions: 8,
    },
    {
      id: 'cognitive-flexibility',
      title: 'Cognitive Flexibility',
      description: 'Develop mental agility and the ability to switch between different cognitive tasks efficiently.',
      category: 'Flexibility',
      difficulty: 'Advanced',
      duration: 25,
      icon: <FlexibilityIcon />,
      color: theme.palette.success.main,
      progress: 20,
      rating: 4.9,
      sessions: 4,
    },
    {
      id: 'processing-speed',
      title: 'Processing Speed',
      description: 'Improve the speed at which you can perform cognitive tasks while maintaining accuracy.',
      category: 'Speed',
      difficulty: 'Intermediate',
      duration: 18,
      icon: <SpeedIcon />,
      color: theme.palette.warning.main,
      progress: 80,
      rating: 4.7,
      sessions: 16,
    },
    {
      id: 'visual-attention',
      title: 'Visual Attention Training',
      description: 'Enhance your visual processing and spatial attention abilities through specialized exercises.',
      category: 'Attention',
      difficulty: 'Beginner',
      duration: 12,
      icon: <VisibilityIcon />,
      color: theme.palette.info.main,
      progress: 90,
      rating: 4.5,
      sessions: 20,
    },
    {
      id: 'executive-control',
      title: 'Executive Control',
      description: 'Strengthen your executive functions including planning, decision-making, and impulse control.',
      category: 'Control',
      difficulty: 'Advanced',
      duration: 30,
      icon: <BrainIcon />,
      color: theme.palette.error.main,
      progress: 10,
      rating: 4.8,
      sessions: 2,
    },
  ];

  const categories = ['All', 'Attention', 'Memory', 'Flexibility', 'Speed', 'Control'];

  const filteredModules = selectedTab === 0 
    ? modules 
    : modules.filter(module => module.category === categories[selectedTab]);

  const handleModuleClick = (module: TrainingModule) => {
    setSelectedModule(module);
    setDialogOpen(true);
  };

  const handleStartTraining = () => {
    setDialogOpen(false);
    // In a real app, you would navigate to the specific training module
    navigate('/eeg-monitoring');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Training Modules
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Personalized EEG-based cognitive training programs
          </Typography>
        </Box>

        {/* Category Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            centered
            sx={{
              '& .MuiTab-root': {
                minWidth: 80,
                fontWeight: 600,
              },
            }}
          >
            {categories.map((category, index) => (
              <Tab key={index} label={category} />
            ))}
          </Tabs>
        </Box>

        {/* Training Modules Grid */}
        <Grid container spacing={3}>
          {filteredModules.map((module) => (
            <Grid item xs={12} sm={6} md={4} key={module.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
                onClick={() => handleModuleClick(module)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: module.color,
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      {module.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h3">
                        {module.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip
                          label={module.difficulty}
                          size="small"
                          color={getDifficultyColor(module.difficulty) as any}
                        />
                        <Chip
                          label={`${module.duration} min`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {module.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2">{module.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={module.progress} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{module.rating}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {module.sessions} sessions
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    sx={{ bgcolor: module.color }}
                  >
                    Start Training
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Module Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedModule && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: selectedModule.color,
                      width: 40,
                      height: 40,
                      mr: 2,
                    }}
                  >
                    {selectedModule.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedModule.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip
                        label={selectedModule.difficulty}
                        size="small"
                        color={getDifficultyColor(selectedModule.difficulty) as any}
                      />
                      <Chip
                        label={`${selectedModule.duration} minutes`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {selectedModule.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Your Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={selectedModule.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {selectedModule.progress}% complete • {selectedModule.sessions} sessions completed
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarIcon sx={{ color: theme.palette.warning.main, fontSize: 20, mr: 0.5 }} />
                    <Typography variant="body1">{selectedModule.rating} rating</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Category: {selectedModule.category}
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setDialogOpen(false)} startIcon={<InfoIcon />}>
                  Learn More
                </Button>
                <Button
                  variant="contained"
                  onClick={handleStartTraining}
                  startIcon={<PlayArrowIcon />}
                  sx={{ bgcolor: selectedModule.color }}
                >
                  Start Training
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Container>
  );
};

export default TrainingModules;