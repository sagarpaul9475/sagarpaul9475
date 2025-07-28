import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import {
  PlayArrow,
  CheckCircle,
  Lock,
  School,
  Timer,
  TrendingUp,
  Info,
} from '@mui/icons-material';

interface TrainingModule {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'locked' | 'available' | 'completed';
  progress: number;
  objectives: string[];
  prerequisites: string[];
}

const TrainingModules: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const modules: TrainingModule[] = [
    {
      id: 1,
      title: 'Alpha Wave Training',
      description: 'Learn to enhance your alpha brain waves for improved relaxation and creativity.',
      duration: '15 minutes',
      difficulty: 'Beginner',
      status: 'completed',
      progress: 100,
      objectives: [
        'Understand alpha wave characteristics',
        'Practice relaxation techniques',
        'Achieve consistent alpha wave production',
      ],
      prerequisites: ['None'],
    },
    {
      id: 2,
      title: 'Focus Enhancement',
      description: 'Develop concentration and attention span through targeted brain wave training.',
      duration: '20 minutes',
      difficulty: 'Beginner',
      status: 'available',
      progress: 65,
      objectives: [
        'Improve attention span',
        'Reduce mental distractions',
        'Enhance cognitive performance',
      ],
      prerequisites: ['Alpha Wave Training'],
    },
    {
      id: 3,
      title: 'Beta Wave Optimization',
      description: 'Optimize beta waves for enhanced alertness and problem-solving abilities.',
      duration: '25 minutes',
      difficulty: 'Intermediate',
      status: 'available',
      progress: 0,
      objectives: [
        'Increase beta wave activity',
        'Improve logical thinking',
        'Enhance problem-solving skills',
      ],
      prerequisites: ['Focus Enhancement'],
    },
    {
      id: 4,
      title: 'Theta Wave Meditation',
      description: 'Master theta wave states for deep meditation and enhanced intuition.',
      duration: '30 minutes',
      difficulty: 'Intermediate',
      status: 'locked',
      progress: 0,
      objectives: [
        'Achieve deep meditation states',
        'Enhance intuitive thinking',
        'Improve memory consolidation',
      ],
      prerequisites: ['Beta Wave Optimization'],
    },
    {
      id: 5,
      title: 'Gamma Wave Training',
      description: 'Advanced training for gamma wave enhancement and peak cognitive performance.',
      duration: '35 minutes',
      difficulty: 'Advanced',
      status: 'locked',
      progress: 0,
      objectives: [
        'Achieve peak cognitive performance',
        'Enhance information processing',
        'Improve learning capabilities',
      ],
      prerequisites: ['Theta Wave Meditation'],
    },
  ];

  const handleModuleClick = (module: TrainingModule) => {
    setSelectedModule(module);
    setOpenDialog(true);
  };

  const handleStartTraining = (module: TrainingModule) => {
    // In a real app, this would navigate to the training session
    console.log('Starting training for:', module.title);
    setOpenDialog(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'available':
        return <PlayArrow sx={{ color: 'primary.main' }} />;
      case 'locked':
        return <Lock sx={{ color: 'text.disabled' }} />;
      default:
        return <Info sx={{ color: 'text.secondary' }} />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'warning';
      case 'Advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Training Modules
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose from our comprehensive collection of EEG training modules designed to enhance your cognitive abilities.
      </Typography>

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} md={6} lg={4} key={module.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: module.status !== 'locked' ? 'pointer' : 'default',
                '&:hover': module.status !== 'locked' ? {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s',
                } : {},
              }}
              onClick={() => handleModuleClick(module)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getStatusIcon(module.status)}
                  <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                    {module.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {module.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Timer sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    {module.duration}
                  </Typography>
                  <Chip
                    label={module.difficulty}
                    size="small"
                    color={getDifficultyColor(module.difficulty) as any}
                  />
                </Box>

                {module.status !== 'locked' && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {module.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={module.progress}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}

                {module.status === 'locked' && (
                  <Typography variant="body2" color="text.secondary">
                    Complete previous modules to unlock
                  </Typography>
                )}
              </CardContent>

              <CardActions>
                {module.status === 'available' && (
                  <Button
                    size="small"
                    startIcon={<PlayArrow />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartTraining(module);
                    }}
                  >
                    Continue
                  </Button>
                )}
                {module.status === 'completed' && (
                  <Button
                    size="small"
                    startIcon={<TrendingUp />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartTraining(module);
                    }}
                  >
                    Retrain
                  </Button>
                )}
                <Button
                  size="small"
                  startIcon={<Info />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModuleClick(module);
                  }}
                >
                  Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Module Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedModule && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 1 }} />
                {selectedModule.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedModule.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Chip
                  icon={<Timer />}
                  label={selectedModule.duration}
                  variant="outlined"
                />
                <Chip
                  label={selectedModule.difficulty}
                  color={getDifficultyColor(selectedModule.difficulty) as any}
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                Learning Objectives
              </Typography>
              <List dense>
                {selectedModule.objectives.map((objective, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                    </ListItemIcon>
                    <ListItemText primary={objective} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom>
                Prerequisites
              </Typography>
              <List dense>
                {selectedModule.prerequisites.map((prereq, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <School sx={{ fontSize: 16, color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText primary={prereq} />
                  </ListItem>
                ))}
              </List>

              {selectedModule.status !== 'locked' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progress: {selectedModule.progress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={selectedModule.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              {selectedModule.status === 'available' && (
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => handleStartTraining(selectedModule)}
                >
                  Start Training
                </Button>
              )}
              {selectedModule.status === 'completed' && (
                <Button
                  variant="contained"
                  startIcon={<TrendingUp />}
                  onClick={() => handleStartTraining(selectedModule)}
                >
                  Retrain
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default TrainingModules;