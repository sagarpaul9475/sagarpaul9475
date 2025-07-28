import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Paper
} from '@mui/material';
import {
  Psychology,
  Memory,
  Speed,
  Visibility,
  PlayArrow,
  CheckCircle,
  Lock,
  Star,
  Timer,
  TrendingUp
} from '@mui/icons-material';

const TrainingModules: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const trainingCategories = [
    {
      id: 'attention',
      title: 'Attention & Focus',
      description: 'Improve your ability to concentrate and maintain focus',
      icon: <Visibility />,
      color: 'primary',
      modules: [
        {
          id: 'attention-1',
          title: 'Sustained Attention',
          description: 'Practice maintaining focus over extended periods',
          duration: '15 min',
          difficulty: 'Beginner',
          completed: true,
          score: 85,
          locked: false
        },
        {
          id: 'attention-2',
          title: 'Selective Attention',
          description: 'Learn to focus on specific stimuli while ignoring distractions',
          duration: '20 min',
          difficulty: 'Intermediate',
          completed: false,
          score: 0,
          locked: false
        },
        {
          id: 'attention-3',
          title: 'Divided Attention',
          description: 'Train your ability to handle multiple tasks simultaneously',
          duration: '25 min',
          difficulty: 'Advanced',
          completed: false,
          score: 0,
          locked: true
        }
      ]
    },
    {
      id: 'memory',
      title: 'Memory Enhancement',
      description: 'Strengthen your working memory and recall abilities',
      icon: <Memory />,
      color: 'secondary',
      modules: [
        {
          id: 'memory-1',
          title: 'Working Memory',
          description: 'Improve your ability to hold and manipulate information',
          duration: '18 min',
          difficulty: 'Beginner',
          completed: true,
          score: 78,
          locked: false
        },
        {
          id: 'memory-2',
          title: 'Pattern Recognition',
          description: 'Enhance your ability to identify and remember patterns',
          duration: '22 min',
          difficulty: 'Intermediate',
          completed: false,
          score: 0,
          locked: false
        },
        {
          id: 'memory-3',
          title: 'Spatial Memory',
          description: 'Train your spatial awareness and location memory',
          duration: '20 min',
          difficulty: 'Advanced',
          completed: false,
          score: 0,
          locked: true
        }
      ]
    },
    {
      id: 'processing',
      title: 'Processing Speed',
      description: 'Increase your mental processing speed and reaction time',
      icon: <Speed />,
      color: 'success',
      modules: [
        {
          id: 'processing-1',
          title: 'Reaction Time',
          description: 'Improve your response speed to visual and auditory stimuli',
          duration: '12 min',
          difficulty: 'Beginner',
          completed: false,
          score: 0,
          locked: false
        },
        {
          id: 'processing-2',
          title: 'Information Processing',
          description: 'Enhance your ability to quickly process and analyze information',
          duration: '16 min',
          difficulty: 'Intermediate',
          completed: false,
          score: 0,
          locked: false
        },
        {
          id: 'processing-3',
          title: 'Decision Making',
          description: 'Train rapid decision-making under time pressure',
          duration: '20 min',
          difficulty: 'Advanced',
          completed: false,
          score: 0,
          locked: true
        }
      ]
    },
    {
      id: 'cognitive',
      title: 'Cognitive Flexibility',
      description: 'Develop your ability to adapt thinking and switch between tasks',
      icon: <Psychology />,
      color: 'warning',
      modules: [
        {
          id: 'cognitive-1',
          title: 'Task Switching',
          description: 'Practice switching between different types of tasks',
          duration: '15 min',
          difficulty: 'Beginner',
          completed: false,
          score: 0,
          locked: false
        },
        {
          id: 'cognitive-2',
          title: 'Mental Flexibility',
          description: 'Enhance your ability to think creatively and adapt',
          duration: '18 min',
          difficulty: 'Intermediate',
          completed: false,
          score: 0,
          locked: false
        },
        {
          id: 'cognitive-3',
          title: 'Problem Solving',
          description: 'Develop advanced problem-solving and analytical skills',
          duration: '25 min',
          difficulty: 'Advanced',
          completed: false,
          score: 0,
          locked: true
        }
      ]
    }
  ];

  const handleModuleClick = (module: any) => {
    if (module.locked) {
      return;
    }
    setSelectedModule(module);
    setOpenDialog(true);
  };

  const handleStartModule = () => {
    // In a real app, this would start the actual training module
    console.log('Starting module:', selectedModule?.title);
    setOpenDialog(false);
    // Navigate to actual training interface
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Training Modules
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose from our comprehensive collection of cognitive training exercises
        </Typography>
      </Box>

      {/* Training Categories */}
      {trainingCategories.map((category) => (
        <Box key={category.id} sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: `${category.color}.main`, mr: 2 }}>
              {category.icon}
            </Avatar>
            <Box>
              <Typography variant="h5" component="h2">
                {category.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {category.description}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {category.modules.map((module) => (
              <Grid item xs={12} sm={6} md={4} key={module.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: module.locked ? 'default' : 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': module.locked ? {} : { transform: 'translateY(-4px)' }
                  }}
                  onClick={() => handleModuleClick(module)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {module.title}
                      </Typography>
                      {module.locked ? (
                        <Lock color="disabled" />
                      ) : module.completed ? (
                        <CheckCircle color="success" />
                      ) : (
                        <PlayArrow color="primary" />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {module.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<Timer />} 
                        label={module.duration} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={module.difficulty} 
                        size="small" 
                        color={getDifficultyColor(module.difficulty) as any}
                      />
                    </Box>

                    {module.completed && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Score
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {module.score}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={module.score} 
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    )}

                    {module.locked && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Complete previous modules to unlock
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Module Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PlayArrow color="primary" sx={{ mr: 1 }} />
            {selectedModule?.title}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedModule?.description}
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Timer />
              </ListItemIcon>
              <ListItemText 
                primary="Duration" 
                secondary={selectedModule?.duration}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TrendingUp />
              </ListItemIcon>
              <ListItemText 
                primary="Difficulty" 
                secondary={selectedModule?.difficulty}
              />
            </ListItem>
            {selectedModule?.completed && (
              <ListItem>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText 
                  primary="Best Score" 
                  secondary={`${selectedModule?.score}%`}
                />
              </ListItem>
            )}
          </List>

          <Paper sx={{ p: 2, bgcolor: 'grey.50', mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              What you'll learn:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Enhanced cognitive abilities in this specific domain<br/>
              • Improved performance metrics<br/>
              • Better understanding of your cognitive strengths
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleStartModule}
            startIcon={<PlayArrow />}
          >
            Start Training
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TrainingModules;